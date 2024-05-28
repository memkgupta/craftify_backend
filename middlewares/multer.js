import multer from "multer";
import { v4 as uuidv4} from 'uuid';
import path from 'path'
 const storage = multer.memoryStorage();
//  const diskStorage =multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/'); // Specify the directory where uploaded files will be stored
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname+"-"+uuidv4()+path.extname(file.originalname))
//     }
//   });
 export const uploadSingleFile = multer({storage:storage});
 export const multipleUpload = multer({storage:storage,limits:{fileSize: 10 * 1024 * 1024}});