import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config/index.js';

export type MulterFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  fieldname?: string;
  encoding?: string;
  destination?: string;
  filename?: string;
  path?: string;
};

export interface UploadResult {
  url: string;
  storageKey: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface IStorageProvider {
  uploadFile(file: MulterFile): Promise<UploadResult>;
  deleteFile(storageKey: string): Promise<boolean>;
}

class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: MulterFile): Promise<UploadResult> {
    const ext = path.extname(file.originalname);
    const hashName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, hashName);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      url: `${config.storage.publicUrl}/${hashName}`,
      storageKey: hashName,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}

class S3CompatibleStorageProvider implements IStorageProvider {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: config.storage.endpoint || undefined,
      credentials: {
        accessKeyId: config.storage.accessKey,
        secretAccessKey: config.storage.secretKey,
      },
    });
  }

  async uploadFile(file: MulterFile): Promise<UploadResult> {
    const ext = path.extname(file.originalname);
    const storageKey = `tourlatam-2026/${crypto.randomUUID()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: config.storage.bucket,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const publicUrl = config.storage.publicUrl.endsWith('/')
      ? `${config.storage.publicUrl}${storageKey}`
      : `${config.storage.publicUrl}/${storageKey}`;

    return {
      url: publicUrl,
      storageKey,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.storage.bucket,
        Key: storageKey,
      });
      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }
}

export class StorageService {
  private provider: IStorageProvider;

  constructor() {
    if (
      (config.storage.provider === 's3' ||
        config.storage.provider === 'r2' ||
        config.storage.provider === 'supabase') &&
      config.storage.accessKey
    ) {
      this.provider = new S3CompatibleStorageProvider();
    } else {
      // Default to robust local filesystem storage provider for seamless dev experience
      this.provider = new LocalStorageProvider();
    }
  }

  async upload(file: MulterFile): Promise<UploadResult> {
    // Validate MIME types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'application/pdf',
      'video/mp4',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.mimetype}. Allowed: JPG, PNG, WebP, AVIF, SVG, PDF, MP4`);
    }

    // Limit size (20MB)
    const maxSizeBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error('File exceeds maximum allowed size of 20MB');
    }

    return this.provider.uploadFile(file);
  }

  async delete(storageKey: string): Promise<boolean> {
    return this.provider.deleteFile(storageKey);
  }
}

export const storageService = new StorageService();
