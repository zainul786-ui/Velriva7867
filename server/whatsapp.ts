import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState 
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import fs from 'fs';
import path from 'path';

// Custom level silent pino logger so we don't clutter terminal logs
const logger = pino({ level: 'silent' });

export interface WhatsAppStatus {
  status: 'connecting' | 'qrcode' | 'connected' | 'disconnected';
  qr: string | null;
  phoneNumber: string | null;
}

class WhatsAppService {
  private sock: any = null;
  private qr: string | null = null;
  private status: WhatsAppStatus['status'] = 'disconnected';
  private phoneNumber: string | null = null;
  private authState: any = null;
  private saveCreds: () => Promise<void> = async () => {};

  public async init() {
    this.status = 'connecting';
    const sessionDir = path.join(process.cwd(), 'auth_session');

    // Create session directory if it doesn't exist
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    try {
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
      this.authState = state;
      this.saveCreds = saveCreds;

      this.startSocket();
    } catch (err) {
      console.error('Failed to initialize Baileys Auth State:', err);
      this.status = 'disconnected';
    }
  }

  private async startSocket() {
    try {
      this.sock = makeWASocket({
        auth: this.authState,
        logger,
        printQRInTerminal: false, // Don't print in terminal, we show in browser!
        defaultQueryTimeoutMs: 60000,
      });

      this.sock.ev.on('creds.update', async () => {
        await this.saveCreds();
      });

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.status = 'qrcode';
          try {
            // Convert WhatsApp pairing code to a Base64 data URL
            this.qr = await QRCode.toDataURL(qr);
          } catch (err) {
            console.error('QR Code Generation Error:', err);
          }
        }

        if (connection === 'close') {
          const errorCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = errorCode !== DisconnectReason.loggedOut;
          
          this.phoneNumber = null;
          this.qr = null;

          if (shouldReconnect) {
            this.status = 'connecting';
            console.log('🔄 WhatsApp closed. Reconnecting...');
            setTimeout(() => this.startSocket(), 3000);
          } else {
            this.status = 'disconnected';
            console.log('❌ WhatsApp Logged Out. Clearing Session...');
            this.clearSession();
          }
        } else if (connection === 'open') {
          this.status = 'connected';
          this.qr = null;
          
          // Capture connected phone number detail from the state credentials
          const rawId = this.sock.user?.id;
          if (rawId) {
            this.phoneNumber = rawId.split(':')[0];
          }
          console.log(`✅ WhatsApp successfully connected! Username/Number: ${this.phoneNumber}`);
        }
      });
    } catch (err) {
      console.error('Error starting WA Socket Connection:', err);
      this.status = 'disconnected';
    }
  }

  public getStatus(): WhatsAppStatus {
    return {
      status: this.status,
      qr: this.qr,
      phoneNumber: this.phoneNumber,
    };
  }

  public async logout(): Promise<void> {
    try {
      if (this.sock) {
        await this.sock.logout();
      }
    } catch (e) {
      console.warn('Socket logout error:', e);
    }
    this.clearSession();
    this.status = 'disconnected';
    this.qr = null;
    this.phoneNumber = null;
    
    // Restart socket to allow scanned fresh setup session
    setTimeout(() => this.init(), 1000);
  }

  private clearSession() {
    const sessionDir = path.join(process.cwd(), 'auth_session');
    if (fs.existsSync(sessionDir)) {
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('🧹 Purged Baileys authorization folder safely.');
      } catch (err) {
        console.warn('Failed to delete auth session dictionary:', err);
      }
    }
  }

  public async sendMessage(to: string, text: string): Promise<boolean> {
    if (this.status !== 'connected' || !this.sock) {
      console.warn('⚠️ Cannot send message! WhatsApp Bot is not connected.');
      return false;
    }

    try {
      // Structure target string to standard WhatsApp remote JID: "91XXXXXXXXXX@s.whatsapp.net"
      let formattedNum = to.replace(/\D/g, '');
      if (!formattedNum.endsWith('@s.whatsapp.net')) {
        formattedNum = `${formattedNum}@s.whatsapp.net`;
      }

      await this.sock.sendMessage(formattedNum, { text });
      console.log(`📤 WhatsApp background message successfully dispatched to: ${formattedNum}`);
      return true;
    } catch (err) {
      console.error('WhatsApp sendMessage action threw error:', err);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
