import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, ChevronUp, ChevronDown, Type } from 'lucide-react';
import { useBlogStore } from '../../store/store';
import type { BlogPost, Section } from '../../types';
import { countryBounds } from '../../data/countryBounds';
import { worldCities } from '../../data/worldCities';
import { fetchCityBoundary } from '../../lib/cityBoundaryCache';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

const inputStyle: React.CSSProperties = {
    ...font,
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
    ...font,
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

const emptySection: Section = { heading: '', content: '', image: '' };



export default function PostForm({ post, onSave, onCancel }: PostFormProps) {
    const { addPost, updatePost } = useBlogStore();

    const [title, setTitle] = useState(post?.title || '');
    const [country, setCountry] = useState(post?.country || '');
    const [city, setCity] = useState(post?.city || '');
    const [date, setDate] = useState(post?.date || '');
    const [coverImage, setCoverImage] = useState(post?.coverImage || '');
    const [categories, setCategories] = useState<string[]>(post?.category || []);
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [sections, setSections] = useState<Section[]>(
        post?.sections?.length ? post.sections : [{ ...emptySection }]
    );

    const isEditing = post !== null;

    const availableCategories = ['5 Min Read', 'Food & Drink', 'City Break', 'Coastal', 'Art', 'Culture', 'Adventure', 'Nature', 'History', 'Nightlife'];

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

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;
        const updated = [...sections];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setSections(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const cleanSections = sections
            .filter(s => s.heading.trim() || s.content.trim())
            .map(s => ({
                heading: s.heading.trim(),
                content: s.content.trim(),
                ...(s.image?.trim() ? { image: s.image.trim() } : {}),
            }));

        // Fetch city boundary from Nominatim
        let cityBoundary: GeoJSON.Geometry | undefined = post?.cityBoundary;
        const cityTrimmed = city.trim();
        const countryTrimmed = country.trim();

        // Only fetch if city/country changed or no boundary exists yet
        if (!cityBoundary || post?.city !== cityTrimmed || post?.country !== countryTrimmed) {
            try {
                const feature = await fetchCityBoundary(cityTrimmed, countryTrimmed);
                if (feature) {
                    cityBoundary = feature.geometry;
                }
            } catch (err) {
                console.error('Failed to fetch city boundary:', err);
            }
        }

        const postData: BlogPost = {
            id: post?.id || `post-${Date.now()}`,
            title: title.trim(),
            country: countryTrimmed,
            city: cityTrimmed,
            coordinates: getCoordinates(),
            coverImage,
            date: date.trim(),
            category: categories,
            sections: cleanSections,
            ...(cityBoundary ? { cityBoundary } : {}),
        };

        if (isEditing) {
            updatePost(post.id, postData);
        } else {
            addPost(postData);
        }

        setSaving(false);
        onSave();
    };

    const isValid = title.trim() && country.trim() && city.trim() && sections.some(s => s.heading.trim() && s.content.trim());

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
                    <h2 style={{ ...font, fontSize: '12px', color: '#fff' }}>
                        {isEditing ? 'EDIT POST' : 'NEW POST'}
                    </h2>
                    <p style={{ ...font, fontSize: '6px', color: '#555', marginTop: '6px', letterSpacing: '0.15em' }}>
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

            {/* Basic Info */}
            <div style={{
                border: '1px solid #1a1a1a',
                padding: '24px',
                backgroundColor: '#050505',
                marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <Type style={{ width: '12px', height: '12px', color: 'var(--brand)' }} />
                    <h3 style={{ ...font, fontSize: '8px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
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
                                            ...font,
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

                    {/* Cover Image URL */}
                    <div>
                        <label style={labelStyle}>COVER IMAGE URL</label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="HTTPS://... IMAGE URL"
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
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
                                <span style={{ ...font, fontSize: '6px', position: 'absolute', bottom: '8px', left: '10px', color: 'var(--brand)', letterSpacing: '0.1em' }}>
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
                        <h3 style={{ ...font, fontSize: '8px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            CONTENT SECTIONS
                        </h3>
                        <span style={{ ...font, fontSize: '7px', color: 'var(--neon-cyan)' }}>
                            [ {sections.length} ]
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={addSection}
                        className="cursor-pointer"
                        style={{
                            ...font,
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
                                <span style={{ ...font, fontSize: '7px', color: 'var(--brand)' }}>
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
                                <textarea
                                    value={section.content}
                                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                                    placeholder="WRITE YOUR STORY HERE..."
                                    rows={4}
                                    style={{
                                        ...inputStyle,
                                        resize: 'vertical',
                                        lineHeight: '2.2',
                                    }}
                                    onFocus={handleInputFocus as any}
                                    onBlur={handleInputBlur as any}
                                />
                                <input
                                    type="url"
                                    value={section.image || ''}
                                    onChange={(e) => updateSection(index, 'image', e.target.value)}
                                    placeholder="IMAGE URL (OPTIONAL)"
                                    style={inputStyle}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
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
                        <h3 style={{ ...font, fontSize: '8px', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            PREVIEW
                        </h3>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,255,255,0.3), transparent)' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {city && <span style={{ ...font, fontSize: '7px', color: 'var(--neon-cyan)' }}>{city}, {country}</span>}
                        {categories.length > 0 && (
                            <>
                                <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                                {categories.map(cat => (
                                    <span key={cat} style={{ ...font, fontSize: '6px', color: '#000', backgroundColor: 'var(--neon-magenta)', padding: '3px 8px' }}>
                                        {cat}
                                    </span>
                                ))}
                            </>
                        )}
                        {date && (
                            <>
                                <div style={{ width: '4px', height: '4px', backgroundColor: '#555' }} />
                                <span style={{ ...font, fontSize: '7px', color: '#555' }}>{date}</span>
                            </>
                        )}
                    </div>

                    <h2 style={{ ...font, fontSize: '14px', color: '#fff', marginBottom: '16px', lineHeight: '2' }}>
                        {title || 'UNTITLED POST'}
                    </h2>

                    {sections.filter(s => s.heading || s.content).map((section, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            {section.heading && (
                                <h3 style={{ ...font, fontSize: '10px', color: 'var(--brand)', marginBottom: '8px' }}>
                                    {'>'} {section.heading}
                                </h3>
                            )}
                            {section.content && (
                                <p style={{ ...font, fontSize: '8px', color: '#aaa', lineHeight: '2.4' }}>
                                    {section.content}
                                </p>
                            )}
                            {section.image && (
                                <div style={{ marginTop: '12px', overflow: 'hidden', height: '140px', border: '1px solid #1a1a1a' }}>
                                    <img src={section.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
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
                        ...font,
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
                        ...font,
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
                    disabled={!isValid || saving}
                    className="cursor-pointer"
                    style={{
                        ...font,
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
