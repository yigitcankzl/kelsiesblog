import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Image, UploadCloud, Loader } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { GalleryItem } from '@/types';
import { parseFolderId, listDriveImages, driveThumbUrl } from '@/lib/googleDrive';
import { uploadImageToR2 } from '@/lib/r2Api';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

const inputStyle: React.CSSProperties = {
    ...font,
    fontSize: '9px',
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #222',
    color: '#ccc',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
};

const labelStyle: React.CSSProperties = {
    ...font,
    fontSize: '7px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '8px',
    display: 'block',
};

interface GalleryFormData {
    src: string;
    caption: string;
    city: string;
    country: string;
}

const emptyForm: GalleryFormData = { src: '', caption: '', city: '', country: '' };

export default function GalleryManager() {
    const { posts, galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useBlogStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<GalleryFormData>(emptyForm);
    const [previewError, setPreviewError] = useState(false);

    // Drive import state
    const [showDriveImport, setShowDriveImport] = useState(false);
    const [driveUrl, setDriveUrl] = useState('');
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveError, setDriveError] = useState('');
    const [driveResults, setDriveResults] = useState<{ id: string; name: string; url: string }[]>([]);
    const [driveSelected, setDriveSelected] = useState<Set<string>>(new Set());

    const galleryFileInputRef = useRef<HTMLInputElement>(null);
    const [galleryUploading, setGalleryUploading] = useState(false);

    const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setGalleryUploading(true);
        try {
            const result = await uploadImageToR2(file);
            setForm(prev => ({ ...prev, src: result.url }));
            setPreviewError(false);
        } catch (err: unknown) {
            console.error('Gallery image upload failed:', err);
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setGalleryUploading(false);
            e.target.value = '';
        }
    };

    // Derive unique countries and cities for datalists
    const uniqueCountries = useMemo(() => {
        const countries = new Set(posts.map(p => p.country));
        galleryItems.forEach(item => countries.add(item.country));
        return Array.from(countries).sort();
    }, [posts, galleryItems]);

    const availableCities = useMemo(() => {
        if (!form.country) return [];
        const cities = new Set(posts.filter(p => p.country === form.country).map(p => p.city));
        galleryItems.filter(item => item.country === form.country).forEach(item => cities.add(item.city));
        return Array.from(cities).sort();
    }, [posts, galleryItems, form.country]);

    const startEdit = (item: GalleryItem) => {
        setEditingId(item.id);
        setForm({ src: item.src, caption: item.caption, city: item.city, country: item.country });
        setIsAdding(false);
        setPreviewError(false);
    };

    const startAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setForm(emptyForm);
        setPreviewError(false);
    };

    const cancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setForm(emptyForm);
    };

    const handleSave = () => {
        if (!form.src.trim()) return;

        if (editingId) {
            updateGalleryItem(editingId, form);
        } else {
            addGalleryItem({
                id: `gallery-${Date.now()}`,
                ...form,
            });
        }
        cancel();
    };

    // Drive import helpers
    const handleDriveFetch = async () => {
        const folderId = parseFolderId(driveUrl);
        if (!folderId) { setDriveError('INVALID DRIVE FOLDER LINK'); return; }

        setDriveLoading(true);
        setDriveError('');
        setDriveResults([]);
        setDriveSelected(new Set());

        try {
            const files = await listDriveImages(folderId);
            if (files.length === 0) { setDriveError('NO IMAGES FOUND IN FOLDER'); setDriveLoading(false); return; }
            const results = files.map(f => ({ id: f.id, name: f.name, url: driveThumbUrl(f.id) }));
            setDriveResults(results);
            setDriveSelected(new Set(results.map(r => r.id))); // select all by default
        } catch (err: any) {
            setDriveError(err.message || 'FAILED TO FETCH FROM DRIVE');
        } finally {
            setDriveLoading(false);
        }
    };

    const toggleDriveSelect = (id: string) => {
        setDriveSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleDriveImport = () => {
        const toImport = driveResults.filter(r => driveSelected.has(r.id));
        toImport.forEach(img => {
            if (!galleryItems.some(item => item.src === img.url)) {
                addGalleryItem({
                    id: `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    src: img.url,
                    caption: img.name.replace(/\.[^.]+$/, ''),
                    city: '',
                    country: '',
                });
            }
        });
        setShowDriveImport(false);
        setDriveUrl('');
        setDriveResults([]);
        setDriveSelected(new Set());
        setDriveError('');
    };

    const closeDriveImport = () => {
        setShowDriveImport(false);
        setDriveUrl('');
        setDriveResults([]);
        setDriveSelected(new Set());
        setDriveError('');
    };

    const showForm = isAdding || editingId !== null;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image className="w-4 h-4" style={{ color: 'var(--neon-cyan)' }} />
                    <div>
                        <h2 style={{ ...font, fontSize: '11px', color: '#fff' }}>GALLERY ITEMS</h2>
                        <p style={{ ...font, fontSize: '6px', color: '#555', marginTop: '4px', letterSpacing: '0.15em' }}>
                            {galleryItems.length} {galleryItems.length === 1 ? 'IMAGE' : 'IMAGES'} LOADED
                        </p>
                    </div>
                </div>
                {!showForm && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setShowDriveImport(true)}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'transparent',
                                color: 'var(--brand)',
                                border: '1px solid var(--brand)',
                                padding: '10px 16px',
                                letterSpacing: '0.1em',
                                transition: 'all 0.3s',
                            }}
                        >
                            <UploadCloud className="w-3 h-3" />
                            IMPORT DRIVE
                        </button>
                        <button
                            onClick={startAdd}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'var(--neon-cyan)',
                                color: '#000',
                                border: 'none',
                                padding: '10px 16px',
                                letterSpacing: '0.1em',
                                boxShadow: '0 0 12px rgba(0, 255, 255, 0.3)',
                                transition: 'all 0.3s',
                            }}
                        >
                            <Plus className="w-3 h-3" />
                            ADD IMAGE
                        </button>
                    </div>
                )}
            </div>

            {/* Drive Import Dialog */}
            {showDriveImport && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ border: '1px solid var(--brand)', padding: '24px', marginBottom: '24px', backgroundColor: '#050505' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ ...font, fontSize: '9px', color: 'var(--brand)' }}>{'>'} IMPORT FROM GOOGLE DRIVE</h3>
                        <button onClick={closeDriveImport} className="cursor-pointer" style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '6px' }}>
                            <X className="w-3 h-3" />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <input
                            type="text"
                            value={driveUrl}
                            onChange={e => { setDriveUrl(e.target.value); setDriveError(''); }}
                            placeholder="PASTE GOOGLE DRIVE FOLDER LINK..."
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                            onClick={handleDriveFetch}
                            disabled={driveLoading || !driveUrl.trim()}
                            className="cursor-pointer"
                            style={{
                                ...font, fontSize: '7px', padding: '10px 16px', letterSpacing: '0.1em',
                                backgroundColor: driveUrl.trim() ? 'var(--brand)' : '#1a1a1a',
                                color: driveUrl.trim() ? '#000' : '#444',
                                border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
                                cursor: driveUrl.trim() ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {driveLoading ? <Loader className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                            {driveLoading ? 'LOADING...' : 'FETCH'}
                        </button>
                    </div>

                    {driveError && (
                        <p style={{ ...font, fontSize: '7px', color: 'var(--neon-magenta)', marginBottom: '12px' }}>{driveError}</p>
                    )}

                    {driveResults.length > 0 && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ ...font, fontSize: '7px', color: 'var(--neon-cyan)' }}>
                                    {driveSelected.size} / {driveResults.length} SELECTED
                                </span>
                                <button
                                    onClick={() => {
                                        if (driveSelected.size === driveResults.length) setDriveSelected(new Set());
                                        else setDriveSelected(new Set(driveResults.map(r => r.id)));
                                    }}
                                    className="cursor-pointer"
                                    style={{ ...font, fontSize: '6px', background: 'none', border: '1px solid #333', color: '#888', padding: '4px 10px' }}
                                >
                                    {driveSelected.size === driveResults.length ? 'DESELECT ALL' : 'SELECT ALL'}
                                </button>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                                {driveResults.map(r => {
                                    const selected = driveSelected.has(r.id);
                                    return (
                                        <div
                                            key={r.id}
                                            onClick={() => toggleDriveSelect(r.id)}
                                            className="cursor-pointer"
                                            style={{
                                                border: `2px solid ${selected ? 'var(--brand)' : '#1a1a1a'}`,
                                                overflow: 'hidden', position: 'relative',
                                                opacity: selected ? 1 : 0.4,
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <img src={r.url} alt={r.name} referrerPolicy="no-referrer"
                                                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                                            {selected && (
                                                <div style={{
                                                    position: 'absolute', top: '4px', right: '4px',
                                                    width: '14px', height: '14px', backgroundColor: 'var(--brand)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '9px', color: '#000', fontWeight: 'bold',
                                                }}>✓</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleDriveImport}
                                disabled={driveSelected.size === 0}
                                className="cursor-pointer"
                                style={{
                                    ...font, fontSize: '8px', padding: '12px 24px', letterSpacing: '0.1em',
                                    backgroundColor: driveSelected.size > 0 ? 'var(--brand)' : '#1a1a1a',
                                    color: driveSelected.size > 0 ? '#000' : '#444',
                                    border: 'none',
                                    boxShadow: driveSelected.size > 0 ? '0 0 15px rgba(0, 255, 65, 0.3)' : 'none',
                                    cursor: driveSelected.size > 0 ? 'pointer' : 'not-allowed',
                                }}
                            >
                                IMPORT {driveSelected.size} IMAGE{driveSelected.size !== 1 ? 'S' : ''}
                            </button>
                        </>
                    )}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {showForm ? (
                    <motion.div
                        key="gallery-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div style={{ border: '1px solid #1a1a1a', padding: '24px', marginBottom: '24px' }}>
                            <h3 style={{ ...font, fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '24px' }}>
                                {editingId ? '> EDIT IMAGE' : '> NEW IMAGE'}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Image URL</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <input
                                            type="text"
                                            value={form.src}
                                            onChange={e => { setForm({ ...form, src: e.target.value }); setPreviewError(false); }}
                                            placeholder="https://... veya bilgisayardan yükle (R2)"
                                            style={{ ...inputStyle, flex: '1 1 200px' }}
                                        />
                                        <input
                                            ref={galleryFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleGalleryFileChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => galleryFileInputRef.current?.click()}
                                            disabled={galleryUploading}
                                            className="cursor-pointer"
                                            style={{
                                                ...font,
                                                fontSize: '7px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '10px 14px',
                                                border: '1px solid var(--neon-cyan)',
                                                color: 'var(--neon-cyan)',
                                                background: 'none',
                                                letterSpacing: '0.1em',
                                                transition: 'all 0.3s',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {galleryUploading ? <Loader className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                                            {galleryUploading ? 'YÜKLENİYOR...' : 'BILGISAYARDAN YÜKLE (R2)'}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Caption</label>
                                    <input
                                        type="text"
                                        value={form.caption}
                                        onChange={e => setForm({ ...form, caption: e.target.value })}
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
                                        onChange={e => setForm({ ...form, country: e.target.value })}
                                        placeholder="e.g. Japan"
                                        style={inputStyle}
                                    />
                                    <datalist id="country-list">
                                        {uniqueCountries.map(country => (
                                            <option key={country} value={country} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label style={labelStyle}>City</label>
                                    <input
                                        type="text"
                                        list="city-list"
                                        value={form.city}
                                        onChange={e => setForm({ ...form, city: e.target.value })}
                                        placeholder="e.g. Tokyo"
                                        style={inputStyle}
                                        disabled={!form.country}
                                    />
                                    <datalist id="city-list">
                                        {availableCities.map(city => (
                                            <option key={city} value={city} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            {/* Preview */}
                            {form.src && !previewError && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={labelStyle}>Preview</label>
                                    <div style={{
                                        width: '200px',
                                        height: '140px',
                                        overflow: 'hidden',
                                        border: '1px solid #222',
                                    }}>
                                        <img
                                            src={form.src}
                                            alt="preview"
                                            referrerPolicy="no-referrer"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={() => setPreviewError(true)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button
                                    onClick={handleSave}
                                    className="cursor-pointer"
                                    style={{
                                        ...font,
                                        fontSize: '7px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: 'var(--brand)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '10px 16px',
                                        letterSpacing: '0.1em',
                                        boxShadow: '0 0 12px rgba(0, 255, 65, 0.3)',
                                    }}
                                >
                                    <Save className="w-3 h-3" />
                                    {editingId ? 'UPDATE' : 'ADD'}
                                </button>
                                <button
                                    onClick={cancel}
                                    className="cursor-pointer"
                                    style={{
                                        ...font,
                                        fontSize: '7px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'none',
                                        border: '1px solid #333',
                                        color: '#555',
                                        padding: '10px 16px',
                                    }}
                                >
                                    <X className="w-3 h-3" />
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="gallery-list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {galleryItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Image className="w-8 h-8 mx-auto" style={{ color: '#333', marginBottom: '16px' }} />
                                <p style={{ ...font, fontSize: '9px', color: '#444', lineHeight: '2' }}>
                                    NO GALLERY IMAGES YET
                                </p>
                                <p style={{ ...font, fontSize: '7px', color: '#333', marginTop: '8px' }}>
                                    {'>'} ADD YOUR FIRST IMAGE_
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {galleryItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.04, duration: 0.3 }}
                                        style={{
                                            border: '1px solid #1a1a1a',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                                            <img
                                                src={item.src}
                                                alt={item.caption}
                                                referrerPolicy="no-referrer"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    filter: 'brightness(0.8)',
                                                }}
                                            />
                                        </div>
                                        <div style={{ padding: '12px' }}>
                                            <p style={{ ...font, fontSize: '7px', color: '#ccc', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.caption || 'Untitled'}
                                            </p>
                                            <p style={{ ...font, fontSize: '6px', color: 'var(--brand)', letterSpacing: '0.1em' }}>
                                                {item.city}{item.city && item.country ? ', ' : ''}{item.country}
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="cursor-pointer"
                                                    style={{
                                                        ...font,
                                                        fontSize: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        background: 'none',
                                                        border: '1px solid #333',
                                                        color: 'var(--neon-cyan)',
                                                        padding: '6px 10px',
                                                        transition: 'all 0.3s',
                                                    }}
                                                >
                                                    <Edit2 className="w-2.5 h-2.5" />
                                                    EDIT
                                                </button>
                                                <button
                                                    onClick={() => deleteGalleryItem(item.id)}
                                                    className="cursor-pointer"
                                                    style={{
                                                        ...font,
                                                        fontSize: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        background: 'none',
                                                        border: '1px solid #333',
                                                        color: 'var(--neon-magenta)',
                                                        padding: '6px 10px',
                                                        transition: 'all 0.3s',
                                                    }}
                                                >
                                                    <Trash2 className="w-2.5 h-2.5" />
                                                    DEL
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
