/**
 * One-time seed script to push mock data into Firestore.
 *
 * Run from the browser console or create a temporary button in admin:
 *   import { seedFirestore } from './lib/seed';
 *   seedFirestore();
 */
import { mockPosts } from '../data/mockData';
import { addPostDoc, updateAboutDoc } from './firestore';
import type { AboutContent } from '../types';

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

export async function seedFirestore() {
    console.log('🌱 Seeding Firestore...');

    // Seed posts
    for (const post of mockPosts) {
        await addPostDoc(post);
        console.log(`  ✓ Post: ${post.title}`);
    }

    // Seed about content
    await updateAboutDoc(defaultAbout);
    console.log('  ✓ About content');

    console.log('🌱 Seeding complete!');
}
