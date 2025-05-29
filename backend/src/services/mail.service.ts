import transporter from '../config/mail.config';
import config from '../config/app.config';

export class MailService {
  /**
   * Send verification email
   */
  public async sendVerificationEmail(email: string, username: string, token: string): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
      
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Verify your Locket Clone account',
        html: `
          <h1>Hello ${username},</h1>
          <p>Thank you for registering with Locket Clone. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email</a></p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Regards,<br>The Locket Clone Team</p>
        `,
      };
      
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }
  
  /**
   * Send password reset email
   */
  public async sendPasswordResetEmail(email: string, username: string, token: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
      
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Reset your Locket Clone password',
        html: `
          <h1>Hello ${username},</h1>
          <p>You have requested to reset your password. Please click the link below to reset your password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Regards,<br>The Locket Clone Team</p>
        `,
      };
      
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }
  
  /**
   * Send notification email
   */
  public async sendNotificationEmail(email: string, username: string, subject: string, message: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject,
        html: `
          <h1>Hello ${username},</h1>
          <p>${message}</p>
          <p>Regards,<br>The Locket Clone Team</p>
        `,
      };
      
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending notification email:', error);
      return false;
    }
  }
  
  /**
   * Send welcome email
   */
  public async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Welcome to Locket Clone!',
        html: `
          <h1>Welcome to Locket Clone, ${username}!</h1>
          <p>Thank you for joining Locket Clone. We're excited to have you on board!</p>
          <p>With Locket Clone, you can share moments with your friends directly on their home screen.</p>
          <p>Get started by:</p>
          <ol>
            <li>Adding friends</li>
            <li>Taking a photo</li>
            <li>Setting up your widget</li>
          </ol>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Regards,<br>The Locket Clone Team</p>
        `,
      };
      
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
}
