import { useRef, useState } from 'react';
import { Save, X, UploadCloud, Loader } from 'lucide-react';
import { uploadImageToR2 } from '@/lib/r2Api';
import { FONT } from '@/lib/constants';
import { inputStyle, labelStyle } from '@/lib/adminStyles';

export interface GalleryFormData {
    src: string;
    caption: string;
    city: string;
    country: string;
}

interface GalleryFormProps {
    form: GalleryFormData;
    onFormChange: (data: GalleryFormData) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
    uniqueCountries: string[];
    availableCities: string[];
}

export default function GalleryForm({
    form, onFormChange, onSave, onCancel, isEditing, uniqueCountries, availableCities,
}: GalleryFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setUploading(true);
        try {
            const result = await uploadImageToR2(file);
            onFormChange({ ...form, src: result.url });
            setPreviewError(false);
        } catch (err: unknown) {
            console.error('Gallery image upload failed:', err);
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div style={{ border: '1px solid #1a1a1a', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ ...FONT, fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '24px' }}>
                {isEditing ? '> EDIT IMAGE' : '> NEW IMAGE'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Image URL</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            value={form.src}
                            onChange={e => { onFormChange({ ...form, src: e.target.value }); setPreviewError(false); }}
                            placeholder="https://... veya bilgisayardan yükle"
                            style={{ ...inputStyle, flex: '1 1 200px' }}
                        />
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="cursor-pointer"
                            style={{
                                ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 14px', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)',
                                background: 'none', letterSpacing: '0.1em', transition: 'all 0.3s', flexShrink: 0,
                            }}
                        >
                            {uploading ? <Loader className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                            {uploading ? 'YÜKLENİYOR...' : 'BILGISAYARDAN YÜKLE'}
                        </button>
                    </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Caption</label>
                    <input
                        type="text"
                        value={form.caption}
                        onChange={e => onFormChange({ ...form, caption: e.target.value })}
                        placeholder="Photo description..."
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Country</label>
                    <input
                        type="text"
                        list="country-list"
                        value={form.country}
                        onChange={e => onFormChange({ ...form, country: e.target.value })}
                        placeholder="e.g. Japan"
                        style={inputStyle}
                    />
                    <datalist id="country-list">
                        {uniqueCountries.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
                <div>
                    <label style={labelStyle}>City</label>
                    <input
                        type="text"
                        list="city-list"
                        value={form.city}
                        onChange={e => onFormChange({ ...form, city: e.target.value })}
                        placeholder="e.g. Tokyo"
                        style={inputStyle}
                        disabled={!form.country}
                    />
                    <datalist id="city-list">
                        {availableCities.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
            </div>

            {/* Preview */}
            {form.src && !previewError && (
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Preview</label>
                    <div style={{ width: '200px', height: '140px', overflow: 'hidden', border: '1px solid #222' }}>
                        <img src={form.src} alt="preview" referrerPolicy="no-referrer"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={() => setPreviewError(true)} />
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={onSave} className="cursor-pointer"
                    style={{
                        ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: 'var(--brand)', color: '#000', border: 'none',
                        padding: '10px 16px', letterSpacing: '0.1em', boxShadow: '0 0 12px rgba(0, 255, 65, 0.3)',
                    }}>
                    <Save className="w-3 h-3" />
                    {isEditing ? 'UPDATE' : 'ADD'}
                </button>
                <button onClick={onCancel} className="cursor-pointer"
                    style={{
                        ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'none', border: '1px solid #333', color: '#555', padding: '10px 16px',
                    }}>
                    <X className="w-3 h-3" />
                    CANCEL
                </button>
            </div>
        </div>
    );
}
