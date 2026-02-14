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
