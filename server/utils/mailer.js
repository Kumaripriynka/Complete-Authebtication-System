import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>We received a request to reset your password.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;