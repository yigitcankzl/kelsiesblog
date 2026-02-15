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
    sections: Section[];
    cityBoundary?: GeoJSON.Geometry;
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
