export interface Section {
    heading: string;
    content: string;
    image?: string;       // legacy — kept for backward compat with old Firestore docs
    images?: string[];
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
    { value: 'Press Start 2P',   label: 'PRESS START 2P',   family: "'Press Start 2P', monospace",   size: '9px' },
    { value: 'VT323',            label: 'VT323',             family: "'VT323', monospace",            size: '16px' },
    { value: 'Space Mono',       label: 'SPACE MONO',        family: "'Space Mono', monospace",       size: '13px' },
    { value: 'IBM Plex Mono',    label: 'IBM PLEX MONO',     family: "'IBM Plex Mono', monospace",    size: '13px' },
    { value: 'JetBrains Mono',   label: 'JETBRAINS MONO',    family: "'JetBrains Mono', monospace",   size: '13px' },
    { value: 'Courier Prime',    label: 'COURIER PRIME',     family: "'Courier Prime', monospace",    size: '14px' },
    { value: 'Share Tech Mono',  label: 'SHARE TECH MONO',   family: "'Share Tech Mono', monospace",  size: '14px' },
    { value: 'Fira Code',        label: 'FIRA CODE',         family: "'Fira Code', monospace",        size: '13px' },
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
        (sum, s) => sum + s.heading.split(/\s+/).length + s.content.split(/\s+/).length,
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
