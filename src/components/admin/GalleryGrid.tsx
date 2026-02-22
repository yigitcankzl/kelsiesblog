import { motion } from 'framer-motion';
import { Trash2, Edit2, Image } from 'lucide-react';
import type { GalleryItem } from '@/types';
import { FONT } from '@/lib/constants';

interface GalleryGridProps {
    items: GalleryItem[];
    onEdit: (item: GalleryItem) => void;
    onDelete: (id: string) => void;
}

export default function GalleryGrid({ items, onEdit, onDelete }: GalleryGridProps) {
    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Image className="w-8 h-8 mx-auto" style={{ color: '#333', marginBottom: '16px' }} />
                <p style={{ ...FONT, fontSize: '9px', color: '#444', lineHeight: '2' }}>
                    NO GALLERY IMAGES YET
                </p>
                <p style={{ ...FONT, fontSize: '7px', color: '#333', marginTop: '8px' }}>
                    {'>'} ADD YOUR FIRST IMAGE_
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    style={{ border: '1px solid #1a1a1a', overflow: 'hidden', position: 'relative' }}
                >
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                        <img src={item.src} alt={item.caption} referrerPolicy="no-referrer"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} />
                    </div>
                    <div style={{ padding: '12px' }}>
                        <p style={{ ...FONT, fontSize: '7px', color: '#ccc', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.caption || 'Untitled'}
                        </p>
                        <p style={{ ...FONT, fontSize: '6px', color: 'var(--brand)', letterSpacing: '0.1em' }}>
                            {item.city}{item.city && item.country ? ', ' : ''}{item.country}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button onClick={() => onEdit(item)} className="cursor-pointer"
                                style={{
                                    ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                    background: 'none', border: '1px solid #333', color: 'var(--neon-cyan)',
                                    padding: '6px 10px', transition: 'all 0.3s',
                                }}>
                                <Edit2 className="w-2.5 h-2.5" />
                                EDIT
                            </button>
                            <button onClick={() => onDelete(item.id)} className="cursor-pointer"
                                style={{
                                    ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                    background: 'none', border: '1px solid #333', color: 'var(--neon-magenta)',
                                    padding: '6px 10px', transition: 'all 0.3s',
                                }}>
                                <Trash2 className="w-2.5 h-2.5" />
                                DEL
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
