import { createClient } from '@supabase/supabase-js';
import { whatsappService } from './whatsapp';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environmental variables
dotenv.config();

class SupabaseWatcher {
  private supabaseUrl: string = '';
  private supabaseAnonKey: string = '';
  private supabaseClient: any = null;
  private seenOrderIds: Set<string> = new Set<string>();
  private isInitialized: boolean = false;
  private checkIntervalMs: number = 10000; // Poll every 10 seconds
  private lastPollTime: Date = new Date();
  private isPollingActive: boolean = false;

  constructor() {
    this.supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
    this.supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

    // Sanitize supabase url if it ends with /rest/v1
    if (this.supabaseUrl) {
      this.supabaseUrl = this.supabaseUrl.replace(/\/+$/, '');
      if (this.supabaseUrl.endsWith('/rest/v1')) {
        this.supabaseUrl = this.supabaseUrl.substring(0, this.supabaseUrl.length - 8);
      }
      this.supabaseUrl = this.supabaseUrl.replace(/\/+$/, '');
    }
  }

  /**
   * Initializes and starts the background watcher daemon
   */
  public async start() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛰️  SUPABASE LIVE ORDER BACKGROUND DAEMON ACTIVE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Base Supabase URL: ${this.supabaseUrl || 'NOT CONFIGURED ⚠️'}`);

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.warn('⚠️ Supabase credentials are not configured in your environmental variables.');
      console.warn('👉 Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your settings.');
      console.warn('🕒 The background watcher is idling. It will attempt to connect as soon as you add the keys.');
      this.scheduleCredentialRetry();
      return;
    }

    try {
      this.supabaseClient = createClient(this.supabaseUrl, this.supabaseAnonKey);
      await this.loadExistingOrders();

      // Start Realtime subscription (Instant 0-second notifications)
      this.subscribeRealtime();

      // Start fallback interval polling (Robust 10-second sync backup)
      this.startPollingLoop();

      // Register automatic connection trigger to sync outstanding unnotified orders
      whatsappService.onConnect(() => {
        this.syncAllUnnotifiedOrders();
      });

      this.isInitialized = true;
      console.log('✅ Supabase Watcher daemon compiled and registered onConnect listener with Baileys.');
    } catch (err: any) {
      console.error('❌ Failed to bootsup Supabase background client:', err.message || err);
    }
  }

  /**
   * Periodically check for credentials if they weren't defined at boot
   */
  private scheduleCredentialRetry() {
    setTimeout(() => {
      // Re-read keys
      this.supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
      this.supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

      if (this.supabaseUrl && this.supabaseAnonKey) {
        this.start();
      } else {
        this.scheduleCredentialRetry();
      }
    }, 15000);
  }

  /**
   * Loads existing order IDs on initial bootup to ensure we don't
   * send duplicate notifications for orders placed in the past.
   */
  private async loadExistingOrders() {
    console.log('⚡ Crawling existing Supabase orders table to configure seen order indexes...');
    try {
      const { data, error } = await this.supabaseClient
        .from('orders')
        .select('id')
        .order('date', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      if (data) {
        data.forEach((order: any) => {
          if (order.id) {
            this.seenOrderIds.add(order.id);
          }
        });
        console.log(`⭐ Seeded seenOrderIds index cache with ${this.seenOrderIds.size} recent order IDs.`);
      }
    } catch (err: any) {
      console.error('⚠️ Could not load existing orders catalog on server start:', err.message || err);
      console.log('👉 Defaulting to active live monitoring; new logs will populate cache dynamically.');
    }
  }

  /**
   * Near real-time websocket listener for supabase postgres changes
   */
  private subscribeRealtime() {
    try {
      console.log('📬 Initializing Supabase Realtime channel subscription...');
      const channel = this.supabaseClient
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload: any) => {
            console.log('🔥 [REALTIME] Captured INSERT event on public.orders table!');
            if (payload && payload.new) {
              this.handleNewOrderRow(payload.new, 'REALTIME-WS');
            }
          }
        )
        .subscribe((status: string) => {
          console.log(`📊 Supabase Realtime socket status connection: [${status}]`);
        });
    } catch (e: any) {
      console.warn('🗣️ Supabase realtime subscription failed: It might be deactivated. Polling fallback remains functional.', e.message || e);
    }
  }

  /**
   * Setup a robust, 10-second active polling mechanism
   */
  private startPollingLoop() {
    if (this.isPollingActive) return;
    this.isPollingActive = true;

    setInterval(async () => {
      try {
        await this.pollNewOrders();
      } catch (err: any) {
        console.error('🍂 Supabase orders poll cycle threw exception:', err.message || err);
      }
    }, this.checkIntervalMs);
  }

  /**
   * Query database for recently created rows
   */
  private async pollNewOrders() {
    if (!this.supabaseClient) return;

    // Fetch the 15 latest orders sorted by order ID or timestamp representation
    const { data: latestOrders, error } = await this.supabaseClient
      .from('orders')
      .select('*')
      .order('date', { ascending: false })
      .limit(15);

    if (error) {
      // Don't crash background thread, simply log error
      console.error('📡 [POLL-ERROR] DB connection timed out or is rate limited:', error.message);
      return;
    }

    if (latestOrders && Array.isArray(latestOrders)) {
      let loggedNewOrders = 0;
      for (const order of latestOrders) {
        if (order.id && !this.seenOrderIds.has(order.id)) {
          loggedNewOrders++;
          await this.handleNewOrderRow(order, 'DB-POLLING');
        }
      }
    }
  }

  /**
   * Formats and dispatches highly polished WhatsApp messages to both Admin and Customer for new orders, and caches them.
   */
  private async handleNewOrderRow(order: any, source: string) {
    const orderId = order.id;
    if (this.seenOrderIds.has(orderId)) {
      return; // Safeguard to prevent multiple memory dispatches
    }

    // Mark as processed instantly to handle thread safety
    this.seenOrderIds.add(orderId);

    console.log(`📬 [NEW-ORDER] Captured via [${source}] | ID: ${orderId}`);

    try {
      const items = order.items || [];
      const total = order.total || 0;
      const dateString = order.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const shippingAddress = order.shipping_address || {};

      const customerName = shippingAddress.name || 'Anonymous Client';
      const customerPhone = shippingAddress.phone || 'N/A';
      
      const fullAddress = [
        shippingAddress.address || '',
        shippingAddress.city || '',
        shippingAddress.state || '',
        shippingAddress.pincode ? `PIN: ${shippingAddress.pincode}` : ''
      ].filter(Boolean).join(', ');

      const targetNumber = (process.env.VITE_ADMIN_WHATSAPP || '919690986010').replace(/\D/g, '');

      // Format items detail layout nicely
      const itemsListString = Array.isArray(items) 
        ? items.map((it: any) => {
            const prodName = it.product?.name || 'Product Item';
            const qty = it.quantity || 1;
            const price = it.product?.price || 0;
            const size = it.selectedSize ? ` [Size: ${it.selectedSize}]` : '';
            const supplier = it.product?.supplierLink ? `\n   🔗 Sourcing Link: ${it.product.supplierLink}` : '';
            return `• ${prodName} × ${qty}${size} (₹${price * qty})${supplier}`;
          }).join('\n')
        : '• Details unavailable';

      // 1. Send admin message
      const waTextBody = `📦 *SUPABASE WATCHER: NEW ORDER RECEIVED!*
━━━━━━━━━━━━━━━━━━━━━
*Order ID:* \`${orderId}\`
*Order Date/Time:* ${dateString}
*Captured Source:* ${source}

👤 *CUSTOMER DETAIL*
• *Name:* ${customerName}
• *Phone:* ${customerPhone}
• *Address:* ${fullAddress || 'Not Provided'}

🛒 *ORDER ITEMS*
${itemsListString}

💰 *TOTAL PAYABLE*
• *Grand Total Payable (COD):* ₹${total}
━━━━━━━━━━━━━━━━━━━━━
⚙️ _Auto-synced & processed via Google AI Studio Background Worker_`;

