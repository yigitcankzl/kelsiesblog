import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, ChevronUp, ChevronDown, Image, MapPin, Type } from 'lucide-react';
import { useBlogStore } from '../../store/store';
import type { BlogPost, Section } from '../../types';
import { countryBounds } from '../../data/countryBounds';

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
    const [lat, setLat] = useState(post?.coordinates[0]?.toString() || '');
    const [lng, setLng] = useState(post?.coordinates[1]?.toString() || '');
    const [coverImage, setCoverImage] = useState(post?.coverImage || '');
    const [date, setDate] = useState(post?.date || '');
    const [category, setCategory] = useState(post?.category || '');
    const [sections, setSections] = useState<Section[]>(
        post?.sections?.length ? post.sections : [{ ...emptySection }]
    );

    const isEditing = post !== null;

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanSections = sections
            .filter(s => s.heading.trim() || s.content.trim())
            .map(s => ({
                heading: s.heading.trim(),
                content: s.content.trim(),
                ...(s.image?.trim() ? { image: s.image.trim() } : {}),
            }));

        const postData: BlogPost = {
            id: post?.id || `post-${Date.now()}`,
            title: title.trim(),
            country: country.trim(),
            city: city.trim(),
            coordinates: [parseFloat(lat), parseFloat(lng)],
            coverImage: coverImage.trim(),
            date: date.trim(),
            category: category.trim(),
            sections: cleanSections,
        };

        if (isEditing) {
            updatePost(post.id, postData);
        } else {
            addPost(postData);
        }

        onSave();
    };

    const isValid = title.trim() && country.trim() && city.trim() && lat && lng && sections.some(s => s.heading.trim() && s.content.trim());

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
                                onChange={(e) => setCountry(e.target.value)}
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
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="E.G. KYOTO"
                                style={inputStyle}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                            <label style={labelStyle}>CATEGORY</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="E.G. CITY BREAK"
                                style={inputStyle}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>
                                <MapPin style={{ width: '10px', height: '10px' }} />
                                LATITUDE
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="35.0116"
                                style={inputStyle}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>
                                <MapPin style={{ width: '10px', height: '10px' }} />
                                LONGITUDE
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="135.7681"
                                style={inputStyle}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>
                            <Image style={{ width: '10px', height: '10px' }} />
                            COVER IMAGE URL
                        </label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="HTTPS://IMAGES.UNSPLASH.COM/..."
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                        {coverImage && (
                            <div style={{ marginTop: '12px', overflow: 'hidden', height: '120px', border: '1px solid #1a1a1a' }}>
                                <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.6) brightness(0.8)' }} />
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
                    type="submit"
                    disabled={!isValid}
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
