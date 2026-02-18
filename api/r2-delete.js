import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { requireIdToken } from './_lib/firebaseAdmin.js';

const BUCKET = process.env.R2_BUCKET || 'blog-images';

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
        credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        await requireIdToken(req);

        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const key = body?.key;
        if (typeof key !== 'string' || !key.trim()) {
            return res.status(400).json({ error: 'Missing key' });
        }
        if (!key.startsWith('blog/')) {
            return res.status(400).json({ error: 'Refusing to delete outside blog/ prefix' });
        }

        const s3 = getS3();
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

        return res.status(200).json({ success: true, key });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            error: error.message || 'Failed to delete R2 object',
        });
    }
}

