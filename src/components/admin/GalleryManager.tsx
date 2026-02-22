import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Image, UploadCloud } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { GalleryItem } from '@/types';
import R2MediaBrowser from './R2MediaBrowser';
import DriveImportPanel from './DriveImportPanel';
import GalleryForm, { type GalleryFormData } from './GalleryForm';
import GalleryGrid from './GalleryGrid';
import { FONT } from '@/lib/constants';

const emptyForm: GalleryFormData = { src: '', caption: '', city: '', country: '' };

export default function GalleryManager() {
    const { posts, galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useBlogStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<GalleryFormData>(emptyForm);

    const [showDriveImport, setShowDriveImport] = useState(false);
    const [showR2Browser, setShowR2Browser] = useState(false);

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
    };

    const startAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setForm(emptyForm);
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
            addGalleryItem({ id: `gallery-${Date.now()}`, ...form });
        }
        cancel();
    };

    const handleDriveImport = (images: { id: string; name: string; url: string }[]) => {
        images.forEach(img => {
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
    };

    const showForm = isAdding || editingId !== null;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Image className="w-4 h-4 text-[var(--neon-cyan)]" />
                    <div>
                        <h2 style={{ ...FONT, fontSize: '11px', color: '#fff' }}>GALLERY ITEMS</h2>
                        <p style={{ ...FONT, fontSize: '6px', color: '#555', marginTop: '4px', letterSpacing: '0.15em' }}>
                            {galleryItems.length} {galleryItems.length === 1 ? 'IMAGE' : 'IMAGES'} LOADED
                        </p>
                    </div>
                </div>
                {!showForm && (
                    <div className="flex gap-3">
                        <button onClick={() => setShowR2Browser(true)} className="cursor-pointer"
                            style={{ ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)', padding: '10px 16px', letterSpacing: '0.1em', transition: 'all 0.3s' }}>
                            <Image className="w-3 h-3" /> R2 MEDIA
                        </button>
                        <button onClick={() => setShowDriveImport(true)} className="cursor-pointer"
                            style={{ ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: 'var(--brand)', border: '1px solid var(--brand)', padding: '10px 16px', letterSpacing: '0.1em', transition: 'all 0.3s' }}>
                            <UploadCloud className="w-3 h-3" /> IMPORT DRIVE
                        </button>
                        <button onClick={startAdd} className="cursor-pointer"
                            style={{ ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--neon-cyan)', color: '#000', border: 'none', padding: '10px 16px', letterSpacing: '0.1em', boxShadow: '0 0 12px rgba(0, 255, 255, 0.3)', transition: 'all 0.3s' }}>
                            <Plus className="w-3 h-3" /> ADD IMAGE
                        </button>
                    </div>
                )}
            </div>

            {showR2Browser && <R2MediaBrowser onClose={() => setShowR2Browser(false)} />}
            {showDriveImport && <DriveImportPanel onImport={handleDriveImport} onClose={() => setShowDriveImport(false)} />}

            <AnimatePresence mode="wait">
                {showForm ? (
                    <motion.div key="gallery-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        <GalleryForm
                            form={form}
                            onFormChange={setForm}
                            onSave={handleSave}
                            onCancel={cancel}
                            isEditing={editingId !== null}
                            uniqueCountries={uniqueCountries}
                            availableCities={availableCities}
                        />
                    </motion.div>
                ) : (
                    <motion.div key="gallery-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        <GalleryGrid items={galleryItems} onEdit={startEdit} onDelete={deleteGalleryItem} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
