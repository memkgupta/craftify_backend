import 'dotenv/config'
import express, { json } from 'express';
import errorMiddleware from './middlewares/error.js';
import userRoutes from './routes/userRoutes.js';
import connect from './utils/db.js';
import * as config from './config/config.js'
import artistRoutes from './routes/artistRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import cloudinary from 'cloudinary'
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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/artists',artistRoutes)
app.use('/api/v1/admin',adminRoutes)
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/cart',cartRoutes)
// Connect to database
connect();
app.use(errorMiddleware)
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
