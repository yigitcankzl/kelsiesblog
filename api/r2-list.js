import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const prefix = typeof req.query?.prefix === 'string' ? req.query.prefix : 'blog/';
        const maxKeysRaw = typeof req.query?.maxKeys === 'string' ? Number(req.query.maxKeys) : 200;
        const maxKeys = Number.isFinite(maxKeysRaw) ? Math.max(1, Math.min(1000, maxKeysRaw)) : 200;

        const s3 = getS3();
        const out = await s3.send(
            new ListObjectsV2Command({
                Bucket: BUCKET,
                Prefix: prefix,
                MaxKeys: maxKeys,
            })
        );

        const baseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
        const items = (out.Contents || [])
            .filter(o => !!o.Key)
            .map(o => ({
                key: o.Key,
                url: baseUrl ? `${baseUrl}/${o.Key}` : null,
                lastModified: o.LastModified ? new Date(o.LastModified).toISOString() : null,
                size: typeof o.Size === 'number' ? o.Size : null,
            }))
            .sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''));

        return res.status(200).json({ items, prefix, bucket: BUCKET });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            error: error.message || 'Failed to list R2 objects',
        });
    }
}

