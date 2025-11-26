import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
    };

    await sgMail.send(msg);
    console.log(`Correo enviado a ${to}`);
    return true;
  } catch (error) {
    console.error('Error enviando correo:', error);
    
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};