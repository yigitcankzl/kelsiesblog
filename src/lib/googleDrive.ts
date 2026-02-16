/**
 * Google Drive helpers.
 *
 * Requirements:
 *   1. The folder must be shared as "Anyone with the link can view".
 *   2. Google Drive API v3 must be enabled in your Google Cloud project
 *      (the same project that owns VITE_FIREBASE_API_KEY).
 */

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY as string;

/** Extract folder-ID from any common Google Drive folder URL. */
export function parseFolderId(url: string): string | null {
    // https://drive.google.com/drive/folders/FOLDER_ID
    // https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing
    // https://drive.google.com/drive/u/0/folders/FOLDER_ID
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Bare folder ID (no URL)
    if (/^[a-zA-Z0-9_-]{10,}$/.test(url.trim())) return url.trim();

    return null;
}

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
}

/** List image files inside a public Drive folder. */
export async function listDriveImages(folderId: string): Promise<DriveFile[]> {
    const q = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/'`);
    const fields = encodeURIComponent('files(id,name,mimeType)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=${fields}&pageSize=200&orderBy=name`;

    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `Drive API error ${res.status}`;
        throw new Error(msg);
    }

    const data = await res.json();
    return (data.files ?? []) as DriveFile[];
}

/** Convert a Drive file-ID to a high-res thumbnail URL. */
export function driveThumbUrl(fileId: string): string {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w4096`;
}
