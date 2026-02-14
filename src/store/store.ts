import { create } from 'zustand';
import type { BlogPost, GalleryItem, AboutContent } from '../types';
import {
    fetchPosts,
    fetchGalleryItems,
    fetchAboutContent,
    addPostDoc,
    updatePostDoc,
    deletePostDoc,
    addGalleryDoc,
    updateGalleryDoc,
    deleteGalleryDoc,
    updateAboutDoc,
} from '../lib/firestore';

interface BlogStore {
    posts: BlogPost[];
    selectedCountry: string | null;
    selectedPost: BlogPost | null;
    activePage: 'map' | 'stories' | 'gallery' | 'about';
    galleryItems: GalleryItem[];
    aboutContent: AboutContent;
    isAuthenticated: boolean;
    loading: boolean;

    // Actions
    initializeData: () => Promise<void>;
    addPost: (post: BlogPost) => void;
    updatePost: (id: string, post: Partial<BlogPost>) => void;
    deletePost: (id: string) => void;
    setSelectedCountry: (country: string | null) => void;
    setSelectedPost: (post: BlogPost | null) => void;
    setActivePage: (page: 'map' | 'stories' | 'gallery' | 'about') => void;
    addGalleryItem: (item: GalleryItem) => void;
    updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
    deleteGalleryItem: (id: string) => void;
    updateAboutContent: (content: Partial<AboutContent>) => void;
    setAuthenticated: (value: boolean) => void;
    logout: () => void;

    // Derived
    getCountriesWithPosts: () => string[];
    getCitiesForCountry: (country: string) => { city: string; coordinates: [number, number]; hasPosts: boolean }[];
    getPostsForCity: (country: string, city: string) => BlogPost[];
    getCityBoundariesForCountry: (country: string) => { city: string; country: string; geometry: GeoJSON.Geometry }[];
}


const defaultAbout: AboutContent = {
    name: 'Kelsie',
    bio1: 'A traveler, photographer, and storyteller exploring the world one city at a time. This blog is my digital journal — a collection of moments, places, and the stories they hold.',
    bio2: 'Every destination is an adventure, every photo a memory frozen in time. I believe in slow travel, connecting with locals, and finding beauty in the unexpected.',
    quests: [
        { title: '📷 Photography', desc: 'Capturing authentic moments through the lens' },
        { title: '✍️ Storytelling', desc: 'Writing about cultures, people, and places' },
        { title: '🗺️ Exploration', desc: 'Seeking hidden gems off the beaten path' },
        { title: '🎒 Slow Travel', desc: 'Living like a local, not a tourist' },
    ],
    socials: [
        { label: 'Instagram', url: 'https://instagram.com/', icon: 'instagram' },
        { label: 'Twitter / X', url: 'https://x.com/', icon: 'twitter' },
        { label: 'Email', url: 'mailto:hello@example.com', icon: 'mail' },
    ],
};

export const useBlogStore = create<BlogStore>((set, get) => ({
    posts: [],
    selectedCountry: null,
    selectedPost: null,
    activePage: 'map',
    galleryItems: [],
    aboutContent: defaultAbout,
    isAuthenticated: false,
    loading: true,

    initializeData: async () => {
        try {
            const [posts, gallery, about] = await Promise.all([
                fetchPosts(),
                fetchGalleryItems(),
                fetchAboutContent(),
            ]);

            set({
                posts,
                galleryItems: gallery,
                aboutContent: about || defaultAbout,
                loading: false,
            });
        } catch (err) {
            console.error('Failed to load data from Firestore:', err);
            set({ loading: false });
        }
    },

    addPost: (post) => {
        set((state) => ({ posts: [...state.posts, post] }));
        addPostDoc(post).catch(console.error);
    },

    updatePost: (id, updates) => {
        set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        updatePostDoc(id, updates).catch(console.error);
    },

    deletePost: (id) => {
        set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
        }));
        deletePostDoc(id).catch(console.error);
    },

    setSelectedCountry: (country) => set({ selectedCountry: country, selectedPost: null }),

    setSelectedPost: (post) => set({ selectedPost: post }),

    setActivePage: (page) => set({ activePage: page, selectedPost: null, selectedCountry: null }),

    addGalleryItem: (item) => {
        set((state) => ({ galleryItems: [...state.galleryItems, item] }));
        addGalleryDoc(item).catch(console.error);
    },

    updateGalleryItem: (id, updates) => {
        set((state) => ({
            galleryItems: state.galleryItems.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }));
        updateGalleryDoc(id, updates).catch(console.error);
    },

    deleteGalleryItem: (id) => {
        set((state) => ({
            galleryItems: state.galleryItems.filter((g) => g.id !== id),
        }));
        deleteGalleryDoc(id).catch(console.error);
    },

    updateAboutContent: (updates) => {
        set((state) => ({
            aboutContent: { ...state.aboutContent, ...updates },
        }));
        const fullContent = { ...get().aboutContent, ...updates };
        updateAboutDoc(fullContent).catch(console.error);
    },

    setAuthenticated: (value) => set({ isAuthenticated: value }),

    logout: () => set({ isAuthenticated: false }),

    getCountriesWithPosts: () => {
        const countries = new Set(get().posts.map((p) => p.country));
        return Array.from(countries);
    },

    getCitiesForCountry: (country) => {
        const posts = get().posts.filter((p) => p.country === country);
        const cityMap = new Map<string, { coordinates: [number, number]; hasPosts: boolean }>();
        posts.forEach((p) => {
            cityMap.set(p.city, { coordinates: p.coordinates, hasPosts: true });
        });
        return Array.from(cityMap.entries()).map(([city, data]) => ({
            city,
            ...data,
        }));
    },

    getPostsForCity: (country, city) => {
        return get().posts.filter((p) => p.country === country && p.city === city);
    },

    getCityBoundariesForCountry: (country) => {
        const posts = get().posts.filter((p) => p.country === country && p.cityBoundary);
        // Deduplicate by city name — one boundary per city
        const cityMap = new Map<string, { city: string; country: string; geometry: GeoJSON.Geometry }>();
        posts.forEach((p) => {
            if (p.cityBoundary && !cityMap.has(p.city)) {
                cityMap.set(p.city, { city: p.city, country: p.country, geometry: p.cityBoundary });
            }
        });
        return Array.from(cityMap.values());
    },
}));
