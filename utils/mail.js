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
  export const profileVerificationSuccessMail = async(userEmail)=>{
    try {
      // Construct the password reset URL
      // const resetUrl = `http://localhost:5173/reset-password?token=${accessToken}`;
  
      // Define email options
      const mailOptions = {
        from:`"Craftify" <${process.env.MAIL}>`, // sender address
        to: userEmail, // list of receivers
        subject: 'Artisan account verified', // subject line
        text: `Your artisan account has been verified successfully , yay !`, // plain text body
        
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
  export const sendOrderPlacedEmail = async (userEmail, orderDetails) => {
    const mailOptions = {
      from:`"Craftify" <${process.env.MAIL}>`, // sender address
      to: userEmail,         // Receiver's email address
        subject: 'Your Order Has Been Placed!',
        text: `Hello,

Thank you for your order! Here are your order details:

Order ID: ${orderDetails._id}
Items: ${orderDetails.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')}
Total: $${orderDetails.total_amount}

We will notify you once your order is shipped.

Best regards,
Your Company Name`,
        html: `<p>Hello,</p>
               <p>Thank you for your order! Here are your order details:</p>
               <p><strong>Order ID:</strong> ${orderDetails.id}</p>
               <p><strong>Items:</strong></p>
               <ul>
                 ${orderDetails.items.map(item => `<li>${item.name} (Qty: ${item.quantity})</li>`).join('')}
               </ul>
               <p><strong>Total:</strong> $${orderDetails.total}</p>
               <p>We will notify you once your order is shipped.</p>
               <p>Best regards,</p>
               <p>Your Company Name</p>`
    };

    try {
        const info =  await transport.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return {info:info,error:null};
      } catch (error) {
        console.error('Error sending email:', error);
        return {info:null,error:error};
      }
};
