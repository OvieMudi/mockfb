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

const welcomeMailContent = (name) => `
<div style="background-color:rgb(233,238,248);padding:10px;">
  <div style="max-width:590px;margin:auto;">
    <div padding:15px>
      <img
        width="590"
        alt="Logo"
        style="display:block;float:left;border-radius:0px"
        src="https://i.pinimg.com/originals/8d/2d/1c/8d2d1c5e0ee9e5141f1fc51567dba572.png"
        tabindex="0"
      />
    </div>
    <p
      style="font-size:36px;font-family:'Georgia',serif;color:#999;text-align:center;color:#999;padding:10"
    >
      Welcome to Mock FB!
    </p>
    <p
      style="font-size:21px;font-family:'Trebuchet MS',Helvetica,sans-serif,sans-serif;color:#555;text-align:center;text-transform:uppercase;"
    >
      Dear ${name},
    </p>
    <div style="line-height:200%;text-align:center">
      <span style="background-color:transparent;font-size:14px"
        >Thank you for joining Mock FB!</span
      >
    </div>

    <div style="line-height:200%;text-align:center">
      <span style="background-color:transparent;font-size:14px"
        >Create, style and publish posts based on your preferences. You will
        receive an update when your posts get engagements such as comments and
        likes! You can also engage posts from other users.</span
      >
    </div>

    <div style="line-height:200%;text-align:center">
      <span style="font-size:14px">&nbsp;</span>
    </div>

    <div style="line-height:200%;text-align:center">
      <span style="font-size:14px"
        >Feel free to reach out to us if you would like a personalized
        demo.</span
      >
    </div>

    <div style="line-height:200%;text-align:center">
      <strong><span style="font-size:14px">Welocme on board!!!</span></strong>
    </div>

    <div style="text-align:center;line-height:24px">&nbsp;</div>
    <p style="text-align:center">
      <a
        href="/#"
        style="font-size:15px;font-family:'Lucida Sans Unicode',Lucida Grande,sans-serif;color:#ffffff;font-weight:normal;padding:10px 20px;vertical-align:middle;background-color:#b9295f;border-radius:4px;border:none;text-decoration:none;"
        >Explore the API</a
      >
    </p>
  </div>
</div>
`;

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

const sendWelcomeEmail = (receiverEmail, firstName) =>
  errorHandler.handleAsyncError(async () => {
    const email = await transporter().sendMail({
      from: '"Mock FB" <ovie@mail.ee>',
      to: receiverEmail,
      subject: 'Welcome to Mock FB',
      text: 'Thank you for joining Mock FB!',
      html: welcomeMailContent(firstName),
    });
    log(email.response);
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
