import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { whatsappService } from './server/whatsapp';
import { supabaseWatcher } from './server/supabaseWatcher';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // CORS Middleware to allow remote requests (e.g. from Netlify) to the AI Studio backend
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Instantly respond successfully to browser pre-flight OPTIONS check
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // JSON and URL-encoded body parsers for Express API routing
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Initialize WhatsApp client in the background on boot (do not block server listen)
  console.log('🔌 Launching background WhatsApp service daemon...');
  whatsappService.init().catch(err => {
    console.error('Failed to initialize WhatsApp service at boot:', err);
  });

  // Start background order watcher to scan Supabase orders dynamically
  supabaseWatcher.start().catch(err => {
    console.error('Failed to startup Supabase order watching daemon:', err);
  });

  // API Route: Get WhatsApp connection status and pairing QR code
  app.get('/api/whatsapp/status', (req, res) => {
    try {
      const statusData = whatsappService.getStatus();
      res.json(statusData);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve WA status', message: err.message });
    }
  });

  // API Route: Terminate WhatsApp session & restart connection (force logout)
  app.post('/api/whatsapp/logout', async (req, res) => {
    try {
      await whatsappService.logout();
      res.json({ success: true, message: 'WhatsApp session cleared. Restarted socket connection.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Logout failed', message: err.message });
    }
  });

  // API Route: Send order receipt format to custom recipient
  app.post('/api/whatsapp/send', async (req, res) => {
    const { 
      orderId, 
      customerName, 
      customerPhone, 
      address, 
      items, 
      total, 
      date,
      adminPhone 
    } = req.body;

    // Validate request pay fields
    if (!orderId || !customerName || !customerPhone || !address || !items || !total) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        received: { orderId, customerName, customerPhone, address, hasItems: !!items, total } 
      });
    }

    // Default target: Admin specified number or self-message fallback
    let targetNumber = adminPhone || process.env.VITE_ADMIN_WHATSAPP || '919690986010';
    targetNumber = targetNumber.replace(/\D/g, ''); // strip all non-digits

    // Build the list of ordered products
    const itemsListString = Array.isArray(items) 
      ? items.map((it: any) => {
          const prodName = it.product?.name || 'Product';
          const qty = it.quantity || 1;
          const price = it.product?.price || 0;
          const size = it.selectedSize ? ` [Size: ${it.selectedSize}]` : '';
          const supplier = it.product?.supplierLink ? `\n   🔗 Sourcing Link: ${it.product.supplierLink}` : '';
          return `• ${prodName} × ${qty}${size} (₹${price * qty})${supplier}`;
        }).join('\n')
      : '• No items attached.';

    const deliveryTime = date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format highly polished text message style for the WhatsApp dispatch
    const waTextBody = `📦 *NEW ORDER PLACED ON VELRIVA!*
━━━━━━━━━━━━━━━━━━━━━
*Order ID:* \`${orderId}\`
*Order Date/Time:* ${deliveryTime}

👤 *CUSTOMER DETAILS*
• *Name:* ${customerName}
• *Phone:* ${customerPhone}
• *Address:* ${address}

🛒 *ORDER ITEMS*
${itemsListString}

💰 *BILLING DETAIL*
• *Grand Total Payable (COD):* ₹${total}
━━━━━━━━━━━━━━━━━━━━━
⚙️ _Auto-delivered in background via VELRIVA Auto-Bot_`;

    try {
      const dispatched = await whatsappService.sendMessage(targetNumber, waTextBody);
      
      if (dispatched) {
        res.json({ success: true, message: 'WhatsApp notification dispatched in background!' });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'WhatsApp dispatch failed', 
          message: 'Is the admin WhatsApp session authenticated using QR?' 
        });
      }
    } catch (err: any) {
      console.error('WhatsApp message endpoint exception:', err);
      res.status(500).json({ success: false, error: 'Internal dispatch error', message: err.message });
    }
  });

  // Dynamic in-memory map to store verification OTP keys for active sessions
  const otpStore = new Map<string, { otp: string, expires: number }>();

  // API Route: Send OTP to a customer's WhatsApp number
  app.post('/api/auth/send-otp', async (req, res) => {
    let { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'WhatsApp / Phone number is required' });
    }

    // Clean and normalize phone number representation
    let cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Default to appending country code "91" for India if only 10 digits are specified
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    // Generate random secure 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiration standard

    // Store in-memory matched with phone
    otpStore.set(cleanPhone, { otp, expires });

    const messageText = `🔐 *VELRIVA Security Code:*
Your secure reseller login validation code is *${otp}*.

This code is valid for 5 minutes. Do not share this OTP with anyone for account security.

_Powered by VELRIVA Automated Verification Portal_`;

    try {
      const dispatched = await whatsappService.sendMessage(cleanPhone, messageText);
      if (dispatched) {
        console.log(`[OTP-GEN] Successfully dispatched OTP *${otp}* to ${cleanPhone}`);
        res.json({ success: true, message: 'OTP sent successfully!' });
      } else {
        // Fallback: If WhatsApp session is disconnected in development, return code or log clearly
        console.warn(`[OTP-FALLBACK] WhatsApp service not connected. Generated OTP: *${otp}* for user phone ${cleanPhone}`);
        res.status(200).json({ 
          success: true, 
          offlineFallback: true, 
          message: 'WhatsApp daemon is disconnected. QR Setup is required.',
          devOtp: otp 
        });
      }
    } catch (err: any) {
      console.error('Failed to send WhatsApp verification OTP:', err);
      res.status(500).json({ error: 'Failed to send OTP code to WhatsApp', message: err.message });
    }
  });

  // API Route: Verify OTP and proceed with access validation
  app.post('/api/auth/verify-otp', async (req, res) => {
    let { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and verification OTP are required' });
    }

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const record = otpStore.get(cleanPhone);
    if (!record) {
      return res.status(400).json({ error: 'No verification code requested for this phone number' });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({ error: 'The verification code has expired. Please try again.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect verification code. Please check and try again.' });
    }

    // Clean validated record
    otpStore.delete(cleanPhone);

    res.json({ success: true, message: 'OTP verified successfully' });
  });

  // Mount Vite developer middleware for rendering React SPA path in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Statics file serving for React production builds
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 VELRIVA full-stack application running on port ${PORT}`);
  });
}

startServer();
