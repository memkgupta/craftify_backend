import { Router } from 'express';
const router = Router();
import {createUser,updateUser,loginUser,resetPasswordRequest, verifyOtp } from '../controllers/userController.js';
import { uploadSingleFile } from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';


router.post('/register', uploadSingleFile.single('file'),createUser);

// Route to log in a user
// POST /api/users/login
router.post('/login', loginUser);

// Route to update user details (name, email, etc.)
// PUT /api/users/update
router.put('/update', auth, uploadSingleFile.single('file'),updateUser);

// Route to reset user password
// POST /api/users/reset-password
router.post('/reset-password', resetPasswordRequest);
router.route("/verify-otp").post(verifyOtp)

export default router;
