import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

interface GlobeIntroProps {
    onFinished: () => void;
}

const GLOBE_SIZE = 300;

export default function GlobeIntro({ onFinished }: GlobeIntroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phiRef = useRef(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleFinished = useCallback(() => {
        onFinished();
    }, [onFinished]);

    useEffect(() => {
        if (!canvasRef.current) return;

        canvasRef.current.width = GLOBE_SIZE * 2;
        canvasRef.current.height = GLOBE_SIZE * 2;

        const startTime = Date.now();
        const SPIN_DURATION = 1800;   // Normal spinning
        const ZOOM_DURATION = 1400;   // Zoom into globe
        const TOTAL = SPIN_DURATION + ZOOM_DURATION;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: GLOBE_SIZE * 2,
            height: GLOBE_SIZE * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.5,
            mapSamples: 20000,
            mapBrightness: 3,
            baseColor: [0.02, 0.06, 0.02],
            markerColor: [0, 1, 0.25],
            glowColor: [0, 0.4, 0.1],
            markers: [],
            onRender: (state) => {
                const elapsed = Date.now() - startTime;
                const zoomProgress = Math.max(0, (elapsed - SPIN_DURATION) / ZOOM_DURATION);

                // Spin: slow down as we zoom in
                const spinSpeed = 0.02 * (1 - zoomProgress * 0.6);
                phiRef.current += spinSpeed;
                state.phi = phiRef.current;

                // Zoom: scale canvas up + fade out via wrapper
                if (wrapperRef.current && zoomProgress > 0) {
                    const eased = 1 - Math.pow(1 - zoomProgress, 3); // ease-out cubic
                    const scale = 1 + eased * 6;       // 1x → 7x
                    const opacity = 1 - eased;

                    wrapperRef.current.style.transform = `scale(${scale})`;
                    wrapperRef.current.style.opacity = `${opacity}`;
                }
            },
        });

        const removeTimer = setTimeout(handleFinished, TOTAL);

        return () => {
            globe.destroy();
            clearTimeout(removeTimer);
        };
    }, [handleFinished]);

    return (
        <div
            ref={wrapperRef}
            className="absolute inset-0 z-[900] flex items-center justify-center bg-black"
            style={{ transformOrigin: 'center center', willChange: 'transform, opacity' }}
        >
            <canvas
                ref={canvasRef}
                width={GLOBE_SIZE * 2}
                height={GLOBE_SIZE * 2}
                style={{
                    width: `${GLOBE_SIZE}px`,
                    height: `${GLOBE_SIZE}px`,
                    flexShrink: 0,
                }}
            />
        </div>
    );
}
