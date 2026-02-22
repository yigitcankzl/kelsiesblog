import { useState, useEffect } from 'react';
import type { Section } from '@/types';

export interface DraftData {
    title: string;
    country: string;
    city: string;
    date: string;
    coverImage: string;
    categories: string[];
    contentFont: string;
    sections: Section[];
}

const STORAGE_KEY = 'kelsiesblog_draft';

export function usePostDraft(isEditing: boolean, data: DraftData) {
    const [draftFound, setDraftFound] = useState(false);

    // Detect draft on mount
    useEffect(() => {
        if (!isEditing && localStorage.getItem(STORAGE_KEY)) {
            setDraftFound(true);
        }
    }, [isEditing]);

    // Auto-save draft (debounced 1s)
    useEffect(() => {
        if (isEditing) return;
        const timer = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
        }, 1000);
        return () => clearTimeout(timer);
    }, [data, isEditing]);

    const restoreDraft = (): DraftData | null => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            setDraftFound(false);
            return JSON.parse(raw) as DraftData;
        } catch {
            return null;
        }
    };

    const discardDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setDraftFound(false);
    };

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return { draftFound, restoreDraft, discardDraft, clearDraft };
}
