/**
 * One-time seed script to push mock data into Firestore.
 *
 * Run from the browser console or create a temporary button in admin:
 *   import { seedFirestore } from './lib/seed';
 *   seedFirestore();
 */
import { mockPosts } from '../data/mockData';
import { addPostDoc, addGalleryDoc, updateAboutDoc } from './firestore';
import type { AboutContent, GalleryItem } from '../types';

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

const mockGallery: GalleryItem[] = [
    { id: 'gallery-1', src: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', caption: 'Golden hour over the caldera', city: 'Santorini', country: 'Greece' },
    { id: 'gallery-2', src: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', caption: 'Blue domes at dawn', city: 'Santorini', country: 'Greece' },
    { id: 'gallery-3', src: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800', caption: 'Turkish coffee ritual', city: 'Istanbul', country: 'Turkey' },
    { id: 'gallery-4', src: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800', caption: 'Grand Bazaar colors', city: 'Istanbul', country: 'Turkey' },
    { id: 'gallery-5', src: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', caption: 'Shibuya neon lights', city: 'Tokyo', country: 'Japan' },
    { id: 'gallery-6', src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800', caption: 'Cinque Terre coastline', city: 'Cinque Terre', country: 'Italy' },
    { id: 'gallery-7', src: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800', caption: 'Manarola at sunset', city: 'Cinque Terre', country: 'Italy' },
    { id: 'gallery-8', src: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800', caption: 'Florence rooftops', city: 'Florence', country: 'Italy' },
];

export async function seedFirestore() {
    console.log('🌱 Seeding Firestore...');

    // Seed posts
    for (const post of mockPosts) {
        await addPostDoc(post);
        console.log(`  ✓ Post: ${post.title}`);
    }

    // Seed gallery
    for (const item of mockGallery) {
        await addGalleryDoc(item);
        console.log(`  ✓ Gallery: ${item.caption}`);
    }

    // Seed about content
    await updateAboutDoc(defaultAbout);
    console.log('  ✓ About content');

    console.log('🌱 Seeding complete!');
}

