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

  // API Route: Send order receipt format to custom recipient (both admin and customer)
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

    // Validate request fields
    if (!orderId || !customerName || !customerPhone || !address || !items || !total) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        received: { orderId, customerName, customerPhone, address, hasItems: !!items, total } 
      });
    }

    // Normalized phone numbers
    let targetAdminNumber = adminPhone || process.env.VITE_ADMIN_WHATSAPP || '919690986010';
    targetAdminNumber = targetAdminNumber.replace(/\D/g, '');

    let cleanCustomerPhone = customerPhone.replace(/\D/g, '');
    if (cleanCustomerPhone.length === 10) {
      cleanCustomerPhone = '91' + cleanCustomerPhone;
    }

    const deliveryTime = date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. ADMIN ITEMS LIST: Includes Meesho/Supplier sourcing links
    const adminItemsList = Array.isArray(items) 
      ? items.map((it: any) => {
          const prodName = it.product?.name || 'Product';
          const qty = it.quantity || 1;
          const price = it.product?.price || 0;
          const size = it.selectedSize ? ` [Size: ${it.selectedSize}]` : '';
          const color = it.selectedColor ? ` [Color: ${it.selectedColor}]` : '';
          
          let sourcingLine = '';
          if (it.product?.supplierLink) {
            sourcingLine = `\n   🔗 *Sourcing Link:* ${it.product.supplierLink}\n   _(💡 Note: Yeh order humne yahan se uthaya tha. Yeh hai uska link, ise open karke fulfill or duplicate models order kar sakte ho.)_`;
          } else {
            sourcingLine = `\n   🔗 *Sourcing Link:* No supplier/Meesho link attached.`;
          }
          
          return `• *${prodName}* × ${qty}${size}${color} (₹${price * qty})${sourcingLine}`;
        }).join('\n\n')
      : '• No order items attached.';

    // 2. CUSTOMER ITEMS LIST: Strictly EXCLUDES sourcing links!
    const customerItemsList = Array.isArray(items) 
      ? items.map((it: any) => {
          const prodName = it.product?.name || 'Product';
          const qty = it.quantity || 1;
          const price = it.product?.price || 0;
          const size = it.selectedSize ? ` [Size: ${it.selectedSize}]` : '';
          const color = it.selectedColor ? ` [Color: ${it.selectedColor}]` : '';
          return `• *${prodName}* × ${qty}${size}${color} (₹${price * qty})`;
        }).join('\n')
      : '• No items attached.';

    // 3. ADMIN TEXT BODY
    const adminMsgBody = `📦 *NEW ORDER PLACED ON VELRIVA!* ⚠️
━━━━━━━━━━━━━━━━━━━━━
*Order ID:* \`${orderId}\`
*Order Date/Time:* ${deliveryTime}

👤 *CUSTOMER / RESELLER DETAILS*
• *Name:* ${customerName}
• *Phone:* +${cleanCustomerPhone}
• *Address:* ${address}

🛒 *ORDER ITEMS & SOURCES:*
${adminItemsList}

💰 *BILLING DETAIL*
• *Grand Total Payable (COD):* ₹${total}
━━━━━━━━━━━━━━━━━━━━━
⚙️ _Auto-delivered in background via VELRIVA Auto-Bot_`;

    // 4. CUSTOMER TEXT BODY (Strictly confidential - zero sourcing links)
    const customerMsgBody = `📦 *VELRIVA: ORDER CONFIRMATION* 🎉
━━━━━━━━━━━━━━━━━━━━━
Dear *${customerName}*, your Cash on Delivery (COD) order has been successfully booked with us! 

Your order details are given below:

🆔 *Order ID:* \`${orderId}\`
📅 *Order Date:* ${deliveryTime}

🛒 *ITEMS PLACED:*
${customerItemsList}

💰 *TOTAL PAYABLE (COD):* ₹${total}
🚚 *Current Status:* Pending Dispatch Verification

📍 *SHIPPING TO:*
${address}

━━━━━━━━━━━━━━━━━━━━━
Thank you for shopping with Velriva B2B network! Let us handle the sourcing while you grow your brand! 💼✨`;

    let adminDispatched = false;
    let customerDispatched = false;

    // Send to Admin
    try {
      adminDispatched = await whatsappService.sendMessage(targetAdminNumber, adminMsgBody);
    } catch (err: any) {
      console.error('Failed to notify Admin of new order:', err.message || err);
    }

    // Send to Customer (Only if different from admin, or try sending anyway)
    try {
      customerDispatched = await whatsappService.sendMessage(cleanCustomerPhone, customerMsgBody);
    } catch (err: any) {
      console.error('Failed to notify Customer of new order:', err.message || err);
    }

    if (adminDispatched || customerDispatched) {
      res.json({ 
        success: true, 
        message: 'Order alert notifications dispatched successfully.',
        delivered: { admin: adminDispatched, customer: customerDispatched }
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'WhatsApp dispatch failed to both parties', 
        message: 'Ensure the WhatsApp Daemon session is authorized and paired!' 
      });
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

  // API Route: Send notification when a user logs in (to both customer and admin)
  app.post('/api/whatsapp/notify-login', async (req, res) => {
    let { name, phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const userName = name || 'Partner';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Customer notification
    const customerMsg = `🔐 *VELRIVA: ACCOUNT LOGIN ALERT*
━━━━━━━━━━━━━━━━━━━━━
Dear *${userName}*, your partner account was just accessed successfully.

*Time:* ${timestamp}
_If this login was not authorized by you, please reset your partner credentials immediately._
━━━━━━━━━━━━━━━━━━━━━
Have a prosperous business day!`;

    // Admin notification
    const adminMsg = `🔐 *ADMIN NOTICE: PARTNER LOGIN*
━━━━━━━━━━━━━━━━━━━━━
*Reseller Name:* ${userName}
*Phone:* +${cleanPhone}
*Time:* ${timestamp}
━━━━━━━━━━━━━━━━━━━━━`;

    const adminPhone = (process.env.VITE_ADMIN_WHATSAPP || '919690986010').replace(/\D/g, '');

    try {
      // Send to customer
      await whatsappService.sendMessage(cleanPhone, customerMsg);
      // Send to admin
      await whatsappService.sendMessage(adminPhone, adminMsg);
      res.json({ success: true, message: 'Login notifications sent in background' });
    } catch (err: any) {
      console.error('Failed to dispatch login notification:', err);
      res.status(500).json({ error: 'Failed to dispatch notification', message: err.message });
    }
  });

  // API Route: Send notification when a user registers (to both customer and admin)
  app.post('/api/whatsapp/notify-register', async (req, res) => {
    let { name, phone, supportInstagram, supportYoutube, supportEmail, supportPhone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const userName = name || 'New Partner';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const instaLink = supportInstagram || 'https://instagram.com/velriva';
    const ytLink = supportYoutube || 'https://youtube.com/@velriva';
    const emailContact = supportEmail || 'support@velriva.com';
    const helplinePhone = supportPhone || '919690986010';

    // Detailed Customer Welcome notification containing contacts & description of what this website/business is
    const customerMsg = `🎉 *WELCOME TO VELRIVA DROPSHIPPING!* 🚀
━━━━━━━━━━━━━━━━━━━━━
Dear *${userName}*, welcome to India's premium *VELRIVA Dropshipping & Wholesale B2B Reselling Network*! 🌟

We are excited to support and boost your home-based reselling venture! Here is a brief guide on how our platform empowers you to earn:

📈 *What is Velriva?*
Velriva is a high-tech reseller hub that provides booking access to extremely popular, premium-grade branded luxury watches, long-lasting premium fragrances, and elite lifestyle accessories at direct-from-factory wholesale rates. 

💼 *How Can You Benefit?*
1. *Zero Investment:* Market our catalog directly across your social platforms (WhatsApp Statuses, Instagram Reels, Facebook Marketplace).
2. *Freedom of Pricing:* Add your desired profit-margins over our wholesale catalog prices. Let us handle the packaging, and enjoy 100% of the profits!
3. *Easy Order Dispatch:* Enter your client's address and book Cash on Delivery (COD) orders directly. We dispatch under generic merchant name so your customers remain loyal to you!

📺 *Our Important Official Links & Support Desks:*
• 📺 *YouTube Channel:* ${ytLink} 
• 📸 *Instagram Page:* ${instaLink} 
• ✉️ *Support Email Desk:* ${emailContact}
• 📞 *WhatsApp Business Helpline:* +${helplinePhone}

🔐 *Your Secure Reseller Username:*
• *Username:* +${cleanPhone}
• *Registration Date:* ${timestamp}

Browse our live trending items list, list them to your circles, and let's make your dropshipping business highly profitable today!
━━━━━━━━━━━━━━━━━━━━━
_Elevate your dropshipping brand with Velriva Reseller Alliance_ 💼✨`;

    // Admin notification
    const adminMsg = `🔔 *ADMIN ALERTS: NEW RESELLER SIGNUP* 🔔
━━━━━━━━━━━━━━━━━━━━━
A fresh reseller has registered on your portal!

👤 *New Reseller Details:*
• *Name:* ${userName}
• *Mobile/WhatsApp:* +${cleanPhone}
• *Signup Time:* ${timestamp}

_Open your Admin Panel dashboard to manage users or check database listings._
━━━━━━━━━━━━━━━━━━━━━`;

    const adminPhone = (process.env.VITE_ADMIN_WHATSAPP || '919690986010').replace(/\D/g, '');

    // Attempt deliveries safely to both people
    let customerSent = false;
    let adminSent = false;

    try {
      // Send to customer
      customerSent = await whatsappService.sendMessage(cleanPhone, customerMsg);
    } catch (err) {
      console.error('Failed to dispatch registration welcome SMS/WhatsApp to customer:', err);
    }

    try {
      // Send to admin
      adminSent = await whatsappService.sendMessage(adminPhone, adminMsg);
    } catch (err) {
      console.error('Failed to dispatch registration notice to Admin:', err);
    }

    res.json({ 
      success: true, 
      message: 'Signup notifications completed', 
      delivered: { customer: customerSent, admin: adminSent } 
    });
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
