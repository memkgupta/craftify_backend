import { Router } from 'express';
const router = Router();

import { multipleUpload } from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { addProduct, getArtisan, getOrders, getProductDetails, getProducts, registerAsArtisan, trashProduct, updateProduct } from '../controllers/artisanController.js';
import artisanAuth from '../middlewares/artisanAuth.js';


router.post('/register', auth,multipleUpload.array('files',3),registerAsArtisan);
router.get('/artisan/:id',getArtisan);
router.put('/me',auth,artisanAuth,getArtisan)
router.post('/product/add',auth,artisanAuth,multipleUpload.array('files'),addProduct);
router.route("/product/:pid").put(auth,artisanAuth,updateProduct)
router.get("/product/details/:id",auth,artisanAuth,getProductDetails)

router.delete('/product/trash/:id',auth,artisanAuth,trashProduct);
router.get('/orders',auth,artisanAuth,getOrders)
router.get('/products',auth,artisanAuth,getProducts);

export default router;
