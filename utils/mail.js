import nodemailer from 'nodemailer'
var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  export const sendPasswordRestMail = async(userEmail, accessToken)=>{
   
    try {
        // Construct the password reset URL
        const resetUrl = `http://localhost:5173/reset-password?token=${accessToken}`;
    
        // Define email options
        const mailOptions = {
          from:`"Craftify" <${process.env.MAIL}>`, // sender address
          to: userEmail, // list of receivers
          subject: 'Password Reset Request', // subject line
          text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`, // plain text body
          html: `<p>You requested a password reset. Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`, // HTML body
        };
    
        // Send email
        let info = await transport.sendMail(mailOptions);
        return {info:info,error:null};
        console.log('Message sent: %s', info.messageId);
      } catch (error) {
        console.error('Error sending email: ', error);
        return {info:null,error:error};
      }
  }