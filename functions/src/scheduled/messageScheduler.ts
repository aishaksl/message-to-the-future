import * as functions from "firebase-functions";
import {logger} from "firebase-functions";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

// Firebase Admin'i başlat
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

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

// Message checker function - HTTP trigger for testing
export const messageChecker = functions.https.onRequest(async (req, res) => {
    logger.info("Scheduled message checker started manually");

    try {
      const now = new Date();
      
      // Gönderilmesi gereken mesajları bul - doğru field'ları kullan
      const messagesQuery = await db
        .collection("messages")
        .where("status", "==", "scheduled")
        .where("deliveryDate", "<=", Timestamp.fromDate(now))
        .get();

      logger.info(`Found ${messagesQuery.size} messages to send`);

      const promises = messagesQuery.docs.map(async (doc) => {
        const messageData = doc.data();
        const messageId = doc.id;
        const senderId = messageData.senderId;

        if (!senderId) {
          logger.error("Sender ID not found for message", {messageId});
          return;
        }

        try {
          // Email gönder
          await sendScheduledMessage({
            messageId,
            userId: senderId,
            userEmail: messageData.recipientEmail || "",
            userName: messageData.recipientName || "Kullanıcı",
            messageData: {
              content: messageData.content,
              subject: messageData.subject,
              deliveryDate: messageData.deliveryDate,
              createdAt: messageData.createdAt,
              mediaUrls: messageData.mediaUrls,
              status: messageData.status,
            },
          });

          // Mesaj durumunu güncelle
          await doc.ref.update({
            status: "delivered",
            sentAt: new Date(),
            updatedAt: new Date(),
          });

          logger.info("Message sent successfully", {messageId, senderId});
        } catch (error) {
          logger.error("Error sending message", {
            messageId,
            senderId,
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
      res.status(200).send("Scheduled messages checked successfully");
    } catch (error) {
      logger.error("Error in scheduled message checker", {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).send("Error checking scheduled messages");
    }
  });

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
    subject?: string;
    deliveryDate?: Timestamp;
    createdAt?: Timestamp;
    mediaUrls?: string[];
    status: string;
  };
}) {
  const transporter = createEmailTransporter();

  // Dosya URL'lerini al
  const attachments: Array<{filename: string; path: string}> = [];
  if (messageData.mediaUrls && messageData.mediaUrls.length > 0) {
    // Media URL'leri zaten hazır, doğrudan kullanabiliriz
    logger.info("Media URLs found", {mediaUrls: messageData.mediaUrls});
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
          <h1>🕰️ Your Message from the Future Has Arrived!</h1>
          <p>Hello ${userName}!</p>
        </div>
        <div class="content">
          <div class="message-box">
            <h3>📝 Your Message:</h3>
            <p style="font-size: 16px; line-height: 1.8;">${messageData.content || "Message content not found"}</p>
            
            ${messageData.deliveryDate ? `
            <p><strong>📅 Scheduled Date:</strong> ${new Date(messageData.deliveryDate.toDate()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            ` : ""}
            
            ${messageData.createdAt ? `
            <p><strong>✍️ Written Date:</strong> ${new Date(messageData.createdAt.toDate()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            ` : ""}
          </div>
          
          ${attachments.length > 0 ? `
          <div class="message-box">
            <h3>📎 Attached Files:</h3>
            <p>${attachments.length} file(s) were sent with this message. You can find the files in the email attachments.</p>
          </div>
          ` : ""}
          
          <div class="footer">
            <p>This message was automatically sent by the <strong>Message to the Future</strong> application.</p>
            <p>Your memories bridging past to future... 💫</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const config = functions.config();
    const mailOptions = {
      from: `"Message to the Future 🕰️" <${config.gmail.user}>`,
    to: userEmail,
    subject: `🕰️ Your Message from the Future Has Arrived! - ${new Date().toLocaleDateString("en-US")}`,
    html: emailHtml,
    attachments: attachments,
  };

  await transporter.sendMail(mailOptions);
  logger.info("Email sent successfully", {messageId, userEmail});
}

// Test mesajı gönderme fonksiyonu (manuel tetikleme için)
export const testEmailSender = functions.https.onCall(async (data, context) => {
    logger.info("Manual test message sender triggered");
    
    try {
        logger.info("Test email sender triggered manually");
        
        // Test email gönder
        const transporter = createEmailTransporter();
       
       const testEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">🧪 Test Message</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">System Tested - ${new Date().toLocaleString("en-US")}</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">✅ Test Successful!</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              This test message was sent to verify that the Message to the Future system's email sending feature is working properly.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">📊 Test Details:</h3>
              <ul style="color: #6c757d; line-height: 1.8;">
                <li>✅ Gmail SMTP connection successful</li>
                <li>✅ Environment variables configured correctly</li>
                <li>✅ Firebase Functions running</li>
                <li>✅ Email template rendering properly</li>
              </ul>
            </div>
            
            <p style="color: #28a745; font-weight: bold; text-align: center; margin: 30px 0;">
              🎉 System ready for production!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This message was sent by the Message to the Future test system.</p>
          </div>
        </div>
      `;
      
      const config = functions.config();
       const mailOptions = {
          from: `"Message to the Future Test 🧪" <${config.gmail.user}>`,
          to: config.gmail.user, // Send test message to ourselves
        subject: `🧪 Test Message - System Check - ${new Date().toLocaleDateString("en-US")}`,
        html: testEmailHtml,
      };
      
      await transporter.sendMail(mailOptions);
        logger.info("Test email sent successfully to:", process.env.GMAIL_USER);
       
        logger.info("Test email sent successfully");
        return { success: true, message: "Test email sent successfully" };
     } catch (error) {
        logger.error("Error sending test email:", error);
        return { success: false, message: error instanceof Error ? error.message : String(error) };
     }
   }
 );

// Cron job - her dakika çalışır (Cloud Scheduler ile)
export const cronMessageChecker = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    logger.info("Scheduled message checker started");

    try {
      const now = new Date();
      
      // Gönderilmesi gereken mesajları bul
      const messagesQuery = await db
        .collection("messages")
        .where("status", "==", "scheduled")
        .where("deliveryDate", "<=", Timestamp.fromDate(now))
        .get();

      logger.info(`Found ${messagesQuery.size} messages to send`);

      const promises = messagesQuery.docs.map(async (doc) => {
        const messageData = doc.data();
        const messageId = doc.id;
        const senderId = messageData.senderId;

        if (!senderId) {
          logger.error("Sender ID not found for message", {messageId});
          return;
        }

        try {
          // Mesajı gönder
           await sendScheduledMessage({
             messageId,
             userId: senderId,
             userEmail: messageData.recipientEmail || "",
             userName: messageData.recipientName || "Kullanıcı",
             messageData: {
               content: messageData.content,
               subject: messageData.subject,
               deliveryDate: messageData.deliveryDate,
               createdAt: messageData.createdAt,
               mediaUrls: messageData.mediaUrls,
               status: messageData.status,
             },
           });

          // Mesaj durumunu güncelle
          await doc.ref.update({
            status: "delivered",
            sentAt: new Date(),
            updatedAt: new Date(),
          });

          logger.info("Message sent successfully", {messageId, senderId});
        } catch (error) {
          logger.error("Error processing message", {messageId, senderId, error});
          
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
        logger.error("Error in scheduled message checker:", error);
        throw error;
      }
    });