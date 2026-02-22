import { useState, useMemo, useRef } from 'react';
import { X, Plus, Type, ImagePlus, UploadCloud, Loader } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { BlogPost, Section } from '@/types';
import { CONTENT_FONTS, getFontConfig } from '@/types';
import { countryBounds } from '@/data/countryBounds';
import { worldCities } from '@/data/worldCities';
import { fetchCityBoundary } from '@/lib/cityBoundaryCache';
import { mergePostFields } from '@/lib/firestore';
import { uploadImageToR2 } from '@/lib/r2Api';
import R2MediaBrowser from './R2MediaBrowser';
import PostFormSectionEditor from './PostFormSectionEditor';
import PostFormPreview from './PostFormPreview';
import PostFormActions from './PostFormActions';
import { usePostDraft } from '@/hooks/usePostDraft';
import { FONT, CATEGORIES } from '@/lib/constants';
import { inputStyle, labelStyle, handleInputFocus, handleInputBlur } from '@/lib/adminStyles';

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

    // --- Drafts ---
    const { draftFound, restoreDraft, discardDraft, clearDraft } = usePostDraft(isEditing, {
        title, country, city, date, coverImage, categories, contentFont, sections,
    });

    const handleRestoreDraft = () => {
        const data = restoreDraft();
        if (!data) return;
        setTitle(data.title || '');
        setCountry(data.country || '');
        setCity(data.city || '');
        setDate(data.date || '');
        setCoverImage(data.coverImage || '');
        setCategories(data.categories || []);
        setContentFont(data.contentFont || 'Press Start 2P');
        setSections(data.sections || [{ ...emptySection }]);
    };

    // --- Cover image upload ---
    const coverFileInputRef = useRef<HTMLInputElement>(null);
    const [coverUploading, setCoverUploading] = useState(false);
    const [r2CoverOpen, setR2CoverOpen] = useState(false);

    const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
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
            alert(`Upload failed: ${err instanceof Error ? err.message : 'Upload failed'}`);
        } finally {
            setCoverUploading(false);
            e.target.value = '';
        }
    };

    // --- Categories ---
    const toggleCategory = (cat: string) => {
        setCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    // --- City/Country ---
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

    // --- Sections ---
    const addSection = () => setSections([...sections, { ...emptySection }]);
    const removeSection = (index: number) => { if (sections.length > 1) setSections(sections.filter((_, i) => i !== index)); };
    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;
        const updated = [...sections];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setSections(updated);
    };
    const updateSectionHeading = (index: number, heading: string) => {
        setSections(prev => prev.map((s, i) => i === index ? { ...s, heading } : s));
    };
    const updateSectionContent = (index: number, html: string) => {
        setSections(prev => prev.map((s, i) => i === index ? { ...s, content: html } : s));
    };
    const addImageToSection = (index: number) => {
        setSections(prev => prev.map((s, i) => i === index ? { ...s, images: [...(s.images || []), ''] } : s));
    };
    const updateImageInSection = (index: number, imgIndex: number, value: string) => {
        setSections(prev => prev.map((s, i) => {
            if (i !== index) return s;
            const imgs = [...(s.images || [])];
            imgs[imgIndex] = value;
            return { ...s, images: imgs };
        }));
    };
    const removeImageFromSection = (index: number, imgIndex: number) => {
        setSections(prev => prev.map((s, i) => {
            if (i !== index) return s;
            return { ...s, images: (s.images || []).filter((_, j) => j !== imgIndex) };
        }));
    };
    const addImagesToSection = (index: number, urls: string[]) => {
        setSections(prev => prev.map((s, i) => {
            if (i !== index) return s;
            return { ...s, images: Array.from(new Set([...(s.images || []), ...urls])) };
        }));
    };

    // --- Submit ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanSections = sections
            .filter(s => s.heading.trim() || (s.contents || []).some(c => c.trim()))
            .map(s => {
                const imgs = (s.images || []).map(u => u.trim()).filter(Boolean);
                return {
                    heading: s.heading.trim(),
                    content: s.content || '',
                    contents: [],
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

        if (isEditing) {
            updatePost(post.id, postData);
        } else {
            addPost(postData);
        }

        onSave();

        // Fetch boundary in background
        const postId = postData.id;
        fetchCityBoundary(cityTrimmed, countryTrimmed)
            .then(async (feature) => {
                if (!feature?.geometry) return;
                await mergePostFields(postId, { cityBoundary: feature.geometry });
                useBlogStore.setState((state) => ({
                    posts: state.posts.map((p) =>
                        p.id === postId ? { ...p, cityBoundary: feature.geometry } : p
                    ),
                }));
            })
            .catch(err => console.error('[Boundary] Failed:', err));

        if (!isEditing) clearDraft();
    };

    const isValid = title.trim() && country.trim() && city.trim() && sections.some(s => s.heading.trim() && s.content?.trim());

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '768px', margin: '0 auto' }}>
            {/* Header */}
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
                    style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '8px', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                >
                    <X style={{ width: '16px', height: '16px' }} />
                </button>
            </div>

            {/* Draft Banner */}
            {draftFound && (
                <div style={{
                    backgroundColor: '#1a1a00', border: '1px solid var(--neon-amber)',
                    padding: '12px', marginBottom: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader style={{ color: 'var(--neon-amber)', width: '16px', height: '16px' }} />
                        <span style={{ ...FONT, fontSize: '8px', color: 'var(--neon-amber)' }}>UNSAVED DRAFT FOUND</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={handleRestoreDraft} className="cursor-pointer"
                            style={{ ...FONT, fontSize: '8px', padding: '6px 12px', backgroundColor: 'var(--neon-amber)', color: '#000', border: 'none' }}>
                            RESTORE
                        </button>
                        <button type="button" onClick={discardDraft} className="cursor-pointer"
                            style={{ ...FONT, fontSize: '8px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--neon-amber)', color: 'var(--neon-amber)' }}>
                            DISCARD
                        </button>
                    </div>
                </div>
            )}

            {/* Basic Info */}
            <div style={{ border: '1px solid #1a1a1a', padding: '24px', backgroundColor: '#050505', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <Type style={{ width: '12px', height: '12px', color: 'var(--brand)' }} />
                    <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        BASIC INFO
                    </h3>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #333, transparent)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Title */}
                    <div>
                        <label style={labelStyle}>TITLE</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="ENTER POST TITLE..." style={inputStyle}
                            onFocus={handleInputFocus} onBlur={handleInputBlur} required />
                    </div>

                    {/* Country / City */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>COUNTRY</label>
                            <select value={country} onChange={e => { setCountry(e.target.value); setCity(''); }}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                onFocus={handleInputFocus} onBlur={handleInputBlur} required>
                                <option value="">SELECT...</option>
                                {countryBounds.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>CITY</label>
                            <select value={city} onChange={e => setCity(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', opacity: country ? 1 : 0.4 }}
                                onFocus={handleInputFocus} onBlur={handleInputBlur} required disabled={!country}>
                                <option value="">{country ? 'SELECT CITY...' : 'SELECT COUNTRY FIRST'}</option>
                                {citiesForCountry.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label style={labelStyle}>
                            CATEGORIES
                            {categories.length > 0 && <span style={{ color: 'var(--neon-cyan)' }}>[ {categories.length} ]</span>}
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {CATEGORIES.map(cat => {
                                const isActive = categories.includes(cat);
                                return (
                                    <button key={cat} type="button" onClick={() => toggleCategory(cat)} className="cursor-pointer"
                                        style={{
                                            ...FONT, fontSize: '7px', padding: '8px 14px', letterSpacing: '0.1em', textTransform: 'uppercase',
                                            border: '1px solid', borderColor: isActive ? 'var(--neon-magenta)' : '#333',
                                            backgroundColor: isActive ? 'var(--neon-magenta)' : 'transparent',
                                            color: isActive ? '#000' : '#666',
                                            boxShadow: isActive ? '0 0 10px rgba(255, 0, 228, 0.3)' : 'none',
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#aaa'; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666'; } }}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label style={labelStyle}>DATE</label>
                        <input type="text" value={date} onChange={e => setDate(e.target.value)}
                            placeholder="E.G. MARCH 2024" style={inputStyle}
                            onFocus={handleInputFocus} onBlur={handleInputBlur} />
                    </div>

                    {/* Content Font */}
                    <div>
                        <label style={labelStyle}>CONTENT FONT</label>
                        <select value={contentFont} onChange={e => setContentFont(e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                            onFocus={handleInputFocus} onBlur={handleInputBlur}>
                            {CONTENT_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                        <div style={{ marginTop: '10px', padding: '14px', border: '1px solid #1a1a1a', backgroundColor: '#080808' }}>
                            <span style={{ fontFamily: getFontConfig(contentFont).family, fontSize: getFontConfig(contentFont).size, color: '#aaa', lineHeight: '2.2' }}>
                                The quick brown fox jumps over the lazy dog.
                            </span>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label style={labelStyle}>COVER IMAGE URL</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)}
                                placeholder="HTTPS://... VEYA BILGISAYARDAN YÜKLE"
                                style={{ ...inputStyle, flex: '1 1 200px' }}
                                onFocus={handleInputFocus} onBlur={handleInputBlur} />
                            <input ref={coverFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverFileChange} />
                            <button type="button" onClick={() => coverFileInputRef.current?.click()} disabled={coverUploading} className="cursor-pointer"
                                style={{
                                    ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 14px', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)',
                                    background: 'none', letterSpacing: '0.1em', transition: 'all 0.3s', flexShrink: 0,
                                }}>
                                {coverUploading ? <Loader style={{ width: '12px', height: '12px' }} className="animate-spin" /> : <UploadCloud style={{ width: '12px', height: '12px' }} />}
                                {coverUploading ? 'YÜKLENİYOR...' : 'BILGISAYARDAN YÜKLE'}
                            </button>
                            <button type="button" onClick={() => setR2CoverOpen(true)} className="cursor-pointer"
                                style={{
                                    ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 14px', border: '1px solid #333', color: '#aaa',
                                    background: 'none', letterSpacing: '0.1em', transition: 'all 0.3s', flexShrink: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa'; }}>
                                <ImagePlus style={{ width: '12px', height: '12px' }} />
                                R2 MEDIA
                            </button>
                        </div>

                        {r2CoverOpen && (
                            <div style={{ marginTop: '10px' }}>
                                <R2MediaBrowser
                                    onClose={() => setR2CoverOpen(false)}
                                    onSelect={(urls) => { setCoverImage(urls[0]); setR2CoverOpen(false); }}
                                />
                            </div>
                        )}
                        {coverImage && (
                            <div style={{ marginTop: '10px', border: '1px solid var(--brand)', overflow: 'hidden', position: 'relative', height: '140px' }}>
                                <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(0.85)' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                                <span style={{ ...FONT, fontSize: '6px', position: 'absolute', bottom: '8px', left: '10px', color: 'var(--brand)', letterSpacing: '0.1em' }}>PREVIEW</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div style={{ border: '1px solid #1a1a1a', padding: '24px', backgroundColor: '#050505', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            CONTENT SECTIONS
                        </h3>
                        <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>[ {sections.length} ]</span>
                    </div>
                    <button type="button" onClick={addSection} className="cursor-pointer"
                        style={{
                            ...FONT, fontSize: '7px', display: 'flex', alignItems: 'center', gap: '6px',
                            color: 'var(--brand)', background: 'none', border: '1px solid var(--brand)',
                            padding: '8px 12px', letterSpacing: '0.1em', transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--brand)'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--brand)'; }}>
                        <Plus style={{ width: '12px', height: '12px' }} />
                        ADD
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sections.map((section, index) => (
                        <PostFormSectionEditor
                            key={index}
                            section={section}
                            index={index}
                            totalSections={sections.length}
                            onUpdateHeading={(heading) => updateSectionHeading(index, heading)}
                            onUpdateContent={(html) => updateSectionContent(index, html)}
                            onRemove={() => removeSection(index)}
                            onMoveUp={() => moveSection(index, 'up')}
                            onMoveDown={() => moveSection(index, 'down')}
                            onAddImage={() => addImageToSection(index)}
                            onUpdateImage={(imgIdx, val) => updateImageInSection(index, imgIdx, val)}
                            onRemoveImage={(imgIdx) => removeImageFromSection(index, imgIdx)}
                            onAddImages={(urls) => addImagesToSection(index, urls)}
                        />
                    ))}
                </div>
            </div>

            {/* Preview */}
            {showPreview && (
                <PostFormPreview
                    title={title} city={city} country={country}
                    date={date} categories={categories}
                    contentFont={contentFont} sections={sections}
                />
            )}

            {/* Actions */}
            <PostFormActions
                isValid={!!isValid}
                isEditing={isEditing}
                showPreview={showPreview}
                onCancel={onCancel}
                onTogglePreview={() => setShowPreview(!showPreview)}
            />
        </form>
    );
}
