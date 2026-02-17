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

// Firestore doesn't support nested arrays (GeoJSON coordinates are number[][][]).
// Serialize cityBoundary to a JSON string before writing, parse back when reading.

function serializeBoundary(data: Record<string, unknown>): Record<string, unknown> {
    if (data.cityBoundary && typeof data.cityBoundary === 'object') {
        return { ...data, cityBoundary: JSON.stringify(data.cityBoundary) };
    }
    return data;
}

function deserializePost(raw: Record<string, unknown>): BlogPost {
    if (raw.cityBoundary && typeof raw.cityBoundary === 'string') {
        return { ...raw, cityBoundary: JSON.parse(raw.cityBoundary as string) } as unknown as BlogPost;
    }
    return raw as unknown as BlogPost;
}

export async function fetchPosts(): Promise<BlogPost[]> {
    const snap = await getDocs(postsCol);
    return snap.docs.map((d) => deserializePost({ id: d.id, ...d.data() }));
}

export async function addPostDoc(post: BlogPost): Promise<void> {
    await setDoc(doc(db, 'posts', post.id), serializeBoundary(post as unknown as Record<string, unknown>));
}

export async function updatePostDoc(id: string, data: Partial<BlogPost>): Promise<void> {
    await updateDoc(doc(db, 'posts', id), serializeBoundary(data as Record<string, unknown>));
}

export async function mergePostFields(id: string, data: Partial<BlogPost>): Promise<void> {
    await setDoc(doc(db, 'posts', id), serializeBoundary(data as Record<string, unknown>), { merge: true });
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

// ── Country Overviews (per-country editable description) ─────────────────────

export interface CountryOverviewDoc {
    country: string;
    overview: string;
}

const countryOverviewsCol = collection(db, 'countryOverviews');

export async function fetchCountryOverviews(): Promise<Record<string, string>> {
    const snap = await getDocs(countryOverviewsCol);
    const map: Record<string, string> = {};
    snap.forEach((d) => {
        const data = d.data() as CountryOverviewDoc;
        if (data.country && typeof data.overview === 'string') {
            map[data.country] = data.overview;
        }
    });
    return map;
}

export async function saveCountryOverview(country: string, overview: string): Promise<void> {
    const id = country;
    await setDoc(doc(db, 'countryOverviews', id), { country, overview });
}

// ── City Boundaries ───────────────────────────────────

export interface CityBoundaryDoc {
    city: string;
    country: string;
    geojson: GeoJSON.Geometry;
}

const boundariesCol = collection(db, 'cityBoundaries');

export async function fetchCityBoundaries(): Promise<CityBoundaryDoc[]> {
    const snap = await getDocs(boundariesCol);
    return snap.docs.map((d) => d.data() as CityBoundaryDoc);
}

export async function saveCityBoundary(city: string, country: string, geojson: GeoJSON.Geometry): Promise<void> {
    const id = `${country}::${city}`;
    await setDoc(doc(db, 'cityBoundaries', id), { city, country, geojson });
}
