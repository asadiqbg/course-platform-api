import { Req, Res, Next } from '../types/aliases';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../utils/cloudinaryUpload';
import BadRequestError from '../errors/Bad-request';

export const uploadSingleToCloudinary = (folder: string = 'uploads') => {
  return async (req: Req, res: Res, next: Next) => {
    if (!req.file) {
      return next();
    }
    try {
      const cloudinaryResult = await uploadToCloudinary(req.file.path, folder);
      req.cloudinaryFile = cloudinaryResult;
      next();
    } catch (error) {
      next(new BadRequestError(`Cloudinary upload error ${error}`));
    }
  };
};

export const uploadMultipleToCloudinaryMiddleware = (folder: string = 'uploads') => {
  return async (req: Req, res: Res, next: Next) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return next();
    }
    try {
      const files = req.files as Express.Multer.File[];
      const filePaths = files.map((file) => file.path);

      const cloudinaryResults = await uploadMultipleToCloudinary(filePaths, folder);
      req.cloudinaryFiles = cloudinaryResults;
      next();
    } catch (error) {
      next(new BadRequestError(`Cloudinary upload error ${error}`));
    }
  };
};
