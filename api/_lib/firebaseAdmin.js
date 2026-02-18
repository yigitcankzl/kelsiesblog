import admin from 'firebase-admin';

function getServiceAccount() {
    const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
    if (!raw) {
        throw new Error('Missing env: FIREBASE_ADMIN_SERVICE_ACCOUNT');
    }
    try {
        return JSON.parse(raw);
    } catch {
        throw new Error('Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT JSON (must be minified one-line JSON).');
    }
}

export function getAdminApp() {
    if (admin.apps.length) return admin.app();
    const serviceAccount = getServiceAccount();
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export async function requireIdToken(req) {
    const header = req.headers?.authorization || req.headers?.Authorization || '';
    const match = String(header).match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];
    if (!token) {
        const err = new Error('Missing Authorization Bearer token');
        err.statusCode = 401;
        throw err;
    }

    const app = getAdminApp();
    try {
        return await app.auth().verifyIdToken(token);
    } catch {
        const err = new Error('Invalid or expired token');
        err.statusCode = 401;
        throw err;
    }
}

