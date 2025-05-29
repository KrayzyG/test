import nodemailer from 'nodemailer';
import config from './app.config';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Verify connection configuration
if (config.email.host && config.email.user && config.email.password) {
  transporter.verify((error) => {
    if (error) {
      console.error('Email configuration error:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
} else {
  console.warn('Email credentials not provided. Email services will not be available.');
}

export default transporter;
