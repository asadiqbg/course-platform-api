import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import {Req,Res,Next} from '../types/aliases'

const uploadsDir:string = path.join(process.cwd(),'uploads')
if(!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir,{recursive:true})
}

const storage = multer.diskStorage({
  destination: (req: Req, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir);
  },
  filename: (req: Req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
})
//File Filter function
const fileFilter = (req: Req, file: Express.Multer.File, cb: FileFilterCallback) => {
  //Types of files allowed
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|avi|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and videos are allowed.'));
  }
}

// Create multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files
  },
  fileFilter
});

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount: number }[]) => upload.fields(fields);
