import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, ChevronUp, ChevronDown, ImagePlus, AlignLeft, UploadCloud, Loader } from 'lucide-react';
import type { Section } from '@/types';
import { parseFolderId, listDriveImages, driveThumbUrl } from '@/lib/googleDrive';
import { uploadImageToR2 } from '@/lib/r2Api';
import RichTextEditor from './RichTextEditor';
import R2MediaBrowser from './R2MediaBrowser';
import { FONT } from '@/lib/constants';
import { inputStyle, labelStyle, handleInputFocus, handleInputBlur } from '@/lib/adminStyles';

interface PostFormSectionEditorProps {
    section: Section;
    index: number;
    totalSections: number;
    onUpdateHeading: (heading: string) => void;
    onUpdateContent: (html: string) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onAddImage: () => void;
    onUpdateImage: (imgIndex: number, value: string) => void;
    onRemoveImage: (imgIndex: number) => void;
    onAddImages: (urls: string[]) => void;
}

export default function PostFormSectionEditor({
    section, index, totalSections,
    onUpdateHeading, onUpdateContent,
    onRemove, onMoveUp, onMoveDown,
    onAddImage, onUpdateImage, onRemoveImage, onAddImages,
}: PostFormSectionEditorProps) {
    // File upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // R2 media browser
    const [r2Open, setR2Open] = useState(false);

    // Drive import
    const [driveOpen, setDriveOpen] = useState(false);
    const [driveUrl, setDriveUrl] = useState('');
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveError, setDriveError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setUploading(true);
        try {
            const result = await uploadImageToR2(file);
            onAddImages([result.url]);
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDriveImport = async () => {
        const folderId = parseFolderId(driveUrl);
        if (!folderId) { setDriveError('INVALID DRIVE FOLDER LINK'); return; }
        setDriveLoading(true);
        setDriveError('');
        try {
            const files = await listDriveImages(folderId);
            if (!files.length) { setDriveError('NO IMAGES FOUND'); setDriveLoading(false); return; }
            onAddImages(files.map(f => driveThumbUrl(f.id)));
            setDriveOpen(false);
            setDriveUrl('');
        } catch (err: unknown) {
            setDriveError(err instanceof Error ? err.message : 'FAILED TO FETCH');
        } finally {
            setDriveLoading(false);
        }
    };

    const handleR2Select = (urls: string[]) => {
        onAddImages(urls);
        setR2Open(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-5 border border-[#1a1a1a] bg-[#080808] transition-[border-color] duration-300"
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
        >
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <span style={{ ...FONT, fontSize: '7px', color: 'var(--brand)' }}>
                    SEC_{String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={onMoveUp}
                        disabled={index === 0}
                        className="cursor-pointer w-6 h-6 flex items-center justify-center bg-transparent border border-[#333] text-[#555]"
                        style={{ opacity: index === 0 ? 0.3 : 1 }}
                    >
                        <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                        type="button"
                        onClick={onMoveDown}
                        disabled={index === totalSections - 1}
                        className="cursor-pointer w-6 h-6 flex items-center justify-center bg-transparent border border-[#333] text-[#555]"
                        style={{ opacity: index === totalSections - 1 ? 0.3 : 1 }}
                    >
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        disabled={totalSections <= 1}
                        className="cursor-pointer w-6 h-6 flex items-center justify-center bg-transparent border border-[#333] text-[#555] transition-all duration-300"
                        style={{ opacity: totalSections <= 1 ? 0.3 : 1 }}
                        onMouseEnter={e => { if (totalSections > 1) { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; } }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    value={section.heading}
                    onChange={e => onUpdateHeading(e.target.value)}
                    placeholder="SECTION HEADING"
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />

                <div className="flex flex-col gap-1.5">
                    <label style={{ ...labelStyle, marginBottom: '4px' }}>
                        <AlignLeft className="w-2.5 h-2.5" />
                        CONTENT
                    </label>
                    <RichTextEditor
                        content={section.content || ''}
                        onChange={onUpdateContent}
                    />
                </div>

                {/* Images Manager */}
                <div className="flex flex-col gap-1.5 mt-3">
                    <label style={{ ...labelStyle, marginBottom: '4px' }}>
                        <ImagePlus className="w-2.5 h-2.5" />
                        IMAGES
                        {(section.images?.length || 0) > 0 && (
                            <span style={{ color: 'var(--neon-cyan)' }}>[ {section.images!.length} ]</span>
                        )}
                    </label>

                    {(section.images || []).map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="flex gap-1.5 items-center">
                            <input
                                type="url"
                                value={imgUrl}
                                onChange={e => onUpdateImage(imgIdx, e.target.value)}
                                placeholder={`IMAGE URL ${imgIdx + 1}`}
                                style={{ ...inputStyle, flex: 1 }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveImage(imgIdx)}
                                className="cursor-pointer w-7 h-7 flex items-center justify-center bg-transparent border border-[#333] text-[#555] shrink-0 transition-all duration-300"
                                onMouseEnter={e => { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div className="flex gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={onAddImage}
                            className="cursor-pointer"
                            style={{
                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                color: '#555', background: 'none', border: '1px dashed #333',
                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }}
                        >
                            <Plus className="w-2.5 h-2.5" />
                            ADD IMAGE
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="cursor-pointer"
                            style={{
                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                color: 'var(--neon-cyan)', background: 'none', border: '1px solid #333',
                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; }}
                        >
                            {uploading ? <Loader className="w-2.5 h-2.5 animate-spin" /> : <UploadCloud className="w-2.5 h-2.5" />}
                            BILGISAYARDAN YÜKLE
                        </button>
                        <button
                            type="button"
                            onClick={() => setR2Open(true)}
                            className="cursor-pointer"
                            style={{
                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                color: '#aaa', background: 'none', border: '1px solid #333',
                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa'; }}
                        >
                            <ImagePlus className="w-2.5 h-2.5" />
                            STORAGE MEDIA
                        </button>
                        <button
                            type="button"
                            onClick={() => { setDriveOpen(!driveOpen); setDriveUrl(''); setDriveError(''); }}
                            className="cursor-pointer"
                            style={{
                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                color: driveOpen ? 'var(--brand)' : '#555',
                                background: 'none',
                                border: `1px dashed ${driveOpen ? 'var(--brand)' : '#333'}`,
                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                            onMouseLeave={e => { if (!driveOpen) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; } }}
                        >
                            <UploadCloud className="w-2.5 h-2.5" />
                            IMPORT DRIVE
                        </button>
                    </div>

                    {/* R2 media browser */}
                    {r2Open && (
                        <R2MediaBrowser
                            onClose={() => setR2Open(false)}
                            onSelect={handleR2Select}
                        />
                    )}

                    {/* Drive import inline */}
                    {driveOpen && (
                        <div className="border border-[var(--brand)] p-3 bg-[#050505] mt-1.5">
                            <div className="flex gap-1.5" style={{ marginBottom: driveError ? '8px' : '0' }}>
                                <input
                                    type="text"
                                    value={driveUrl}
                                    onChange={e => { setDriveUrl(e.target.value); setDriveError(''); }}
                                    placeholder="GOOGLE DRIVE FOLDER LINK..."
                                    style={{ ...inputStyle, flex: 1, fontSize: '8px' }}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
                                <button
                                    type="button"
                                    onClick={handleDriveImport}
                                    disabled={driveLoading || !driveUrl.trim()}
                                    className="cursor-pointer"
                                    style={{
                                        ...FONT, fontSize: '6px', padding: '8px 12px',
                                        backgroundColor: driveUrl.trim() ? 'var(--brand)' : '#1a1a1a',
                                        color: driveUrl.trim() ? '#000' : '#444',
                                        border: 'none', display: 'flex', alignItems: 'center', gap: '4px',
                                        cursor: driveUrl.trim() ? 'pointer' : 'not-allowed', flexShrink: 0,
                                    }}
                                >
                                    {driveLoading ? <Loader className="w-2.5 h-2.5 animate-spin" /> : <UploadCloud className="w-2.5 h-2.5" />}
                                    {driveLoading ? 'LOADING' : 'FETCH'}
                                </button>
                            </div>
                            {driveError && (
                                <p style={{ ...FONT, fontSize: '6px', color: 'var(--neon-magenta)' }}>{driveError}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
