import {Router} from "express"
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js"
import { addCategory } from "../controllers/adminController.js";
const router = Router();
router.post('/category/add',auth,adminAuth,addCategory)
export default router;