      console.log(`✉️ Dispatching WhatsApp notification to target admin: ${targetNumber}...`);
      const successAdmin = await whatsappService.sendMessage(targetNumber, waTextBody);

      if (successAdmin) {
        console.log(`🎉 Successfully sent Admin notification for Order ID: ${orderId}`);
      } else {
        console.warn(`💔 WhatsApp bot is not authenticated active connected yet. Skipping admin message for: ${orderId}`);
      }

      // 2. Send customer message
      const customerNumber = customerPhone.replace(/\D/g, '');
      if (customerNumber && customerNumber.length >= 10) {
        let cleanCustomer = customerNumber;
        if (cleanCustomer.length === 10) {
          cleanCustomer = '91' + cleanCustomer;
        }

        const customerTextBody = `📦 *VELRIVA: ORDER CONFIRMED!*
━━━━━━━━━━━━━━━━━━━━━
Dear *${customerName}*, your order has been successfully placed with Velriva dropship network!

*Order ID:* \`${orderId}\`
*Order Date/Time:* ${dateString}

🛒 *ORDER ITEMS*
${itemsListString}

💰 *TOTAL PAYABLE (COD)*
• *Grand Total:* ₹${total}

📍 *DELIVERY ADDRESS*
• ${fullAddress || 'Not Provided'}
━━━━━━━━━━━━━━━━━━━━━
Thank you for partnering with Velriva! Tracking links will trigger as soon as processed.`;

        console.log(`✉️ Dispatching WhatsApp notification to customer: ${cleanCustomer}...`);
        const successCustomer = await whatsappService.sendMessage(cleanCustomer, customerTextBody);
        if (successCustomer) {
          console.log(`🎉 Successfully sent Customer notification for Order ID: ${orderId}`);
        }
      }

