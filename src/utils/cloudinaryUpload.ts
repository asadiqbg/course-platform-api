import cloudinary from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
}

export const uploadToCloudinary = async (
   filePath: string,
  folder: string = 'uploads',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<CloudinaryUploadResult> => {
  try {
     const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    // Delete the temporary file after successful upload
    fs.unlinkSync(filePath);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes
    };
  } catch (error) {
    // Delete the temporary file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export const uploadMultipleToCloudinary = async(
  filePaths:string[],
  folder:string = 'uploads',
  resourceType : 'image'|'video'|'raw'|'auto' = 'auto'
): Promise<CloudinaryUploadResult[]> =>{
  const uploadPromises = filePaths.map(path=>
    uploadToCloudinary(path,folder,resourceType)
  )
  try{
    //Promise.all resolves all promises concurrently
   return await Promise.all(uploadPromises)
  }catch(err){
    filePaths.forEach((path)=>{
      if(fs.existsSync(path)){
        fs.unlinkSync(path)
      }
    })
    throw err;
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};
