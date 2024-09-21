import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';

// Multer upload options
export const multerArchiveOptions: MulterOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 20, // 20mb
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = `./uploads/archives`;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `archived_${uuid()}${extname(file.originalname)}`);
    },
  }),
};

export const multerAvatarOptions: MulterOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 5, // 5mb
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    const extension = path.extname(file.originalname);
    if (['.jpg', '.png', '.jpeg'].includes(extension)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = `./uploads/avatars`;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `avatar_${uuid()}${extname(file.originalname)}`);
    },
  }),
};

export const multerExcelOptions: MulterOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 10, // 10mb
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    const extension = path.extname(file.originalname);
    if (['.csv', '.xlsx'].includes(extension)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = `./uploads/excel`;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `excel_${uuid()}${extname(file.originalname)}`);
    },
  }),
};
