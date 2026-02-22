import { useEffect, useRef, useCallback } from 'react';
import { loadCartoTiles, drawMapContent, runGlobeAnimation } from '@/lib/globeRenderer';

interface GlobeIntroProps {
    onFinished: () => void;
    countriesWithPosts?: string[];
}

export default function GlobeIntro({ onFinished, countriesWithPosts = [] }: GlobeIntroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const handleFinished = useCallback(() => onFinished(), [onFinished]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        let cancelled = false;

        // Square Mercator canvas (matches CARTO tile grid)
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = 2048;
        mapCanvas.height = 2048;

        // Draw GeoJSON-only immediately so the globe starts spinning right away
        drawMapContent(mapCanvas, countriesWithPosts);

        const { cleanup, texture } = runGlobeAnimation(container, mapCanvas, handleFinished);

        // Load CARTO tiles in background → seamlessly update texture
        loadCartoTiles().then((tc) => {
            if (cancelled) return;
            drawMapContent(mapCanvas, countriesWithPosts, tc);
            texture.needsUpdate = true;
        });

        return () => { cancelled = true; cleanup(); };
    }, [handleFinished, countriesWithPosts]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-[900]"
            style={{ background: '#000' }}
        />
    );
}
