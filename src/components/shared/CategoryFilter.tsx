import { FONT, CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
    activeCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
                onClick={() => onCategoryChange(null)}
                className="cursor-pointer"
                style={{
                    ...FONT,
                    fontSize: '8px',
                    padding: '8px 16px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    border: '2px solid',
                    borderColor: !activeCategory ? 'var(--brand)' : '#444',
                    backgroundColor: !activeCategory ? 'var(--brand)' : 'transparent',
                    color: !activeCategory ? '#000' : '#888',
                    boxShadow: !activeCategory ? '0 0 12px rgba(0, 255, 65, 0.4)' : 'none',
                    transition: 'all 0.3s',
                }}
            >
                ALL
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
                    className="cursor-pointer"
                    style={{
                        ...FONT,
                        fontSize: '8px',
                        padding: '8px 16px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        border: '2px solid',
                        borderColor: activeCategory === cat ? 'var(--neon-magenta)' : '#444',
                        backgroundColor: activeCategory === cat ? 'var(--neon-magenta)' : 'transparent',
                        color: activeCategory === cat ? '#000' : '#888',
                        boxShadow: activeCategory === cat ? '0 0 12px rgba(255, 0, 228, 0.4)' : 'none',
                        transition: 'all 0.3s',
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
