export const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/mydatabase';
export const cloudinary = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};
export const twilio = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    serviceSid: process.env.TWILIO_SERVICE_SID
};
export const default_profile_pic_url = "https://res.cloudinary.com/de4ix6d6g/image/upload/v1716056171/uvdcer6yk88us5emowbi.png"
  