// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import streamifier = require('streamifier');

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'foothub' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  destroyFile(publicId: string): Promise<{ result: string }> {
    return new Promise<{ result: string }>((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
