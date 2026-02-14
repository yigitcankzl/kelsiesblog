export interface Section {
    heading: string;
    content: string;
    image?: string;
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

export interface AboutContent {
    name: string;
    bio1: string;
    bio2: string;
    quests: { title: string; desc: string }[];
    socials: SocialLink[];
}
