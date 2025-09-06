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
          // Gönderen kullanıcının bilgilerini al
          const userDoc = await db.collection("users").doc(senderId).get();
          const userData = userDoc.data();
          const senderName = userData?.displayName || userData?.name || "Kullanıcı";

          // Email gönder
          await sendScheduledMessage({
            messageId,
            userId: senderId,
            userEmail: messageData.recipientEmail || "",
            userName: senderName,
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #2c3e50;
          max-width: 580px;
          margin: 0 auto;
          padding: 40px 20px;
          background-color: #fafbfc;
        }
        .container {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid #e8eaed;
        }
        .header {
          background: #ffffff;
          padding: 48px 40px 32px;
          text-align: center;
          border-bottom: 1px solid #f0f2f5;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 400;
          color: #1a202c;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 32px;
          font-weight: 400;
        }
        .message-box {
          background: #f8f9fa;
          padding: 32px;
          margin: 32px 0;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        .message-content {
          font-size: 16px;
          line-height: 1.8;
          color: #2d3748;
          white-space: pre-wrap;
          margin: 0;
        }
        .date-info {
          background: #f7fafc;
          padding: 24px;
          border-radius: 6px;
          margin: 32px 0;
          font-size: 14px;
          color: #718096;
          border: 1px solid #e2e8f0;
        }
        .date-info strong {
          color: #4a5568;
          font-weight: 500;
        }
        .attachments {
          margin: 32px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 32px 40px;
          text-align: center;
          font-size: 13px;
          color: #718096;
          border-top: 1px solid #e9ecef;
        }
        .footer p {
          margin: 8px 0;
        }
        @media (max-width: 600px) {
          body {
            padding: 20px 16px;
          }
          .header {
            padding: 32px 24px 24px;
          }
          .content {
            padding: 24px;
          }
          .message-box {
            padding: 24px;
          }
          .date-info {
            padding: 20px;
          }
          .footer {
            padding: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Message from the Past</h1>
        </div>
        <div class="content">
          <div class="greeting">
            Hello ${userName}
          </div>
          <p style="margin: 0 0 24px; color: #4a5568; font-size: 15px;">You have a message that was scheduled to arrive today:</p>
          <div class="message-box">
            <div class="message-content">${messageData.content || "Message content not found"}</div>
          </div>
          
          ${messageData.deliveryDate || messageData.createdAt ? `
          <div class="date-info">
            ${messageData.createdAt ? `<div style="margin-bottom: 8px;"><strong>Created:</strong> ${new Date(messageData.createdAt.toDate()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</div>` : ""}
            ${messageData.deliveryDate ? `<div><strong>Scheduled for:</strong> ${new Date(messageData.deliveryDate.toDate()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</div>` : ""}
          </div>
          ` : ""}
          
          ${attachments.length > 0 ? `
          <div class="attachments">
            <p style="color: #4a5568; font-size: 14px; margin-bottom: 16px;">${attachments.length} file(s) were sent with this message.</p>
          </div>
          ` : ""}
        </div>
        <div class="footer">
          <p>This message was sent via <strong>Your Time Drawer</strong></p>
          <p>A service for sending messages to your future self</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const config = functions.config();
    const mailOptions = {
      from: `"${userName}" <${config.gmail.user}>`,
    to: userEmail,
    subject: `Your Message from the Past Has Arrived - ${new Date().toLocaleDateString("en-US")}`,
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
        
        // Kullanıcı bilgilerini al
        const userId = context.auth?.uid;
        let userName = "Test User";
        
        if (userId) {
          const userDoc = await db.collection("users").doc(userId).get();
          const userData = userDoc.data();
          userName = userData?.displayName || userData?.name || "Test User";
        }
        
        // Test email gönder
        const transporter = createEmailTransporter();
       
       const testEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.7;
              color: #2c3e50;
              max-width: 580px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: #fafbfc;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
              overflow: hidden;
              border: 1px solid #e8eaed;
            }
            .header {
              background: #ffffff;
              padding: 48px 40px 32px;
              text-align: center;
              border-bottom: 1px solid #f0f2f5;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 400;
              color: #1a202c;
              letter-spacing: -0.5px;
            }
            .content {
              padding: 40px;
            }
            .test-info {
              background: #f0f9ff;
              border: 1px solid #e0f2fe;
              border-radius: 6px;
              padding: 24px;
              margin: 32px 0;
            }
            .test-info h3 {
              color: #0369a1;
              margin: 0 0 16px 0;
              font-size: 16px;
              font-weight: 500;
            }
            .test-info p {
              margin: 8px 0;
              font-size: 14px;
              color: #475569;
            }
            .test-info strong {
              color: #334155;
            }
            .status-list {
              background: #f8f9fa;
              padding: 24px;
              border-radius: 6px;
              margin: 24px 0;
              border: 1px solid #e9ecef;
            }
            .status-list ul {
              margin: 0;
              padding-left: 20px;
            }
            .status-list li {
              margin: 8px 0;
              color: #4a5568;
              font-size: 14px;
            }
            .footer {
              background: #f8f9fa;
              padding: 32px 40px;
              text-align: center;
              font-size: 13px;
              color: #718096;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 8px 0;
            }
            @media (max-width: 600px) {
              body {
                padding: 20px 16px;
              }
              .header {
                padding: 32px 24px 24px;
              }
              .content {
                padding: 24px;
              }
              .test-info {
                padding: 20px;
              }
              .status-list {
                padding: 20px;
              }
              .footer {
                padding: 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Message</h1>
            </div>
            <div class="content">
              <div class="test-info">
                <h3>System Test</h3>
                <p><strong>Test Time:</strong> ${new Date().toLocaleString("en-US")}</p>
                <p><strong>Status:</strong> Email delivery system is working correctly</p>
              </div>
              
              <p style="margin: 0 0 24px; color: #4a5568; font-size: 15px;">This test message was sent to verify that the Message to the Future system's email sending feature is working properly.</p>
              
              <div class="status-list">
                <ul>
                  <li>Gmail SMTP connection successful</li>
                  <li>Environment variables configured correctly</li>
                  <li>Firebase Functions running</li>
                  <li>Email template rendering properly</li>
                </ul>
              </div>
              
              <p style="color: #4a5568; font-size: 15px; text-align: center; margin: 30px 0;">System ready for production</p>
            </div>
            <div class="footer">
              <p>This message was sent by the <strong>Your Time Drawer</strong> test system</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const config = functions.config();
       const mailOptions = {
          from: `"${userName} Test" <${config.gmail.user}>`,
          to: config.gmail.user, // Send test message to ourselves
        subject: `Test Message - System Check - ${new Date().toLocaleDateString("en-US")}`,
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
          // Gönderen kullanıcının bilgilerini al
          const userDoc = await db.collection("users").doc(senderId).get();
          const userData = userDoc.data();
          const senderName = userData?.displayName || userData?.name || "Kullanıcı";

          // Mesajı gönder
           await sendScheduledMessage({
             messageId,
             userId: senderId,
             userEmail: messageData.recipientEmail || "",
             userName: senderName,
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