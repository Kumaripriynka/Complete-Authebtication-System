import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // For production environments
  pool: true,
  maxConnections: 1,
  rateDelta: 20000, // 20 seconds between emails
  maxMessages: 3
});

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL || 'http://https://complete-authentication-system-frotend.onrender.com'}/reset-password/${resetToken}`;
    const supportEmail = process.env.SUPPORT_EMAIL || 'kartavyaplacement111@gmail.com';

    const mailOptions = {
      from: `"Authentication System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          
          <a href="${resetLink}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 15px 0;">
            Reset Password
          </a>
          
          <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
          
          <p>For security reasons, please don't share this link with anyone.</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          
          <p>Need help? Contact our support team at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
        </div>
      `,
      // Text version for email clients that don't support HTML
      text: `Password Reset Request\n\n` +
            `We received a request to reset your password. Visit this link to proceed:\n\n` +
            `${resetLink}\n\n` +
            `This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.\n\n` +
            `For security reasons, please don't share this link with anyone.\n\n` +
            `Need help? Contact our support team at ${supportEmail}`
    };

    // Add DKIM signing if configured
    // if (process.env.DKIM_PRIVATE_KEY) {
    //   mailOptions.dkim = {
    //     domainName: process.env.DOMAIN_NAME,
    //     keySelector: process.env.DKIM_KEY_SELECTOR || 'default',
    //     privateKey: process.env.DKIM_PRIVATE_KEY
    //   };
    // }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send reset email');
  }
};

export default sendResetPasswordEmail;