      // 3. Persistent File Cache marking
      try {
        const notifiedFilePath = path.join(process.cwd(), 'auth_session', 'notified_orders.json');
        let notifiedList: string[] = [];
        if (fs.existsSync(notifiedFilePath)) {
          const content = fs.readFileSync(notifiedFilePath, 'utf8');
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) notifiedList = parsed;
        }
        if (!notifiedList.includes(String(orderId))) {
          notifiedList.push(String(orderId));
          fs.writeFileSync(notifiedFilePath, JSON.stringify(notifiedList, null, 2), 'utf8');
        }
      } catch (cacheErr) {
        console.error('Error writing order ID cache file:', cacheErr);
      }

    } catch (err: any) {
      console.error(`❌ Failed to process and message order: ${orderId}:`, err.message || err);
    }
  }

  /**
   * Scan recent orders from Supabase and dispatch notifications
   * for any order that has not been flagged as notified.
   */
  public async syncAllUnnotifiedOrders() {
    console.log('🔄 [O-SYNC] Running WhatsApp connection scan for outstanding unnotified orders...');
    if (!this.supabaseClient) {
      console.warn('⚠️ Supabase client not initialized yet. Skipping sync.');
      return;
    }

    try {
      const notifiedFilePath = path.join(process.cwd(), 'auth_session', 'notified_orders.json');
      let notifiedSet = new Set<string>();

      if (fs.existsSync(notifiedFilePath)) {
        try {
          const content = fs.readFileSync(notifiedFilePath, 'utf8');
          const list = JSON.parse(content);
          if (Array.isArray(list)) {
            notifiedSet = new Set(list.map(String));
          }
        } catch (e) {
          console.error('Error reading notified_orders.json:', e);
        }
      }

      // Fetch last 20 orders
      const { data: recentOrders, error } = await this.supabaseClient
        .from('orders')
        .select('*')
        .order('date', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      if (!recentOrders || recentOrders.length === 0) {
        console.log('🔄 [O-SYNC] No recent orders found in Supabase database.');
        return;
      }

      console.log(`🔄 [O-SYNC] Auditing ${recentOrders.length} recent orders against notified cache...`);
      let dispatchedCount = 0;

      for (const order of recentOrders) {
        const oId = String(order.id);
        if (!notifiedSet.has(oId)) {
          console.log(`🚀 [O-SYNC] Order ID ${oId} is unnotified. Dispatching to customer & admin!`);
          
          // Send notification!
          await this.handleNewOrderRow(order, 'CONNECT-SYNC');
          
          // Add to notified set
          notifiedSet.add(oId);
          dispatchedCount++;

          // Cooldown between messages to prevent spam blocking
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Save updated list back to file
      fs.writeFileSync(notifiedFilePath, JSON.stringify(Array.from(notifiedSet), null, 2), 'utf8');
      console.log(`🎉 [O-SYNC] Audit complete. Dispatched ${dispatchedCount} outstanding orders to WhatsApp!`);
    } catch (e: any) {
      console.error('❌ [O-SYNC] Error during pending orders sync:', e.message || e);
    }
  }
}

export const supabaseWatcher = new SupabaseWatcher();
