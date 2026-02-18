/**
 * Frontend API client for image upload to Cloudflare R2
 * Upload uses Cloudflare R2 via /api/upload-r2 endpoint
 */

export interface UploadResponse {
    url: string;
    fileId: string;
    name: string;
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
