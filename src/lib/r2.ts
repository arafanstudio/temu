import { S3Client } from '@aws-sdk/client-s3'

export const r2Client = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_SECRET!,
  },
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
})

export const R2_BUCKET = process.env.AWS_S3_BUCKET!

