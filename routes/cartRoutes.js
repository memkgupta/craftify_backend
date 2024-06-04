import { clearCart, getUserCart } from "../controllers/cartController.js";
import auth from "../middlewares/auth.js"
import { Router } from "express";
const router =  Router();
router.use(auth);
router.route("/").get(getUserCart);
router.route("/clear").delete(clearCart);
router
  .route("/item/:productId")
  .post(
    
    addItemOrUpdateItemQuantity
  )
  .delete( removeItemFromCart);
export default router;