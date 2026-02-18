/**
 * Frontend API client for image upload to Cloudflare R2
 * Upload uses Cloudflare R2 via /api/upload-r2 endpoint
 */

export interface UploadResponse {
    url: string;
    fileId: string;
    name: string;
}

export interface R2Item {
    key: string;
    url: string | null;
    lastModified: string | null;
    size: number | null;
}

async function getAuthHeader(): Promise<Record<string, string>> {
    const { auth } = await import('@/lib/firebase');
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
}

/**
 * Upload an image file to Cloudflare R2 via backend API
 */
export async function uploadImageToR2(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-r2', {
        method: 'POST',
        body: formData,
        headers: await getAuthHeader(),
    });

    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch {
            errorData = { error: `Upload failed: ${res.status} ${res.statusText}` };
        }
        const errorMsg = errorData.error || `Upload failed: ${res.status}`;
        const details = errorData.details ? `\nDetails: ${errorData.details}` : '';
        throw new Error(`${errorMsg}${details}`);
    }

    return res.json();
}

export async function listR2Images(prefix = 'blog/'): Promise<R2Item[]> {
    const res = await fetch(`/api/r2-list?prefix=${encodeURIComponent(prefix)}`, {
        headers: await getAuthHeader(),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'List failed' }));
        throw new Error(error.error || `List failed: ${res.status}`);
    }
    const data = (await res.json()) as { items: R2Item[] };
    return data.items;
}

export async function deleteR2Image(key: string): Promise<void> {
    const res = await fetch('/api/r2-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await getAuthHeader()),
        },
        body: JSON.stringify({ key }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Delete failed' }));
        throw new Error(error.error || `Delete failed: ${res.status}`);
    }
}
