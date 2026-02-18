/**
 * Vercel Serverless: Upload image to Cloudflare R2 (S3-compatible)
 *
 * POST /api/upload-r2
 * Body: multipart/form-data, field "file"
 *
 * Env: R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET, R2_PUBLIC_URL
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const formidable = require('formidable');
const fs = require('fs').promises;

const BUCKET = process.env.R2_BUCKET || 'blog-images';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getS3() {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKey = process.env.R2_ACCESS_KEY;
    const secretKey = process.env.R2_SECRET_KEY;
    if (!endpoint || !accessKey || !secretKey) {
        throw new Error('Missing R2 env: R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY');
    }
    return new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
    });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = new formidable.IncomingForm({
            keepExtensions: true,
            maxFileSize: MAX_FILE_SIZE,
            multiples: false,
        });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const fileArray = Array.isArray(files.file) ? files.file : (files.file ? [files.file] : []);
        if (fileArray.length === 0) {
            return res.status(400).json({ error: 'No file provided. Send file as "file" in form-data.' });
        }

        const file = fileArray[0];
        const buffer = await fs.readFile(file.filepath);
        const fileName = (file.originalFilename || `image-${Date.now()}.jpg`).replace(/[^a-zA-Z0-9._-]/g, '_');
        const mimeType = file.mimetype || 'image/jpeg';
        await fs.unlink(file.filepath).catch(() => {});

        const s3 = getS3();
        const key = `blog/${Date.now()}-${fileName}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                Body: buffer,
                ContentType: mimeType,
            })
        );

        // Public URL: set R2_PUBLIC_URL (e.g. https://pub-xxx.r2.dev or custom domain) in Vercel env
        const baseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
        const url = baseUrl ? `${baseUrl}/${key}` : null;
        if (!url) {
            console.warn('R2_PUBLIC_URL not set; image uploaded but URL will not be publicly reachable.');
        }

        return res.status(200).json({
            url: url || `https://${BUCKET}.r2.cloudflarestorage.com/${key}`,
            fileId: key,
            name: fileName,
        });
    } catch (error) {
        console.error('R2 upload error:', error);
        const message = error.message || 'Upload failed';
        return res.status(500).json({
            error: message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
}
