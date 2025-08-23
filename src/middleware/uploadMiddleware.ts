import { uploadSingleFile, uploadMultipleFiles } from './multerMiddleware';
import { uploadSingleToCloudinary, uploadMultipleToCloudinaryMiddleware } from './cloudinaryMiddleware';
import BadRequestError from '../errors/Bad-request';
import {Req,Res,Next} from '../types/aliases'
import {z} from 'zod'

export const uploadSingleFileToCloudinary = (fieldName: string) => {
  return [uploadSingleFile(fieldName), uploadSingleToCloudinary()];
};

export const uploadMultipleFilesToCloudinary = (
  fieldname: string,
  maxCount: number = 5
) => {
  return [
    uploadMultipleFiles(fieldname, maxCount),
    uploadMultipleToCloudinaryMiddleware(),
  ];
};
