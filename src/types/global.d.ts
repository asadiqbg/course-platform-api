// Extend global types for environment variables, Express, JWT, errors, and shared interfaces

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_LIFETIME: string;
      JWT_EXPIRES_IN?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;
      // Add other env vars as needed
    }
  }

  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        role?: string;
      };
      file?: MulterFile;
      files?: MulterFile[];
      // Add other custom properties as needed
    }
  }

  interface JwtPayload {
    userId: string;
    name: string;
    role?: string;
    // Add other JWT fields if needed
  }

  interface CustomError extends Error {
    statusCode?: number;
    errors?: any;
  }

  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination?: string;
    filename?: string;
    path?: string;
    buffer?: Buffer;
  }

  interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    // Add other pagination/query params as needed
  }
}

export {};
