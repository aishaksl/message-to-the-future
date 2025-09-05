import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Firebase Admin'i başlat
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();

// Email transporter (Gmail SMTP)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Gmail adresin
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
    },
  });
};

// Scheduled message'ları kontrol et ve gönder
export const checkScheduledMessages = onSchedule(
  {
    schedule: "every 1 hours", // Her saat kontrol et
    timeZone: "Europe/Istanbul",
    memory: "256MiB",
    maxInstances: 5,
  },
  async (event) => {
    logger.info("Scheduled message checker started", {timestamp: event.scheduleTime});

    try {
      const now = new Date();
      
      // Gönderilmesi gereken mesajları bul
      const messagesQuery = await db
        .collectionGroup("messages")
        .where("status", "==", "scheduled")
        .where("scheduledDate", "<=", now)
        .get();

      logger.info(`Found ${messagesQuery.size} messages to send`);

      const promises = messagesQuery.docs.map(async (doc) => {
        const messageData = doc.data();
        const messageId = doc.id;
        const userId = doc.ref.parent.parent?.id;

        if (!userId) {
          logger.error("User ID not found for message", {messageId});
          return;
        }

        try {
          // Kullanıcı bilgilerini al
          const userDoc = await db.collection("users").doc(userId).get();
          const userData = userDoc.data();

          if (!userData?.email) {
            logger.error("User email not found", {userId, messageId});
            return;
          }

          // Email gönder
          await sendScheduledMessage({
            messageId,
            userId,
            userEmail: userData.email,
            userName: userData.displayName || "Kullanıcı",
            messageData: {
              content: messageData.content,
              scheduledDate: messageData.scheduledDate,
              createdAt: messageData.createdAt,
              mediaFiles: messageData.mediaFiles,
              status: messageData.status,
            },
          });

          // Mesaj durumunu güncelle
          await doc.ref.update({
            status: "sent",
            sentAt: new Date(),
            updatedAt: new Date(),
          });

          logger.info("Message sent successfully", {messageId, userId});
        } catch (error) {
          logger.error("Error sending message", {
            messageId,
            userId,
            error: error instanceof Error ? error.message : String(error),
          });

          // Hata durumunda mesajı failed olarak işaretle
          await doc.ref.update({
            status: "failed",
            error: error instanceof Error ? error.message : String(error),
            updatedAt: new Date(),
          });
        }
      });

      await Promise.all(promises);
      logger.info("Scheduled message check completed");
    } catch (error) {
      logger.error("Error in scheduled message checker", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

// Email gönderme fonksiyonu
async function sendScheduledMessage({
  messageId,
  userId,
  userEmail,
  userName,
  messageData,
}: {
  messageId: string;
  userId: string;
  userEmail: string;
  userName: string;
  messageData: {
    content?: string;
    scheduledDate?: Timestamp;
    createdAt?: Timestamp;
    mediaFiles?: Array<{
      name: string;
      path: string;
      type: string;
    }>;
    status: string;
  };
}) {
  const transporter = createEmailTransporter();

  // Dosya URL'lerini al
  const attachments = [];
  if (messageData.mediaFiles && messageData.mediaFiles.length > 0) {
    for (const file of messageData.mediaFiles) {
      try {
        const bucket = storage.bucket();
        const fileRef = bucket.file(file.path);
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 gün
        });
        
        attachments.push({
          filename: file.name,
          path: url,
        });
      } catch (error) {
        logger.warn("Could not get file URL", {filePath: file.path, error});
      }
    }
  }

  // Email içeriği
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕰️ Geleceğe Mesajın Geldi!</h1>
          <p>Merhaba ${userName}!</p>
        </div>
        <div class="content">
          <div class="message-box">
            <h3>📝 Mesajın:</h3>
            <p style="font-size: 16px; line-height: 1.8;">${messageData.content || "Mesaj içeriği bulunamadı"}</p>
            
            ${messageData.scheduledDate ? `
            <p><strong>📅 Planlandığı Tarih:</strong> ${new Date(messageData.scheduledDate.toDate()).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            ` : ""}
            
            ${messageData.createdAt ? `
            <p><strong>✍️ Yazıldığı Tarih:</strong> ${new Date(messageData.createdAt.toDate()).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            ` : ""}
          </div>
          
          ${attachments.length > 0 ? `
          <div class="message-box">
            <h3>📎 Ekli Dosyalar:</h3>
            <p>Bu mesajla birlikte ${attachments.length} dosya gönderildi. Dosyaları email eklerinde bulabilirsin.</p>
          </div>
          ` : ""}
          
          <div class="footer">
            <p>Bu mesaj <strong>Geleceğe Mesaj</strong> uygulaması tarafından otomatik olarak gönderilmiştir.</p>
            <p>Geçmişten geleceğe köprü kuran anıların... 💫</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Geleceğe Mesaj 🕰️" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: `🕰️ Geleceğe Mesajın Geldi! - ${new Date().toLocaleDateString("tr-TR")}`,
    html: emailHtml,
    attachments: attachments,
  };

  await transporter.sendMail(mailOptions);
  logger.info("Email sent successfully", {messageId, userEmail});
}

// Manuel mesaj gönderme fonksiyonu (test için)
export const sendMessageNow = onSchedule(
  {
    schedule: "0 0 1 1 *", // Yılda bir kez (kullanılmayacak, sadece manuel tetikleme için)
    timeZone: "Europe/Istanbul",
    memory: "256MiB",
    maxInstances: 1,
  },
  async (event) => {
    // Bu fonksiyon manuel olarak tetiklenecek
    logger.info("Manual message sender triggered");
  }
);