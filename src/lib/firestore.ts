import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost, GalleryItem, AboutContent } from '../types';

// ── Posts ──────────────────────────────────────────────

const postsCol = collection(db, 'posts');

export async function fetchPosts(): Promise<BlogPost[]> {
    const snap = await getDocs(postsCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));
}

export async function addPostDoc(post: BlogPost): Promise<void> {
    await setDoc(doc(db, 'posts', post.id), post);
}

export async function updatePostDoc(id: string, data: Partial<BlogPost>): Promise<void> {
    await updateDoc(doc(db, 'posts', id), data as Record<string, unknown>);
}

export async function deletePostDoc(id: string): Promise<void> {
    await deleteDoc(doc(db, 'posts', id));
}

// ── Gallery Items ─────────────────────────────────────

const galleryCol = collection(db, 'galleryItems');

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
    const snap = await getDocs(galleryCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
}

export async function addGalleryDoc(item: GalleryItem): Promise<void> {
    await setDoc(doc(db, 'galleryItems', item.id), item);
}

export async function updateGalleryDoc(id: string, data: Partial<GalleryItem>): Promise<void> {
    await updateDoc(doc(db, 'galleryItems', id), data as Record<string, unknown>);
}

export async function deleteGalleryDoc(id: string): Promise<void> {
    await deleteDoc(doc(db, 'galleryItems', id));
}

// ── About Content ─────────────────────────────────────

const aboutDocRef = doc(db, 'about', 'main');

export async function fetchAboutContent(): Promise<AboutContent | null> {
    const snap = await getDoc(aboutDocRef);
    return snap.exists() ? (snap.data() as AboutContent) : null;
}

export async function updateAboutDoc(data: Partial<AboutContent>): Promise<void> {
    await setDoc(aboutDocRef, data, { merge: true });
}
