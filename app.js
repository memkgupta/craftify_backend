import express, { json } from 'express';
import errorMiddleware from './middlewares/error.js';
import userRoutes from './routes/userRoutes.js';
import { connect } from './utils/db.js';
import config from './config/config.js'
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
cloudinary.config({ 
    cloud_name:config.cloudinary.cloud_name , 
    api_key: config.cloudinary.api_key, 
    api_secret: config.cloudinary.api_secret 
  });
// Middleware
app.use(json());

// Routes
app.use('/users', userRoutes);

// Connect to database
connect();
app.use(errorMiddleware)
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
