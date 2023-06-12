import multer from "multer"; 

// Configura el almacenamiento para los archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
// Establece la carpeta de destino para los archivos subidos
    cb(null, __dirname + "/public"); 
  },
  filename: (req, file, cb) => {
// nombre original
    cb(null, file.originalname); 
  },
});

export const uploader = multer({ storage }); 


import path from "path"; 
import { fileURLToPath } from "url"; 

export const __filename = fileURLToPath(import.meta.url); 
export const __dirname = path.dirname(__filename);