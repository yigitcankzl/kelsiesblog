import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Image, UploadCloud } from 'lucide-react';
import { useBlogStore } from '../../store/store';
import type { GalleryItem } from '../../types';

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
                            onClick={() => {
                                const driveImages = [
                                    {
                                        src: 'https://drive.google.com/thumbnail?id=1Mz6gPrV65yEMScZGF0iSdv0bDhDBTs3J&sz=w4096',
                                        caption: 'Imported from Drive',
                                        city: 'Unknown',
                                        country: 'Unknown'
                                    }
                                ];

                                if (confirm(`Import ${driveImages.length} images from Drive?`)) {
                                    driveImages.forEach(img => {
                                        // Check if already exists to avoid duplicates
                                        if (!galleryItems.some(item => item.src === img.src)) {
                                            addGalleryItem({
                                                id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                                ...img
                                            });
                                        }
                                    });
                                }
                            }}
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
                                    <input
                                        type="text"
                                        value={form.src}
                                        onChange={e => { setForm({ ...form, src: e.target.value }); setPreviewError(false); }}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
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
