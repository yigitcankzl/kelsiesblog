import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Plus, Trash2 } from 'lucide-react';
import { useBlogStore } from '../../store/store';

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

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical' as const,
    lineHeight: '2.2',
};

export default function AboutManager() {
    const { aboutContent, updateAboutContent } = useBlogStore();
    const [form, setForm] = useState({ ...aboutContent });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateAboutContent(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const updateQuest = (index: number, field: 'title' | 'desc', value: string) => {
        const newQuests = [...form.quests];
        newQuests[index] = { ...newQuests[index], [field]: value };
        setForm({ ...form, quests: newQuests });
    };

    const addQuest = () => {
        setForm({ ...form, quests: [...form.quests, { title: '', desc: '' }] });
    };

    const removeQuest = (index: number) => {
        setForm({ ...form, quests: form.quests.filter((_, i) => i !== index) });
    };

    const updateSocial = (index: number, field: 'label' | 'url' | 'icon', value: string) => {
        const newSocials = [...form.socials];
        newSocials[index] = { ...newSocials[index], [field]: value };
        setForm({ ...form, socials: newSocials });
    };

    const addSocial = () => {
        setForm({ ...form, socials: [...form.socials, { label: '', url: '', icon: '' }] });
    };

    const removeSocial = (index: number) => {
        setForm({ ...form, socials: form.socials.filter((_, i) => i !== index) });
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User className="w-4 h-4" style={{ color: 'var(--neon-cyan)' }} />
                    <div>
                        <h2 style={{ ...font, fontSize: '11px', color: '#fff' }}>ABOUT ME</h2>
                        <p style={{ ...font, fontSize: '6px', color: '#555', marginTop: '4px', letterSpacing: '0.15em' }}>
                            EDIT YOUR PROFILE
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div style={{ border: '1px solid #1a1a1a', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ ...font, fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '24px' }}>
                        {'>'} PROFILE INFO
                    </h3>

                    {/* Name */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Display Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Your name..."
                            style={inputStyle}
                        />
                    </div>

                    {/* Bio paragraph 1 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Bio - Paragraph 1</label>
                        <textarea
                            value={form.bio1}
                            onChange={e => setForm({ ...form, bio1: e.target.value })}
                            placeholder="First paragraph of your bio..."
                            style={textareaStyle}
                        />
                    </div>

                    {/* Bio paragraph 2 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Bio - Paragraph 2</label>
                        <textarea
                            value={form.bio2}
                            onChange={e => setForm({ ...form, bio2: e.target.value })}
                            placeholder="Second paragraph of your bio..."
                            style={textareaStyle}
                        />
                    </div>
                </div>

                {/* Quests / Interests */}
                <div style={{ border: '1px solid #1a1a1a', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ ...font, fontSize: '9px', color: 'var(--neon-cyan)' }}>
                            {'>'} QUEST LOG
                        </h3>
                        <button
                            onClick={addQuest}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'transparent',
                                border: '1px solid #333',
                                color: 'var(--neon-cyan)',
                                padding: '8px 12px',
                                transition: 'all 0.3s',
                            }}
                        >
                            <Plus className="w-3 h-3" />
                            ADD
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {form.quests.map((quest, index) => (
                            <div key={index} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr auto',
                                gap: '12px',
                                alignItems: 'start',
                                padding: '12px',
                                borderLeft: '2px solid var(--brand)',
                                backgroundColor: '#0a0a0a',
                            }}>
                                <div>
                                    <label style={labelStyle}>Title</label>
                                    <input
                                        type="text"
                                        value={quest.title}
                                        onChange={e => updateQuest(index, 'title', e.target.value)}
                                        placeholder="e.g. 📷 Photography"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <input
                                        type="text"
                                        value={quest.desc}
                                        onChange={e => updateQuest(index, 'desc', e.target.value)}
                                        placeholder="Short description..."
                                        style={inputStyle}
                                    />
                                </div>
                                <button
                                    onClick={() => removeQuest(index)}
                                    className="cursor-pointer"
                                    style={{
                                        ...font,
                                        fontSize: '6px',
                                        background: 'none',
                                        border: '1px solid #333',
                                        color: 'var(--neon-magenta)',
                                        padding: '8px',
                                        marginTop: '20px',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links */}
                <div style={{ border: '1px solid #1a1a1a', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ ...font, fontSize: '9px', color: 'var(--neon-cyan)' }}>
                            {'>'} SOCIAL LINKS
                        </h3>
                        <button
                            onClick={addSocial}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'transparent',
                                border: '1px solid #333',
                                color: 'var(--neon-cyan)',
                                padding: '8px 12px',
                                transition: 'all 0.3s',
                            }}
                        >
                            <Plus className="w-3 h-3" />
                            ADD
                        </button>
                    </div>

                    <p style={{ ...font, fontSize: '6px', color: '#555', marginBottom: '16px', letterSpacing: '0.12em', lineHeight: '1.8' }}>
                        ICON OPTIONS: instagram, twitter, mail, github, linkedin, youtube
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {form.socials.map((social, index) => (
                            <div key={index} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr 1fr auto',
                                gap: '12px',
                                alignItems: 'start',
                                padding: '12px',
                                borderLeft: '2px solid var(--neon-magenta, #ff0080)',
                                backgroundColor: '#0a0a0a',
                            }}>
                                <div>
                                    <label style={labelStyle}>Label</label>
                                    <input
                                        type="text"
                                        value={social.label}
                                        onChange={e => updateSocial(index, 'label', e.target.value)}
                                        placeholder="e.g. Instagram"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>URL</label>
                                    <input
                                        type="text"
                                        value={social.url}
                                        onChange={e => updateSocial(index, 'url', e.target.value)}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Icon</label>
                                    <input
                                        type="text"
                                        value={social.icon}
                                        onChange={e => updateSocial(index, 'icon', e.target.value)}
                                        placeholder="instagram"
                                        style={inputStyle}
                                    />
                                </div>
                                <button
                                    onClick={() => removeSocial(index)}
                                    className="cursor-pointer"
                                    style={{
                                        ...font,
                                        fontSize: '6px',
                                        background: 'none',
                                        border: '1px solid #333',
                                        color: 'var(--neon-magenta)',
                                        padding: '8px',
                                        marginTop: '20px',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save button */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                            padding: '12px 20px',
                            letterSpacing: '0.1em',
                            boxShadow: '0 0 12px rgba(0, 255, 65, 0.3)',
                            transition: 'all 0.3s',
                        }}
                    >
                        <Save className="w-3 h-3" />
                        SAVE CHANGES
                    </button>
                    {saved && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ ...font, fontSize: '7px', color: 'var(--brand)' }}
                        >
                            ✓ SAVED
                        </motion.span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
