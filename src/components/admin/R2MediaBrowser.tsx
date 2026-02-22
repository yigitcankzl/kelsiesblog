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
            className="border border-[var(--neon-cyan)] p-6 mb-6 bg-[#050505]"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 style={{ ...FONT, fontSize: '9px', color: 'var(--neon-cyan)' }}>{'>'} R2 MEDIA ({prefix})</h3>
                <button type="button" onClick={onClose} className="cursor-pointer bg-transparent border border-[#333] text-[#555] p-1.5">
                    <X className="w-3 h-3" />
                </button>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>
                    {selected.size} / {items.length} SELECTED
                </span>
                <div className="flex gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setSelected(new Set(items.map(i => i.key)))}
                        disabled={items.length === 0 || loading}
                        className="cursor-pointer bg-transparent border border-[#333] text-[#888] px-2.5 py-1.5"
                        style={{ ...FONT, fontSize: '6px' }}
                    >
                        SELECT ALL
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelected(new Set())}
                        disabled={selected.size === 0 || loading}
                        className="cursor-pointer bg-transparent border border-[#333] text-[#888] px-2.5 py-1.5"
                        style={{ ...FONT, fontSize: '6px' }}
                    >
                        CLEAR
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={selected.size === 0 || loading}
                        className="cursor-pointer flex items-center gap-1.5 bg-transparent border border-[var(--neon-magenta)] text-[var(--neon-magenta)] px-2.5 py-1.5"
                        style={{ ...FONT, fontSize: '6px' }}
                    >
                        {loading ? <Loader className="w-2.5 h-2.5 animate-spin" /> : <Trash2 className="w-2.5 h-2.5" />}
                        DELETE
                    </button>
                    {onSelect && (
                        <button
                            type="button"
                            onClick={handleSelect}
                            disabled={selected.size === 0 || loading}
                            className="cursor-pointer flex items-center gap-1.5 bg-[var(--neon-cyan)] text-black border-none px-2.5 py-1.5"
                            style={{ ...FONT, fontSize: '6px', opacity: selected.size === 0 ? 0.6 : 1 }}
                        >
                            <ImagePlus className="w-2.5 h-2.5" />
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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto">
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
                                    <img src={item.url} alt={item.key} className="w-full aspect-square object-cover block" />
                                ) : (
                                    <div className="w-full aspect-square flex items-center justify-center text-[#444]">
                                        <ImagePlus className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[var(--neon-cyan)] flex items-center justify-center text-[9px] text-black font-bold">&#10003;</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
