import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000/api',
  jwtSecret: process.env.JWT_SECRET || 'tourlatam_2026_super_secret_jwt_key_pmi_bolivia_chapter_prod_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'tourlatam_2026_cookie_secret_key',
  
  storage: {
    provider: (process.env.STORAGE_PROVIDER || 'local') as 'local' | 's3' | 'r2' | 'supabase',
    bucket: process.env.STORAGE_BUCKET || 'tourlatam-media',
    accessKey: process.env.STORAGE_ACCESS_KEY || '',
    secretKey: process.env.STORAGE_SECRET_KEY || '',
    endpoint: process.env.STORAGE_ENDPOINT || '',
    publicUrl: process.env.STORAGE_PUBLIC_URL || 'http://localhost:4000/uploads',
  },

  analytics: {
    gaTrackingId: process.env.GOOGLE_ANALYTICS_ID || 'G-TOURLATAM2026',
    gtmId: process.env.GOOGLE_TAG_MANAGER_ID || 'GTM-PMIBOLIVIA',
    metaPixelId: process.env.META_PIXEL_ID || '9876543210',
  }
};
