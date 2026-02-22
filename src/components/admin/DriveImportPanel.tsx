import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Loader } from 'lucide-react';
import { parseFolderId, listDriveImages, driveThumbUrl } from '@/lib/googleDrive';
import { FONT } from '@/lib/constants';
import { inputStyle } from '@/lib/adminStyles';

interface DriveImage {
    id: string;
    name: string;
    url: string;
}

interface DriveImportPanelProps {
    onImport: (images: DriveImage[]) => void;
    onClose: () => void;
}

export default function DriveImportPanel({ onImport, onClose }: DriveImportPanelProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<DriveImage[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleFetch = async () => {
        const folderId = parseFolderId(url);
        if (!folderId) { setError('INVALID DRIVE FOLDER LINK'); return; }

        setLoading(true);
        setError('');
        setResults([]);
        setSelected(new Set());

        try {
            const files = await listDriveImages(folderId);
            if (files.length === 0) { setError('NO IMAGES FOUND IN FOLDER'); setLoading(false); return; }
            const mapped = files.map(f => ({ id: f.id, name: f.name, url: driveThumbUrl(f.id) }));
            setResults(mapped);
            setSelected(new Set(mapped.map(r => r.id)));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'FAILED TO FETCH FROM DRIVE');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleImport = () => {
        const toImport = results.filter(r => selected.has(r.id));
        onImport(toImport);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[var(--brand)] p-6 mb-6 bg-[#050505]"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 style={{ ...FONT, fontSize: '9px', color: 'var(--brand)' }}>{'>'} IMPORT FROM GOOGLE DRIVE</h3>
                <button type="button" onClick={onClose} className="cursor-pointer bg-transparent border border-[#333] text-[#555] p-1.5">
                    <X className="w-3 h-3" />
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={url}
                    onChange={e => { setUrl(e.target.value); setError(''); }}
                    placeholder="PASTE GOOGLE DRIVE FOLDER LINK..."
                    style={{ ...inputStyle, flex: 1 }}
                />
                <button
                    type="button"
                    onClick={handleFetch}
                    disabled={loading || !url.trim()}
                    className="cursor-pointer"
                    style={{
                        ...FONT, fontSize: '7px', padding: '10px 16px', letterSpacing: '0.1em',
                        backgroundColor: url.trim() ? 'var(--brand)' : '#1a1a1a',
                        color: url.trim() ? '#000' : '#444',
                        border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
                        cursor: url.trim() ? 'pointer' : 'not-allowed',
                    }}
                >
                    {loading ? <Loader className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                    {loading ? 'LOADING...' : 'FETCH'}
                </button>
            </div>

            {error && (
                <p style={{ ...FONT, fontSize: '7px', color: 'var(--neon-magenta)', marginBottom: '12px' }}>{error}</p>
            )}

            {results.length > 0 && (
                <>
                    <div className="flex items-center justify-between mb-3">
                        <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>
                            {selected.size} / {results.length} SELECTED
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                if (selected.size === results.length) setSelected(new Set());
                                else setSelected(new Set(results.map(r => r.id)));
                            }}
                            className="cursor-pointer bg-transparent border border-[#333] text-[#888] px-2.5 py-1"
                            style={{ ...FONT, fontSize: '6px' }}
                        >
                            {selected.size === results.length ? 'DESELECT ALL' : 'SELECT ALL'}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto mb-4">
                        {results.map(r => {
                            const isSelected = selected.has(r.id);
                            return (
                                <div
                                    key={r.id}
                                    onClick={() => toggleSelect(r.id)}
                                    className="cursor-pointer"
                                    style={{
                                        border: `2px solid ${isSelected ? 'var(--brand)' : '#1a1a1a'}`,
                                        overflow: 'hidden', position: 'relative',
                                        opacity: isSelected ? 1 : 0.4,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <img src={r.url} alt={r.name} referrerPolicy="no-referrer"
                                        className="w-full aspect-square object-cover block" />
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[var(--brand)] flex items-center justify-center text-[9px] text-black font-bold">&#10003;</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleImport}
                        disabled={selected.size === 0}
                        className="cursor-pointer"
                        style={{
                            ...FONT, fontSize: '8px', padding: '12px 24px', letterSpacing: '0.1em',
                            backgroundColor: selected.size > 0 ? 'var(--brand)' : '#1a1a1a',
                            color: selected.size > 0 ? '#000' : '#444',
                            border: 'none',
                            boxShadow: selected.size > 0 ? '0 0 15px rgba(0, 255, 65, 0.3)' : 'none',
                            cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                        }}
                    >
                        IMPORT {selected.size} IMAGE{selected.size !== 1 ? 'S' : ''}
                    </button>
                </>
            )}
        </motion.div>
    );
}
