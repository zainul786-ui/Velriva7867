import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { whatsappService } from './server/whatsapp';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsers for Express API routing
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Initialize WhatsApp client in the background on boot
  console.log('🔌 Launching background WhatsApp service daemon...');
  await whatsappService.init();

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
          return `• ${prodName} × ${qty}${size} (₹${price * qty})`;
        }).join('\n')
      : '• No items attached.';

    const deliveryTime = date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format highly polished text message style for the WhatsApp dispatch
    const waTextBody = `📦 *NEW ORDER PLACED ON VELORA!*
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
⚙️ _Auto-delivered in background via VELORA Auto-Bot_`;

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
    console.log(`🚀 VELORA full-stack application running on port ${PORT}`);
  });
}

startServer();
