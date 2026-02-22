import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Save } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { getCountryDescription } from '@/data/countryDescriptions';
import { FONT } from '@/lib/constants';
import { labelStyle, textareaStyle } from '@/lib/adminStyles';

export default function CountryOverviewManager() {
    const { getCountriesWithPosts, countryOverviews, updateCountryOverview } = useBlogStore();
    const countries = getCountriesWithPosts().sort();

    const [selectedCountry, setSelectedCountry] = useState<string | ''>(countries[0] ?? '');
    const [text, setText] = useState<string>(() => {
        const initial = countries[0];
        if (!initial) return '';
        return countryOverviews[initial] ?? getCountryDescription(initial) ?? '';
    });
    const [saved, setSaved] = useState(false);

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
        if (!country) {
            setText('');
            return;
        }
        const existing = countryOverviews[country];
        setText(existing ?? getCountryDescription(country) ?? '');
    };

    const handleSave = () => {
        if (!selectedCountry) return;
        updateCountryOverview(selectedCountry, text.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Globe2 className="w-4 h-4 text-[var(--neon-cyan)]" />
                    <div>
                        <h2 style={{ ...FONT, fontSize: '11px', color: '#fff' }}>COUNTRY OVERVIEWS</h2>
                        <p style={{ ...FONT, fontSize: '6px', color: '#555', marginTop: '4px', letterSpacing: '0.15em' }}>
                            SHORT DESCRIPTIONS ABOVE STORIES
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="border border-[#1a1a1a] p-6 mb-6">
                    <h3 style={{ ...FONT, fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '24px' }}>
                        {'>'} OVERVIEW EDITOR
                    </h3>

                    {/* Country selector */}
                    <div className="mb-5">
                        <label style={labelStyle}>Select Country</label>
                        <select
                            value={selectedCountry}
                            onChange={e => handleCountryChange(e.target.value)}
                            className="cursor-pointer"
                            style={{
                                ...FONT,
                                fontSize: '9px',
                                width: '100%',
                                padding: '10px 14px',
                                backgroundColor: '#050505',
                                border: '1px solid #222',
                                color: '#ddd',
                                outline: 'none',
                            }}
                        >
                            {countries.length === 0 && (
                                <option value="">No countries with stories yet</option>
                            )}
                            {countries.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Overview textarea */}
                    <div className="mb-4">
                        <label style={labelStyle}>Overview Text</label>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Write a short, vivid overview for this country..."
                            style={textareaStyle}
                        />
                        <p style={{ ...FONT, fontSize: '6px', color: '#555', marginTop: '8px', letterSpacing: '0.12em', lineHeight: '1.8' }}>
                            This text appears above the stories grid when a visitor clicks on a country on the map.
                        </p>
                    </div>

                    {/* Save button */}
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={handleSave}
                            className="cursor-pointer"
                            style={{
                                ...FONT,
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
                            SAVE OVERVIEW
                        </button>
                        {saved && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                style={{ ...FONT, fontSize: '7px', color: 'var(--brand)' }}
                            >
                                ✓ SAVED
                            </motion.span>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

