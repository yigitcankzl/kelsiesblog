import { create } from 'zustand';
import type { BlogPost } from '../types';
import { mockPosts } from '../data/mockData';

interface BlogStore {
    posts: BlogPost[];
    selectedCountry: string | null;
    selectedPost: BlogPost | null;
    isAuthenticated: boolean;

    // Actions
    addPost: (post: BlogPost) => void;
    updatePost: (id: string, post: Partial<BlogPost>) => void;
    deletePost: (id: string) => void;
    setSelectedCountry: (country: string | null) => void;
    setSelectedPost: (post: BlogPost | null) => void;
    authenticate: (password: string) => boolean;
    logout: () => void;

    // Derived
    getCountriesWithPosts: () => string[];
    getCitiesForCountry: (country: string) => { city: string; coordinates: [number, number]; hasPosts: boolean }[];
    getPostsForCity: (country: string, city: string) => BlogPost[];
}

const ADMIN_PASSWORD = 'kelsie2024';

export const useBlogStore = create<BlogStore>((set, get) => ({
    posts: [...mockPosts],
    selectedCountry: null,
    selectedPost: null,
    isAuthenticated: false,

    addPost: (post) =>
        set((state) => ({ posts: [...state.posts, post] })),

    updatePost: (id, updates) =>
        set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

    deletePost: (id) =>
        set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
        })),

    setSelectedCountry: (country) => set({ selectedCountry: country, selectedPost: null }),

    setSelectedPost: (post) => set({ selectedPost: post }),

    authenticate: (password) => {
        const isValid = password === ADMIN_PASSWORD;
        if (isValid) set({ isAuthenticated: true });
        return isValid;
    },

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
}));
