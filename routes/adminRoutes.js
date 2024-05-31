import {Router} from "express"
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js"
import { addCategory, approveArtisan } from "../controllers/adminController.js";
const router = Router();
router.post('/category/add',auth,adminAuth,addCategory)
router.put('/artisan/approve',auth,adminAuth,approveArtisan)
export default router;