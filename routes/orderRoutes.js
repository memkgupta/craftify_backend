import { Router } from "express";
import { createOrder, getOrderDetails } from "../controllers/orderController.js";
import auth from "../middlewares/auth.js";
const router = Router();
router.post("/create",auth,createOrder)
router.get("/details",auth,getOrderDetails)
export default router