import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Test email gönderme fonksiyonu
export const sendTestEmail = functions.runWith({
  memory: "256MB",
  timeoutSeconds: 60
}).https.onCall(async (data, context) => {
  functions.logger.info("Test email function triggered");
  
  try {
    // Gmail transporter oluştur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    
    // Test email içeriği
    const mailOptions = {
      from: `"Test Email 🧪" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "🧪 Firebase Functions Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">✅ Test Email Başarılı!</h2>
          <p>Bu email Firebase Functions'dan gönderildi.</p>
          <p><strong>Gönderim Zamanı:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          <p>Gmail SMTP ayarları çalışıyor! 🎉</p>
        </div>
      `,
    };
    
    // Email gönder
    await transporter.sendMail(mailOptions);
    
    functions.logger.info("Test email sent successfully");
    return { success: true, message: "Test email sent successfully" };
    
  } catch (error) {
    functions.logger.error("Error sending test email:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : String(error) 
    };
  }
});