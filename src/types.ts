export interface Section {
    heading: string;
    content: string;        // legacy — kept for backward compat with old Firestore docs
    contents?: string[];    // new multi-paragraph support
    image?: string;         // legacy — kept for backward compat with old Firestore docs
    images?: string[];
}

/** Resolve contents: prefer `contents[]`, fall back to `content` string. */
export function resolveContents(s: Section): string[] {
    if (s.contents?.length) return s.contents;
    if (s.content) return [s.content];
    return [];
}

export interface BlogPost {
    id: string;
    title: string;
    country: string;
    city: string;
    coordinates: [number, number];
    coverImage: string;
    date: string;
    category: string[];
    contentFont?: string;
    sections: Section[];
    cityBoundary?: GeoJSON.Geometry;
}

/** Available fonts for post content text. */
export const CONTENT_FONTS = [
    { value: 'Press Start 2P',   label: 'PRESS START 2P',   family: "'Press Start 2P', monospace",   size: '11px' },
    { value: 'VT323',            label: 'VT323',             family: "'VT323', monospace",            size: '18px' },
    { value: 'Space Mono',       label: 'SPACE MONO',        family: "'Space Mono', monospace",       size: '15px' },
    { value: 'IBM Plex Mono',    label: 'IBM PLEX MONO',     family: "'IBM Plex Mono', monospace",    size: '15px' },
    { value: 'JetBrains Mono',   label: 'JETBRAINS MONO',    family: "'JetBrains Mono', monospace",   size: '15px' },
    { value: 'Courier Prime',    label: 'COURIER PRIME',     family: "'Courier Prime', monospace",    size: '16px' },
    { value: 'Share Tech Mono',  label: 'SHARE TECH MONO',   family: "'Share Tech Mono', monospace",  size: '16px' },
    { value: 'Fira Code',        label: 'FIRA CODE',         family: "'Fira Code', monospace",        size: '15px' },
] as const;

export function getFontConfig(fontValue?: string) {
    return CONTENT_FONTS.find(f => f.value === fontValue) ?? CONTENT_FONTS[0];
}

export interface CountryData {
    name: string;
    hasPosts: boolean;
    bounds?: [[number, number], [number, number]];
}

export interface GalleryItem {
    id: string;
    src: string;
    caption: string;
    city: string;
    country: string;
}

export interface SocialLink {
    label: string;
    url: string;
    icon: string;
}

/** Average reading speed: ~200 words per minute. Returns at least 1. */
export function estimateReadTime(sections: Section[]): number {
    const words = sections.reduce(
        (sum, s) => {
            const texts = resolveContents(s);
            const contentWords = texts.reduce((a, t) => a + t.split(/\s+/).length, 0);
            return sum + s.heading.split(/\s+/).length + contentWords;
        },
        0
    );
    return Math.max(1, Math.round(words / 200));
}

export interface AboutContent {
    name: string;
    bio1: string;
    bio2: string;
    quests: { title: string; desc: string }[];
    socials: SocialLink[];
}
