export interface R2Item {
    key: string;
    url: string;
    name: string;
    size?: number;
    time?: string;
}

export interface UploadResponse {
    url: string;
    fileId: string;
    name: string;
}

export async function uploadImageToR2(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-r2', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || `Upload failed: ${response.status}`);
    }

    return response.json();
}

export async function listR2Images(prefix = 'blog/'): Promise<R2Item[]> {
    const params = new URLSearchParams({ prefix });
    const response = await fetch(`/api/r2-list?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`List failed: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
}

export async function deleteR2Image(key: string): Promise<void> {
    const response = await fetch('/api/r2-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
}
