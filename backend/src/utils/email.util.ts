import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
  },
  from: process.env.EMAIL_FROM || 'Locket Clone <noreply@locketclone.com>'
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth
});

// Template directory
const templateDir = path.join(__dirname, '../../templates/emails');

/**
 * Load and compile an email template
 * @param templateName Template name
 * @returns Compiled template function
 */
const loadTemplate = (templateName: string): Handlebars.TemplateDelegate => {
  const templatePath = path.join(templateDir, `${templateName}.html`);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  return Handlebars.compile(templateSource);
};

/**
 * Send an email
 * @param to Recipient email address
 * @param subject Email subject
 * @param html Email HTML content
 * @param text Email text content
 * @returns Sent message info
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<SentMessageInfo> => {
  try {
    const mailOptions = {
      from: emailConfig.from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    };
    
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send a template email
 * @param to Recipient email address
 * @param subject Email subject
 * @param templateName Template name
 * @param context Template context
 * @returns Sent message info
 */
export const sendTemplateEmail = async (
  to: string,
  subject: string,
  templateName: string,
  context: any
): Promise<SentMessageInfo> => {
  try {
    // Load and compile the template
    const template = loadTemplate(templateName);
    
    // Render the template with the context
    const html = template(context);
    
    // Send the email
    return await sendEmail(to, subject, html);
  } catch (error) {
    console.error('Error sending template email:', error);
    throw new Error('Failed to send template email');
  }
};

/**
 * Send a verification email
 * @param to Recipient email address
 * @param username Username
 * @param verificationToken Verification token
 * @returns Sent message info
 */
export const sendVerificationEmail = async (
  to: string,
  username: string,
  verificationToken: string
): Promise<SentMessageInfo> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  return sendTemplateEmail(
    to,
    'Verify Your Email Address',
    'verification',
    {
      username,
      verificationUrl
    }
  );
};

/**
 * Send a password reset email
 * @param to Recipient email address
 * @param username Username
 * @param resetToken Reset token
 * @returns Sent message info
 */
export const sendPasswordResetEmail = async (
  to: string,
  username: string,
  resetToken: string
): Promise<SentMessageInfo> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  return sendTemplateEmail(
    to,
    'Reset Your Password',
    'password-reset',
    {
      username,
      resetUrl
    }
  );
};

/**
 * Send a welcome email
 * @param to Recipient email address
 * @param username Username
 * @returns Sent message info
 */
export const sendWelcomeEmail = async (
  to: string,
  username: string
): Promise<SentMessageInfo> => {
  return sendTemplateEmail(
    to,
    'Welcome to Locket Clone',
    'welcome',
    {
      username
    }
  );
};

/**
 * Send a friend request notification email
 * @param to Recipient email address
 * @param username Username
 * @param friendName Friend name
 * @returns Sent message info
 */
export const sendFriendRequestEmail = async (
  to: string,
  username: string,
  friendName: string
): Promise<SentMessageInfo> => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  return sendTemplateEmail(
    to,
    `${friendName} sent you a friend request`,
    'friend-request',
    {
      username,
      friendName,
      loginUrl
    }
  );
};
