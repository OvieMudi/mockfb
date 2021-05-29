import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { handlebars } from 'hbs';
import log from './log';
import errorHandler from './errorHandler';

dotenv.config();

const readFile = promisify(fs.readFile);

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PW } = process.env;

const createOptions = async (to, subject, text, template, templateOptions) => {
  const source = await readFile(
    path.join(__dirname, `../utils/templates/${template}.hbs`),
    'utf8'
  );
  const compiledTemplate = handlebars.compile(source);
  return {
    from: `"Mock FB" <${MAIL_USER}>`,
    to,
    subject,
    text,
    html: compiledTemplate(templateOptions),
  };
};

const transporter = () =>
  nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PW,
    },
    logger: true,
  });

/**
 *
 * @param {string} receiverEmail - email of receiver
 * @param {string} subject - email subject
 * @param {string} text - email text
 * @param {string} template - email template name
 * @param {object} templateOptions - email template parameters
 * @returns void
 */
const sendEmail = (receiverEmail, subject, text, template, templateOptions) =>
  errorHandler.handleAsyncError(async () => {
    const mailOptions = await createOptions(
      receiverEmail,
      subject,
      text,
      template,
      templateOptions
    );
    const email = await transporter().sendMail(mailOptions);
    log(email.response);
  });

const sendWelcomeEmail = (receiverEmail, name, link) =>
  errorHandler.handleAsyncError(async () => {
    sendEmail(
      receiverEmail,
      'Welcome to Mock FB',
      'Thank you for joining Mock FB!',
      'welcomeEmail',
      { name, link }
    );
  });

/**
 *
 * @param {string} receiverEmail - email of receiver
 * @param {string} receiverName - name of receiver
 * @param {string} resetLink - password reset link
 * @returns - void
 */
const sendPasswsordResetEmail = (receiverEmail, receiverName, resetLink) =>
  errorHandler.handleAsyncError(async () => {
    sendEmail(
      receiverEmail,
      'Password Reset',
      'You requested a password reset',
      'resetPasswordTemplate',
      { name: receiverName, resetlink: resetLink }
    );
  });

export default {
  transporter,
  sendEmail,
  sendWelcomeEmail,
  sendPasswsordResetEmail,
};
