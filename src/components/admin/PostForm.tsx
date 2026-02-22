import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, ChevronUp, ChevronDown, Type, ImagePlus, AlignLeft, UploadCloud, Loader } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { BlogPost, Section } from '@/types';
import { CONTENT_FONTS, getFontConfig } from '@/types';
import { countryBounds } from '@/data/countryBounds';
import { worldCities } from '@/data/worldCities';
import { fetchCityBoundary } from '@/lib/cityBoundaryCache';
import { mergePostFields } from '@/lib/firestore';
import { parseFolderId, listDriveImages, driveThumbUrl } from '@/lib/googleDrive';
import { uploadImageToR2, listR2Images, deleteR2Image, type R2Item } from '@/lib/r2Api';
import RichTextEditor from './RichTextEditor';
import { FONT, CATEGORIES } from '@/lib/constants';

const inputStyle: React.CSSProperties = {
    ...FONT,
    fontSize: '9px',
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    color: 'var(--brand)',
    outline: 'none',
    transition: 'all 0.3s',
    letterSpacing: '0.1em',
};

const labelStyle: React.CSSProperties = {
    ...FONT,
    fontSize: '7px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
};

interface PostFormProps {
    post: BlogPost | null;
    onSave: () => void;
    onCancel: () => void;
}

const emptySection: Section = { heading: '', content: '', contents: [''], images: [] };

// Normalize legacy sections: `image` → `images[]`, `content`/`contents[]` → `content` (HTML)
function normalizeSections(sections: Section[]): Section[] {
    return sections.map(s => {
        const imgs = s.images?.length ? [...s.images] : (s.image ? [s.image] : []);

        // Convert legacy contents[] to HTML string
        let htmlContent = s.content || '';
        if (s.contents?.length) {
            htmlContent = s.contents.map(c => {
                if (c.startsWith('IMAGE::')) {
                    const url = c.replace('IMAGE::', '');
                    return `<img src="${url}" />`;
                }
                return `<p>${c}</p>`;
            }).join('');
        }

        return { heading: s.heading, content: htmlContent, contents: [], images: imgs };
    });
}



