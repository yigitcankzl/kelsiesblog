import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, ImagePlus, Loader } from 'lucide-react';
import { listR2Images, deleteR2Image, type R2Item } from '@/lib/r2Api';
import { FONT } from '@/lib/constants';

interface R2MediaBrowserProps {
    onClose: () => void;
    onSelect?: (urls: string[]) => void;
    prefix?: string;
}

export default function R2MediaBrowser({ onClose, onSelect, prefix = 'blog/' }: R2MediaBrowserProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [items, setItems] = useState<R2Item[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const loadItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await listR2Images(prefix);
            setItems(result);
            setSelected(new Set());
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'FAILED TO LIST R2');
        } finally {
            setLoading(false);
        }
    }, [prefix]);

    useEffect(() => { loadItems(); }, [loadItems]);

    const toggleSelect = (key: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key); else next.add(key);
            return next;
        });
    };

    const handleDelete = async () => {
        if (selected.size === 0) return;
        if (!confirm(`Delete ${selected.size} file(s)? This cannot be undone.`)) return;
        setLoading(true);
        setError('');
        try {
            for (const key of selected) {
                await deleteR2Image(key);
            }
            await loadItems();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'FAILED TO DELETE');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = () => {
        if (!onSelect) return;
        const urls = items.filter(i => selected.has(i.key)).map(i => i.url).filter(Boolean) as string[];
        if (urls.length === 0) {
            setError('No selectable URLs.');
            return;
        }
        onSelect(urls);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ border: '1px solid var(--neon-cyan)', padding: '24px', marginBottom: '24px', backgroundColor: '#050505' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ ...FONT, fontSize: '9px', color: 'var(--neon-cyan)' }}>{'>'} R2 MEDIA ({prefix})</h3>
                <button type="button" onClick={onClose} className="cursor-pointer" style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '6px' }}>
                    <X style={{ width: '12px', height: '12px' }} />
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>
                    {selected.size} / {items.length} SELECTED
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => setSelected(new Set(items.map(i => i.key)))}
                        disabled={items.length === 0 || loading}
                        className="cursor-pointer"
                        style={{ ...FONT, fontSize: '6px', background: 'none', border: '1px solid #333', color: '#888', padding: '6px 10px' }}
                    >
                        SELECT ALL
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelected(new Set())}
                        disabled={selected.size === 0 || loading}
                        className="cursor-pointer"
                        style={{ ...FONT, fontSize: '6px', background: 'none', border: '1px solid #333', color: '#888', padding: '6px 10px' }}
                    >
                        CLEAR
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={selected.size === 0 || loading}
                        className="cursor-pointer"
                        style={{
                            ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'none', border: '1px solid var(--neon-magenta)', color: 'var(--neon-magenta)',
                            padding: '6px 10px',
                        }}
                    >
                        {loading ? <Loader style={{ width: '10px', height: '10px' }} className="animate-spin" /> : <Trash2 style={{ width: '10px', height: '10px' }} />}
                        DELETE
                    </button>
                    {onSelect && (
                        <button
                            type="button"
                            onClick={handleSelect}
                            disabled={selected.size === 0 || loading}
                            className="cursor-pointer"
                            style={{
                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'var(--neon-cyan)', color: '#000', border: 'none',
                                padding: '6px 10px', opacity: selected.size === 0 ? 0.6 : 1,
                            }}
                        >
                            <ImagePlus style={{ width: '10px', height: '10px' }} />
                            USE SELECTED
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <p style={{ ...FONT, fontSize: '7px', color: 'var(--neon-magenta)', marginBottom: '12px' }}>{error}</p>
            )}

            {loading && items.length === 0 ? (
                <p style={{ ...FONT, fontSize: '7px', color: '#666' }}>LOADING...</p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {items.map(item => {
                        const isSelected = selected.has(item.key);
                        return (
                            <div
                                key={item.key}
                                onClick={() => toggleSelect(item.key)}
                                className="cursor-pointer"
                                style={{
                                    border: `2px solid ${isSelected ? 'var(--neon-cyan)' : '#1a1a1a'}`,
                                    overflow: 'hidden', position: 'relative',
                                    opacity: isSelected ? 1 : 0.6,
                                    transition: 'all 0.2s',
                                }}
                                title={item.key}
                            >
                                {item.url ? (
                                    <img src={item.url} alt={item.key} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                                ) : (
                                    <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                        <ImagePlus style={{ width: '14px', height: '14px' }} />
                                    </div>
                                )}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute', top: '4px', right: '4px',
                                        width: '14px', height: '14px', backgroundColor: 'var(--neon-cyan)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '9px', color: '#000', fontWeight: 'bold',
                                    }}>&#10003;</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
