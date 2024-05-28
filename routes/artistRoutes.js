import { Router } from 'express';
const router = Router();

import { multipleUpload } from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { getArtisan, registerAsArtisan } from '../controllers/artisanController.js';
import artisanAuth from '../middlewares/artisanAuth.js';


router.post('/register', auth,multipleUpload.array('files',3),registerAsArtisan);
router.get('/:id',getArtisan);
router.put('/me',auth,artisanAuth,getArtisan)

export default router;
