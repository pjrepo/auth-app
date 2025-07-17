// Import nodemailer to send emails
import nodemailer from "nodemailer";

// Function to send an email using Gmail SMTP (Simple Mail Transfer Protocol) server
const sendEmail = async (to, subject, text) => {
  // Create a transporter object using Gmail SMTP service
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail service
    auth: {
      user: process.env.EMAIL_USER, // Gmail address from environment variables
      pass: process.env.EMAIL_PASS, // App-specific password from environment variables
    },
  });

  // Send the email with the provided parameters
  await transporter.sendMail({
    from: `"Auth App" <${process.env.EMAIL_USER}>`, // Sender name and email
    to, // Recipient email address
    subject, // Email subject
    text, // Type of message: Plain text body
  });
};

export default sendEmail;