export default function PostForm({ post, onSave, onCancel }: PostFormProps) {
    const { addPost, updatePost } = useBlogStore();

    const [title, setTitle] = useState(post?.title || '');
    const [country, setCountry] = useState(post?.country || '');
    const [city, setCity] = useState(post?.city || '');
    const [date, setDate] = useState(post?.date || '');
    const [coverImage, setCoverImage] = useState(post?.coverImage || '');
    const [categories, setCategories] = useState<string[]>(post?.category || []);
    const [contentFont, setContentFont] = useState(post?.contentFont || 'Press Start 2P');
    const [showPreview, setShowPreview] = useState(false);
    const [sections, setSections] = useState<Section[]>(
        post?.sections?.length ? normalizeSections(post.sections) : [{ ...emptySection }]
    );

    const isEditing = post !== null;

    const coverFileInputRef = useRef<HTMLInputElement>(null);
    const sectionImageFileInputRef = useRef<HTMLInputElement>(null);

    const [coverUploading, setCoverUploading] = useState(false);
    const [sectionUploadingIndex, setSectionUploadingIndex] = useState<number | null>(null);
    const [sectionImageUploading, setSectionImageUploading] = useState<number | null>(null);

    // R2 media browser (pick existing + delete)
    const [showR2Browser, setShowR2Browser] = useState(false);
    const [r2PickTarget, setR2PickTarget] = useState<{ kind: 'cover' } | { kind: 'section'; index: number } | { kind: 'inline'; sectionIndex: number; contentIndex: number } | null>(null);
    const [r2Loading, setR2Loading] = useState(false);
    const [r2Error, setR2Error] = useState('');
    const [r2Items, setR2Items] = useState<R2Item[]>([]);
    const [r2Selected, setR2Selected] = useState<Set<string>>(new Set());

    // --- Drafts ---
    const [draftFound, setDraftFound] = useState(false);

    // Load draft on mount
    useEffect(() => {
        if (!isEditing) {
            const draft = localStorage.getItem('kelsiesblog_draft');
            if (draft) {
                setDraftFound(true);
            }
        }
    }, [isEditing]);

    // Auto-save draft
    useEffect(() => {
        if (isEditing) return; // Don't overwrite draft while editing existing post

        const timer = setTimeout(() => {
            const draftData = {
                title,
                country,
                city,
                date,
                coverImage,
                categories,
                contentFont,
                sections,
                timestamp: Date.now()
            };
            localStorage.setItem('kelsiesblog_draft', JSON.stringify(draftData));
        }, 1000); // Debounce 1s

        return () => clearTimeout(timer);
    }, [title, country, city, date, coverImage, categories, contentFont, sections, isEditing]);

    const restoreDraft = () => {
        try {
            const draft = localStorage.getItem('kelsiesblog_draft');
            if (!draft) return;
            const data = JSON.parse(draft);
            setTitle(data.title || '');
            setCountry(data.country || '');
            setCity(data.city || '');
            setDate(data.date || '');
            setCoverImage(data.coverImage || '');
            setCategories(data.categories || []);
            setContentFont(data.contentFont || 'Press Start 2P');
            setSections(data.sections || [{ ...emptySection }]);
            setDraftFound(false); // Hide prompt after restore
        } catch (e) {
            console.error('Failed to restore draft', e);
        }
    };

    const discardDraft = () => {
        localStorage.removeItem('kelsiesblog_draft');
        setDraftFound(false);
    };

    const loadR2 = async () => {
        setR2Loading(true);
        setR2Error('');
        try {
            const items = await listR2Images('blog/');
            setR2Items(items);
            setR2Selected(new Set());
        } catch (err: any) {
            setR2Error(err?.message || 'FAILED TO LIST R2');
        } finally {
            setR2Loading(false);
        }
    };

    const openR2ForCover = async () => {
        setR2PickTarget({ kind: 'cover' });
        setShowR2Browser(true);
        await loadR2();
    };

    const openR2ForSection = async (index: number) => {
        setR2PickTarget({ kind: 'section', index });
        setShowR2Browser(true);
        await loadR2();
    };



    const closeR2 = () => {
        setShowR2Browser(false);
        setR2PickTarget(null);
        setR2Loading(false);
        setR2Error('');
        setR2Items([]);
        setR2Selected(new Set());
    };

    const toggleR2Select = (key: string) => {
        setR2Selected(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key); else next.add(key);
            return next;
        });
    };

    const insertSelectedFromR2 = () => {
        if (!r2PickTarget) return;
        const selectedItems = r2Items.filter(i => r2Selected.has(i.key));
        const urls = selectedItems.map(i => i.url).filter(Boolean) as string[];
        if (urls.length === 0) {
            setR2Error('No selectable URLs.');
            return;
        }

        if (r2PickTarget.kind === 'cover') {
            setCoverImage(urls[0]);
            closeR2();
            return;
        }

        if (r2PickTarget.kind === 'section') {
            const idx = r2PickTarget.index;
            setSections(prev => prev.map((s, i) => {
                if (i !== idx) return s;
                const existing = s.images || [];
                const merged = Array.from(new Set([...existing, ...urls]));
                return { ...s, images: merged };
            }));
            closeR2();
            return;
        }

        // Add logical fallthrough or additional handling if 'inline' is needed in future
        closeR2();
    };

    const deleteSelectedFromR2 = async () => {
        if (r2Selected.size === 0) return;
        if (!confirm(`Delete ${r2Selected.size} file(s)? This cannot be undone.`)) return;
        setR2Loading(true);
        setR2Error('');
        try {
            const keys = Array.from(r2Selected);
            for (const key of keys) {
                await deleteR2Image(key);
            }
            await loadR2();
        } catch (err: any) {
            setR2Error(err?.message || 'FAILED TO DELETE');
        } finally {
            setR2Loading(false);
        }
    };

    const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File too large. Maximum size is 10MB.');
            e.target.value = '';
            return;
        }

        setCoverUploading(true);
        try {
            const result = await uploadImageToR2(file);
            setCoverImage(result.url);
        } catch (err: unknown) {
            console.error('Cover upload failed:', err);
            const errorMsg = err instanceof Error ? err.message : 'Upload failed';
            alert(`Upload failed: ${errorMsg}`);
        } finally {
            setCoverUploading(false);
            e.target.value = '';
        }
    };

    const handleSectionImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const idx = sectionUploadingIndex;
        if (!file || !file.type.startsWith('image/') || idx == null) return;
        setSectionImageUploading(idx);
        try {
            const result = await uploadImageToR2(file);
            setSections(prev => prev.map((s, i) =>
                i === idx ? { ...s, images: [...(s.images || []), result.url] } : s
            ));
        } catch (err: unknown) {
            console.error('Section image upload failed:', err);
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setSectionUploadingIndex(null);
            setSectionImageUploading(null);
            e.target.value = '';
        }
    };



    const availableCategories = CATEGORIES;

    const toggleCategory = (cat: string) => {
        setCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const citiesForCountry = useMemo(() => {
        if (!country) return [];
        return (worldCities[country] || []).map(c => c.name);
    }, [country]);

    const getCoordinates = (): [number, number] => {
        if (!country || !city) return [0, 0];
        const cityData = (worldCities[country] || []).find(c => c.name === city);
        if (cityData) return [cityData.lat, cityData.lng];
        return post?.coordinates || [0, 0];
    };

    const addSection = () => {
        setSections([...sections, { ...emptySection }]);
    };

    const removeSection = (index: number) => {
        if (sections.length <= 1) return;
        setSections(sections.filter((_, i) => i !== index));
    };

    const updateSection = (index: number, field: keyof Section, value: string) => {
        const updated = sections.map((s, i) =>
            i === index ? { ...s, [field]: value } : s
        );
        setSections(updated);
    };





    // --- Content helpers ---
    const updateSectionContent = (index: number, html: string) => {
        setSections(prev => prev.map((s, i) =>
            i === index ? { ...s, content: html } : s
        ));
    };

    // --- Image helpers for a section ---
    const addImageToSection = (sectionIndex: number) => {
        setSections(prev => prev.map((s, i) =>
            i === sectionIndex ? { ...s, images: [...(s.images || []), ''] } : s
        ));
    };

    const updateImageInSection = (sectionIndex: number, imgIndex: number, value: string) => {
        setSections(prev => prev.map((s, i) => {
            if (i !== sectionIndex) return s;
            const imgs = [...(s.images || [])];
            imgs[imgIndex] = value;
            return { ...s, images: imgs };
        }));
    };

    const removeImageFromSection = (sectionIndex: number, imgIndex: number) => {
        setSections(prev => prev.map((s, i) => {
            if (i !== sectionIndex) return s;
            const imgs = (s.images || []).filter((_, j) => j !== imgIndex);
            return { ...s, images: imgs };
        }));
    };

    // --- Drive import for section images ---
    const [driveImportIdx, setDriveImportIdx] = useState<number | null>(null);
    const [driveUrl, setDriveUrl] = useState('');
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveError, setDriveError] = useState('');

    const handleDriveImportForSection = async (sectionIndex: number) => {
        const folderId = parseFolderId(driveUrl);
        if (!folderId) { setDriveError('INVALID DRIVE FOLDER LINK'); return; }

        setDriveLoading(true);
        setDriveError('');
        try {
            const files = await listDriveImages(folderId);
            if (files.length === 0) { setDriveError('NO IMAGES FOUND'); setDriveLoading(false); return; }
            const urls = files.map(f => driveThumbUrl(f.id));
            setSections(prev => prev.map((s, i) => {
                if (i !== sectionIndex) return s;
                const existing = s.images || [];
                return { ...s, images: [...existing, ...urls] };
            }));
            setDriveImportIdx(null);
            setDriveUrl('');
        } catch (err: any) {
            setDriveError(err.message || 'FAILED TO FETCH');
        } finally {
            setDriveLoading(false);
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;
        const updated = [...sections];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setSections(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanSections = sections
            .filter(s => s.heading.trim() || (s.contents || []).some(c => c.trim()))
            .map(s => {
                const imgs = (s.images || []).map(u => u.trim()).filter(Boolean);

                return {
                    heading: s.heading.trim(),
                    content: s.content || '',
                    contents: [], // Clear legacy
                    ...(imgs.length ? { images: imgs } : {}),
                };
            });

        const cityTrimmed = city.trim();
        const countryTrimmed = country.trim();

        const postData: BlogPost = {
            id: post?.id || `post-${Date.now()}`,
            title: title.trim(),
            country: countryTrimmed,
            city: cityTrimmed,
            coordinates: getCoordinates(),
            coverImage,
            date: date.trim(),
            category: categories,
            contentFont,
            sections: cleanSections,
        };

        // Save post immediately
        if (isEditing) {
            updatePost(post.id, postData);
        } else {
            addPost(postData);
        }

        onSave();

        // Fetch boundary in background (non-blocking) and save to Firestore
        const postId = postData.id;
        fetchCityBoundary(cityTrimmed, countryTrimmed)
            .then(async (feature) => {
                if (!feature?.geometry) {
                    console.log('[Boundary] No boundary found for', cityTrimmed);
                    return;
                }
                console.log('[Boundary] Saving boundary for', cityTrimmed, '- geometry size:', JSON.stringify(feature.geometry).length, 'bytes');
                // Use setDoc with merge — safe for both new and existing documents
                await mergePostFields(postId, { cityBoundary: feature.geometry });
                console.log('[Boundary] Saved to Firestore successfully');
                // Update in-memory store
                useBlogStore.setState((state) => ({
                    posts: state.posts.map((p) =>
                        p.id === postId ? { ...p, cityBoundary: feature.geometry } : p
                    ),
                }));
            })
            .catch(err => console.error('[Boundary] Failed to save city boundary:', err));

        // Clear draft
        if (!isEditing) {
            localStorage.removeItem('kelsiesblog_draft');
        }
    };

    const isValid = title.trim() && country.trim() && city.trim() && sections.some(s => s.heading.trim() && s.content?.trim());

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = 'var(--brand)';
        e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 255, 65, 0.15)';
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = '#333';
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '768px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ ...FONT, fontSize: '12px', color: '#fff' }}>
                        {isEditing ? 'EDIT POST' : 'NEW POST'}
                    </h2>
                    <p style={{ ...FONT, fontSize: '6px', color: '#555', marginTop: '6px', letterSpacing: '0.15em' }}>
                        {'>'} {isEditing ? 'MODIFYING EXISTING ENTRY_' : 'CREATING NEW ENTRY_'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer"
                    style={{
                        background: 'none',
                        border: '1px solid #333',
                        color: '#555',
                        padding: '8px',
                        transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                >
                    <X style={{ width: '16px', height: '16px' }} />
                </button>
            </div>

            {/* Draft Banner */}
            {draftFound && (
                <div style={{
                    backgroundColor: '#1a1a00',
                    border: '1px solid var(--neon-amber)',
                    padding: '12px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader style={{ color: 'var(--neon-amber)', width: '16px', height: '16px' }} />
                        <span style={{ ...FONT, fontSize: '8px', color: 'var(--neon-amber)' }}>
                            UNSAVED DRAFT FOUND
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={restoreDraft}
                            className="cursor-pointer"
                            style={{
                                ...FONT,
                                fontSize: '8px',
                                padding: '6px 12px',
                                backgroundColor: 'var(--neon-amber)',
                                color: '#000',
                                border: 'none'
                            }}
                        >
                            RESTORE
                        </button>
                        <button
                            type="button"
                            onClick={discardDraft}
                            className="cursor-pointer"
                            style={{
                                ...FONT,
                                fontSize: '8px',
                                padding: '6px 12px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--neon-amber)',
                                color: 'var(--neon-amber)'
                            }}
                        >
                            DISCARD
                        </button>
                    </div>
                </div>
            )}

            {/* Basic Info */}
            <div style={{
                border: '1px solid #1a1a1a',
                padding: '24px',
                backgroundColor: '#050505',
                marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <Type style={{ width: '12px', height: '12px', color: 'var(--brand)' }} />
                    <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        BASIC INFO
                    </h3>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #333, transparent)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>TITLE</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ENTER POST TITLE..."
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>COUNTRY</label>
                            <select
                                value={country}
                                onChange={(e) => { setCountry(e.target.value); setCity(''); }}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                onFocus={handleInputFocus as any}
                                onBlur={handleInputBlur as any}
                                required
                            >
                                <option value="">SELECT...</option>
                                {countryBounds.map((c) => (
                                    <option key={c.code} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>CITY</label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', opacity: country ? 1 : 0.4 }}
                                onFocus={handleInputFocus as any}
                                onBlur={handleInputBlur as any}
                                required
                                disabled={!country}
                            >
                                <option value="">{country ? 'SELECT CITY...' : 'SELECT COUNTRY FIRST'}</option>
                                {citiesForCountry.map((c: string) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            CATEGORIES
                            {categories.length > 0 && (
                                <span style={{ color: 'var(--neon-cyan)' }}>[ {categories.length} ]</span>
                            )}
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {availableCategories.map(cat => {
                                const isActive = categories.includes(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleCategory(cat)}
                                        className="cursor-pointer"
                                        style={{
                                            ...FONT,
                                            fontSize: '7px',
                                            padding: '8px 14px',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            border: '1px solid',
                                            borderColor: isActive ? 'var(--neon-magenta)' : '#333',
                                            backgroundColor: isActive ? 'var(--neon-magenta)' : 'transparent',
                                            color: isActive ? '#000' : '#666',
                                            boxShadow: isActive ? '0 0 10px rgba(255, 0, 228, 0.3)' : 'none',
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={e => {
                                            if (!isActive) {
                                                e.currentTarget.style.borderColor = '#555';
                                                e.currentTarget.style.color = '#aaa';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!isActive) {
                                                e.currentTarget.style.borderColor = '#333';
                                                e.currentTarget.style.color = '#666';
                                            }
                                        }}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>DATE</label>
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="E.G. MARCH 2024"
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>

                    {/* Content Font */}
                    <div>
                        <label style={labelStyle}>CONTENT FONT</label>
                        <select
                            value={contentFont}
                            onChange={(e) => setContentFont(e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                            onFocus={handleInputFocus as any}
                            onBlur={handleInputBlur as any}
                        >
                            {CONTENT_FONTS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        {/* Font preview */}
                        <div style={{
                            marginTop: '10px',
                            padding: '14px',
                            border: '1px solid #1a1a1a',
                            backgroundColor: '#080808',
                        }}>
                            <span style={{
                                fontFamily: getFontConfig(contentFont).family,
                                fontSize: getFontConfig(contentFont).size,
                                color: '#aaa',
                                lineHeight: '2.2',
                            }}>
                                The quick brown fox jumps over the lazy dog.
                            </span>
                        </div>
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label style={labelStyle}>COVER IMAGE URL</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="url"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="HTTPS://... VEYA BILGISAYARDAN YÜKLE"
                                style={{ ...inputStyle, flex: '1 1 200px' }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                            <input
                                ref={coverFileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleCoverFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => coverFileInputRef.current?.click()}
                                disabled={coverUploading}
                                className="cursor-pointer"
                                style={{
                                    ...FONT,
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
                                {coverUploading ? <Loader style={{ width: '12px', height: '12px' }} className="animate-spin" /> : <UploadCloud style={{ width: '12px', height: '12px' }} />}
                                {coverUploading ? 'YÜKLENİYOR...' : 'BILGISAYARDAN YÜKLE'}
                            </button>
                            <button
                                type="button"
                                onClick={openR2ForCover}
                                className="cursor-pointer"
                                style={{
                                    ...FONT,
                                    fontSize: '7px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 14px',
                                    border: '1px solid #333',
                                    color: '#aaa',
                                    background: 'none',
                                    letterSpacing: '0.1em',
                                    transition: 'all 0.3s',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa'; }}
                            >
                                <ImagePlus style={{ width: '12px', height: '12px' }} />
                                R2 MEDIA
                            </button>
                        </div>

                        {/* R2 media browser */}
                        {showR2Browser && (
                            <div style={{ border: '1px solid var(--neon-cyan)', padding: '14px', backgroundColor: '#050505', marginTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)', letterSpacing: '0.15em' }}>
                                        {'>'} R2 MEDIA (blog/)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={closeR2}
                                        className="cursor-pointer"
                                        style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '4px' }}
                                    >
                                        <X style={{ width: '12px', height: '12px' }} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    <span style={{ ...FONT, fontSize: '6px', color: '#777' }}>
                                        {r2Selected.size} / {r2Items.length} SELECTED
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button
                                            type="button"
                                            onClick={() => setR2Selected(new Set(r2Items.map(i => i.key)))}
                                            disabled={r2Items.length === 0 || r2Loading}
                                            className="cursor-pointer"
                                            style={{ ...FONT, fontSize: '6px', background: 'none', border: '1px solid #333', color: '#888', padding: '6px 10px' }}
                                        >
                                            SELECT ALL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setR2Selected(new Set())}
                                            disabled={r2Selected.size === 0 || r2Loading}
                                            className="cursor-pointer"
                                            style={{ ...FONT, fontSize: '6px', background: 'none', border: '1px solid #333', color: '#888', padding: '6px 10px' }}
                                        >
                                            CLEAR
                                        </button>
                                        <button
                                            type="button"
                                            onClick={deleteSelectedFromR2}
                                            disabled={r2Selected.size === 0 || r2Loading}
                                            className="cursor-pointer"
                                            style={{
                                                ...FONT,
                                                fontSize: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                background: 'none',
                                                border: '1px solid var(--neon-magenta)',
                                                color: 'var(--neon-magenta)',
                                                padding: '6px 10px',
                                            }}
                                        >
                                            {r2Loading ? <Loader style={{ width: '10px', height: '10px' }} className="animate-spin" /> : <Trash2 style={{ width: '10px', height: '10px' }} />}
                                            DELETE
                                        </button>
                                        <button
                                            type="button"
                                            onClick={insertSelectedFromR2}
                                            disabled={r2Selected.size === 0 || r2Loading}
                                            className="cursor-pointer"
                                            style={{
                                                ...FONT,
                                                fontSize: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                background: 'var(--neon-cyan)',
                                                color: '#000',
                                                border: 'none',
                                                padding: '6px 10px',
                                                opacity: r2Selected.size === 0 ? 0.6 : 1,
                                            }}
                                        >
                                            <ImagePlus style={{ width: '10px', height: '10px' }} />
                                            USE SELECTED
                                        </button>
                                    </div>
                                </div>

                                {r2Error && (
                                    <p style={{ ...FONT, fontSize: '6px', color: 'var(--neon-magenta)', marginBottom: '8px' }}>{r2Error}</p>
                                )}

                                {r2Loading && r2Items.length === 0 ? (
                                    <p style={{ ...FONT, fontSize: '6px', color: '#666' }}>LOADING...</p>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                        {r2Items.map(item => {
                                            const selected = r2Selected.has(item.key);
                                            return (
                                                <div
                                                    key={item.key}
                                                    onClick={() => toggleR2Select(item.key)}
                                                    className="cursor-pointer"
                                                    style={{
                                                        border: `2px solid ${selected ? 'var(--neon-cyan)' : '#1a1a1a'}`,
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                        opacity: selected ? 1 : 0.65,
                                                        transition: 'all 0.2s',
                                                    }}
                                                    title={item.key}
                                                >

                                                    {item.url ? (
                                                        <img
                                                            src={item.url}
                                                            alt={item.key}
                                                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                                            <ImagePlus style={{ width: '14px', height: '14px' }} />
                                                        </div>
                                                    )}
                                                    {selected && (
                                                        <div style={{
                                                            position: 'absolute', top: '4px', right: '4px',
                                                            width: '14px', height: '14px', backgroundColor: 'var(--neon-cyan)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '9px', color: '#000', fontWeight: 'bold',
                                                        }}>✓</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                        {coverImage && (
                            <div style={{
                                marginTop: '10px',
                                border: '1px solid var(--brand)',
                                overflow: 'hidden',
                                position: 'relative',
                                height: '140px',
                            }}>
                                <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(0.85)' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                                <span style={{ ...FONT, fontSize: '6px', position: 'absolute', bottom: '8px', left: '10px', color: 'var(--brand)', letterSpacing: '0.1em' }}>
                                    PREVIEW
                                </span>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Sections */}
            <div style={{
                border: '1px solid #1a1a1a',
                padding: '24px',
                backgroundColor: '#050505',
                marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            CONTENT SECTIONS
                        </h3>
                        <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>
                            [ {sections.length} ]
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={addSection}
                        className="cursor-pointer"
                        style={{
                            ...FONT,
                            fontSize: '7px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--brand)',
                            background: 'none',
                            border: '1px solid var(--brand)',
                            padding: '8px 12px',
                            letterSpacing: '0.1em',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--brand)'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--brand)'; }}
                    >
                        <Plus style={{ width: '12px', height: '12px' }} />
                        ADD
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                border: '1px solid #1a1a1a',
                                padding: '20px',
                                position: 'relative',
                                backgroundColor: '#080808',
                                transition: 'border-color 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
                        >
                            {/* Section header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ ...FONT, fontSize: '7px', color: 'var(--brand)' }}>
                                    SEC_{String(index + 1).padStart(2, '0')}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <button
                                        type="button"
                                        onClick={() => moveSection(index, 'up')}
                                        disabled={index === 0}
                                        className="cursor-pointer"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'none',
                                            border: '1px solid #333',
                                            color: '#555',
                                            opacity: index === 0 ? 0.3 : 1,
                                        }}
                                    >
                                        <ChevronUp style={{ width: '12px', height: '12px' }} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSection(index, 'down')}
                                        disabled={index === sections.length - 1}
                                        className="cursor-pointer"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'none',
                                            border: '1px solid #333',
                                            color: '#555',
                                            opacity: index === sections.length - 1 ? 0.3 : 1,
                                        }}
                                    >
                                        <ChevronDown style={{ width: '12px', height: '12px' }} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeSection(index)}
                                        disabled={sections.length <= 1}
                                        className="cursor-pointer"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'none',
                                            border: '1px solid #333',
                                            color: '#555',
                                            opacity: sections.length <= 1 ? 0.3 : 1,
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={e => { if (sections.length > 1) { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; } }}
                                        onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                                    >
                                        <Trash2 style={{ width: '12px', height: '12px' }} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={section.heading}
                                    onChange={(e) => updateSection(index, 'heading', e.target.value)}
                                    placeholder="SECTION HEADING"
                                    style={inputStyle}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ ...labelStyle, marginBottom: '4px' }}>
                                        <AlignLeft style={{ width: '10px', height: '10px' }} />
                                        CONTENT
                                    </label>
                                    <RichTextEditor
                                        content={section.content || ''}
                                        onChange={(html) => updateSectionContent(index, html)}
                                    />
                                </div>

                                {/* Images Manager */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                                    <label style={{ ...labelStyle, marginBottom: '4px' }}>
                                        <ImagePlus style={{ width: '10px', height: '10px' }} />
                                        IMAGES
                                        {(section.images?.length || 0) > 0 && (
                                            <span style={{ color: 'var(--neon-cyan)' }}>[ {section.images!.length} ]</span>
                                        )}
                                    </label>

                                    {(section.images || []).map((imgUrl, imgIdx) => (
                                        <div key={imgIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <input
                                                type="url"
                                                value={imgUrl}
                                                onChange={(e) => updateImageInSection(index, imgIdx, e.target.value)}
                                                placeholder={`IMAGE URL ${imgIdx + 1}`}
                                                style={{ ...inputStyle, flex: 1 }}
                                                onFocus={handleInputFocus}
                                                onBlur={handleInputBlur}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImageFromSection(index, imgIdx)}
                                                className="cursor-pointer"
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'none',
                                                    border: '1px solid #333',
                                                    color: '#555',
                                                    flexShrink: 0,
                                                    transition: 'all 0.3s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                                            >
                                                <X style={{ width: '12px', height: '12px' }} />
                                            </button>
                                        </div>
                                    ))}

                                    <input
                                        ref={sectionImageFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleSectionImageFileChange}
                                    />

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button
                                            type="button"
                                            onClick={() => addImageToSection(index)}
                                            className="cursor-pointer"
                                            style={{
                                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                                color: '#555', background: 'none', border: '1px dashed #333',
                                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }}
                                        >
                                            <Plus style={{ width: '10px', height: '10px' }} />
                                            ADD IMAGE
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setSectionUploadingIndex(index); sectionImageFileInputRef.current?.click(); }}
                                            disabled={sectionImageUploading === index}
                                            className="cursor-pointer"
                                            style={{
                                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                                color: 'var(--neon-cyan)', background: 'none', border: '1px solid #333',
                                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; }}
                                        >
                                            {sectionImageUploading === index ? <Loader style={{ width: '10px', height: '10px' }} className="animate-spin" /> : <UploadCloud style={{ width: '10px', height: '10px' }} />}
                                            BILGISAYARDAN YÜKLE
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openR2ForSection(index)}
                                            className="cursor-pointer"
                                            style={{
                                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                                color: '#aaa', background: 'none', border: '1px solid #333',
                                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa'; }}
                                        >
                                            <ImagePlus style={{ width: '10px', height: '10px' }} />
                                            STORAGE MEDIA
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setDriveImportIdx(driveImportIdx === index ? null : index); setDriveUrl(''); setDriveError(''); }}
                                            className="cursor-pointer"
                                            style={{
                                                ...FONT, fontSize: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                                                color: driveImportIdx === index ? 'var(--brand)' : '#555',
                                                background: 'none',
                                                border: `1px dashed ${driveImportIdx === index ? 'var(--brand)' : '#333'}`,
                                                padding: '6px 10px', letterSpacing: '0.1em', transition: 'all 0.3s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                                            onMouseLeave={e => { if (driveImportIdx !== index) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; } }}
                                        >
                                            <UploadCloud style={{ width: '10px', height: '10px' }} />
                                            IMPORT DRIVE
                                        </button>
                                    </div>

                                    {/* Drive import inline */}
                                    {driveImportIdx === index && (
                                        <div style={{ border: '1px solid var(--brand)', padding: '12px', backgroundColor: '#050505', marginTop: '6px' }}>
                                            <div style={{ display: 'flex', gap: '6px', marginBottom: driveError ? '8px' : '0' }}>
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
                                                    onClick={() => handleDriveImportForSection(index)}
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
                                                    {driveLoading ? <Loader style={{ width: '10px', height: '10px' }} className="animate-spin" /> : <UploadCloud style={{ width: '10px', height: '10px' }} />}
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
                    ))}
                </div>
            </div>

            {/* Preview */}
            {showPreview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        border: '1px solid var(--neon-cyan)',
                        padding: '24px',
                        backgroundColor: '#050505',
                        marginBottom: '16px',
                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--neon-cyan)' }} />
                        <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            PREVIEW
                        </h3>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,255,255,0.3), transparent)' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {city && <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>{city}, {country}</span>}
                        {categories.length > 0 && (
                            <>
                                <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                                {categories.map(cat => (
                                    <span key={cat} style={{ ...FONT, fontSize: '6px', color: '#000', backgroundColor: 'var(--neon-magenta)', padding: '3px 8px' }}>
                                        {cat}
                                    </span>
                                ))}
                            </>
                        )}
                        {date && (
                            <>
                                <div style={{ width: '4px', height: '4px', backgroundColor: '#555' }} />
                                <span style={{ ...FONT, fontSize: '7px', color: '#555' }}>{date}</span>
                            </>
                        )}
                    </div>

                    <h2 style={{ ...FONT, fontSize: '14px', color: '#fff', marginBottom: '16px', lineHeight: '2' }}>
                        {title || 'UNTITLED POST'}
                    </h2>

                    {sections.filter(s => s.heading || (s.contents || []).some(c => c.trim()) || s.content).map((section, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            {section.heading && (
                                <h3 style={{ ...FONT, fontSize: '10px', color: 'var(--brand)', marginBottom: '8px' }}>
                                    {'>'} {section.heading}
                                </h3>
                            )}
                            <div
                                style={{ fontFamily: getFontConfig(contentFont).family, fontSize: getFontConfig(contentFont).size, color: '#aaa', lineHeight: '2.4', marginBottom: '1em' }}
                                dangerouslySetInnerHTML={{ __html: section.content || '' }}
                            />
                            {(section.images || []).filter(Boolean).map((img, imgI) => (
                                <div key={imgI} style={{ marginTop: '12px', overflow: 'hidden', height: '140px', border: '1px solid #1a1a1a' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer"
                    style={{
                        ...FONT,
                        fontSize: '8px',
                        padding: '12px 20px',
                        background: 'none',
                        border: '1px solid #333',
                        color: '#555',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#888'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }}
                >
                    CANCEL
                </button>
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="cursor-pointer"
                    style={{
                        ...FONT,
                        fontSize: '8px',
                        padding: '12px 20px',
                        background: 'none',
                        border: '1px solid',
                        borderColor: showPreview ? 'var(--neon-cyan)' : '#333',
                        color: showPreview ? 'var(--neon-cyan)' : '#555',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s',
                        boxShadow: showPreview ? '0 0 8px rgba(0, 255, 255, 0.2)' : 'none',
                    }}
                    onMouseEnter={e => {
                        if (!showPreview) { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }
                    }}
                    onMouseLeave={e => {
                        if (!showPreview) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }
                    }}
                >
                    {showPreview ? 'HIDE PREVIEW' : 'PREVIEW'}
                </button>
                <button
                    type="submit"
                    disabled={!isValid}
                    className="cursor-pointer"
                    style={{
                        ...FONT,
                        fontSize: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: isValid ? 'var(--brand)' : '#1a1a1a',
                        color: isValid ? '#000' : '#444',
                        border: 'none',
                        padding: '12px 24px',
                        letterSpacing: '0.1em',
                        boxShadow: isValid ? '0 0 15px rgba(0, 255, 65, 0.3)' : 'none',
                        transition: 'all 0.3s',
                        cursor: isValid ? 'pointer' : 'not-allowed',
                    }}
                    onMouseEnter={e => { if (isValid) e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 65, 0.5)'; }}
                    onMouseLeave={e => { if (isValid) e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.3)'; }}
                >
                    <Save style={{ width: '14px', height: '14px' }} />
                    {isEditing ? 'UPDATE' : 'PUBLISH'}
                </button>
            </div>
        </form>
    );
}
