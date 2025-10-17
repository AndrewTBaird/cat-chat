import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Initialize R2 client
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // e.g., https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file to R2
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The name to save the file as
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<string>} The URL of the uploaded file
 */
export async function uploadToR2(fileBuffer, fileName, contentType) {
  const bucketName = process.env.R2_BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `avatars/${fileName}`,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return the public URL
  const publicUrl = `${process.env.R2_PUBLIC_URL}/avatars/${fileName}`;
  return publicUrl;
}
