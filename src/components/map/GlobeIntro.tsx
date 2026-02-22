import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import countriesGeoJson from '@/data/countries.geo.json';

interface GlobeIntroProps {
    onFinished: () => void;
    countriesWithPosts?: string[];
}

const MAX_LAT = 85.05;

// Same alias mapping as MapPage — GeoJSON ADMIN name → countryBounds name
const reverseAliases: Record<string, string> = {
    'United States of America': 'United States',
    'Czechia': 'Czech Republic',
    'United Arab Emirates': 'UAE',
    'United Republic of Tanzania': 'Tanzania',
};
function toPostName(geoJsonName: string): string {
    return reverseAliases[geoJsonName] || geoJsonName;
}

/** Web-Mercator Y: latitude (degrees) → [0 = 85 °N, 1 = 85 °S] */
function mercY(latDeg: number): number {
    const lat = Math.max(-MAX_LAT, Math.min(MAX_LAT, latDeg));
    const r = (lat * Math.PI) / 180;
    return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2;
}

/* ── Load CARTO dark_all @2x tiles at zoom 2 ── */
async function loadCartoTiles(): Promise<HTMLCanvasElement> {
    const zoom = 2, grid = 4, ts = 512; // @2x → 512 px
    const c = document.createElement('canvas');
    c.width = grid * ts;
    c.height = grid * ts;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, c.width, c.height);

    const subs = ['a', 'b', 'c', 'd'];
    const p: Promise<void>[] = [];
    for (let x = 0; x < grid; x++) {
        for (let y = 0; y < grid; y++) {
            const s = subs[(x + y) % 4];
            const url = `https://${s}.basemaps.cartocdn.com/dark_all/${zoom}/${x}/${y}@2x.png`;
            p.push(new Promise<void>((res) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => { ctx.drawImage(img, x * ts, y * ts, ts, ts); res(); };
                img.onerror = () => res();
                img.src = url;
            }));
        }
    }
    await Promise.all(p);
    return c;
}

/*
  Draw map content in **Mercator** projection:
  1. CARTO tiles (already Mercator) — draw directly, no reprojection
  2. GeoJSON overlay with Mercator toY — exact same colours as Leaflet
*/
function drawMapContent(
    canvas: HTMLCanvasElement,
    countriesWithPosts: string[],
    tileCanvas?: HTMLCanvasElement | null,
) {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // CARTO tiles are already in Mercator — draw directly (no reprojection!)
    if (tileCanvas) {
        ctx.drawImage(tileCanvas, 0, 0, w, h);
    }

    // GeoJSON with Mercator projection (same as Leaflet)
    const toX = (lon: number) => ((lon + 180) / 360) * w;
    const toMY = (lat: number) => mercY(lat) * h;

    for (const feature of countriesGeoJson.features) {
        const geoName = feature.properties?.ADMIN || feature.properties?.name || '';
        const has = countriesWithPosts.includes(toPostName(geoName));

        // Exact same values as MapPage getBaseStyle
        const fc = has ? '#00FF41' : '#222222';
        const fo = has ? 0.5 : 0.3;
        const sc = has ? '#00cc33' : '#333333';
        const sw = has ? 1.5 : 0.5;

        const rv = parseInt(fc.slice(1, 3), 16);
        const gv = parseInt(fc.slice(3, 5), 16);
        const bv = parseInt(fc.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${fo})`;
        ctx.strokeStyle = sc;
        ctx.lineWidth = sw;

        const geom = feature.geometry as GeoJSON.Geometry | null;
        if (!geom) continue;

        let polys: number[][][][] = [];
        if (geom.type === 'Polygon') polys = [geom.coordinates];
        else if (geom.type === 'MultiPolygon') polys = geom.coordinates;

        for (const poly of polys) {
            for (const ring of poly) {
                if (ring.length < 3) continue;
                ctx.beginPath();
                ctx.moveTo(toX(ring[0][0]), toMY(ring[0][1]));
                for (let i = 1; i < ring.length; i++) {
                    ctx.lineTo(toX(ring[i][0]), toMY(ring[i][1]));
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

/* ── Atmosphere shader ── */
const atmosVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmosFrag = `
  varying vec3 vNormal;
  uniform float uMorph;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    float alpha = intensity * (1.0 - uMorph) * 0.8;
    gl_FragColor = vec4(0.0, 1.0, 0.25, alpha);
  }
`;

/* ── Three.js globe animation ── */
function runGlobeAnimation(
    container: HTMLDivElement,
    mapCanvas: HTMLCanvasElement,
    onDone: () => void,
) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, container.clientWidth / container.clientHeight, 0.1, 1000,
    );
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    /* Stars */
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(1200 * 3);
    for (let i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 80;
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
        color: 0x00ff41, size: 0.05, transparent: true, opacity: 0.5,
    })));

    /* Globe geometry */
    const geo = new THREE.SphereGeometry(1, 80, 60);
    const posAttr = geo.attributes.position;
    const uvAttr = geo.attributes.uv;
    const vtxCount = posAttr.count;

    /*
      Three.js SphereGeometry UV:
        uv.x = longitude fraction [0,1]
        uv.y = 1 − (row/heightSegments)  → 1 at north pole, 0 at south pole

      Remap uv.y from equirectangular to Web-Mercator so the Mercator
      texture (CARTO tiles + GeoJSON) maps correctly onto the sphere.
    */
    for (let i = 0; i < vtxCount; i++) {
        const y = posAttr.getY(i); // sin(latitude) on unit sphere
        const latDeg = Math.asin(Math.max(-1, Math.min(1, y))) * 180 / Math.PI;
        // mercY: 0 = north, 1 = south → invert to match UV convention (1 = north)
        uvAttr.setY(i, 1 - mercY(latDeg));
    }
    uvAttr.needsUpdate = true;

    /* Morph targets: sphere → flat Mercator plane */
    const spherePos = new Float32Array(vtxCount * 3);
    const planePos = new Float32Array(vtxCount * 3);
    const mapS = 3.0; // plane width & height (square, matching Mercator aspect)

    for (let i = 0; i < vtxCount; i++) {
        spherePos[i * 3]     = posAttr.getX(i);
        spherePos[i * 3 + 1] = posAttr.getY(i);
        spherePos[i * 3 + 2] = posAttr.getZ(i);
        planePos[i * 3]     = (uvAttr.getX(i) - 0.5) * mapS;
        planePos[i * 3 + 1] = (uvAttr.getY(i) - 0.5) * mapS;
        planePos[i * 3 + 2] = 0;
    }

    const texture = new THREE.CanvasTexture(mapCanvas);
    // Canvas pixels are sRGB — tell Three.js so it doesn't double-gamma
    texture.colorSpace = THREE.SRGBColorSpace;
    // Sharp labels: skip mipmap generation
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const globe = new THREE.Mesh(geo, material);
    scene.add(globe);

    /* Atmosphere glow */
    const atmosMat = new THREE.ShaderMaterial({
        vertexShader: atmosVert,
        fragmentShader: atmosFrag,
        uniforms: { uMorph: { value: 0.0 } },
        transparent: true,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.02, 64, 48), atmosMat,
    );
    scene.add(atmosphere);

    /* Morph interpolation */
    function applyMorph(t: number) {
        const pos = geo.attributes.position;
        for (let i = 0; i < vtxCount; i++) {
            pos.setXYZ(i,
                spherePos[i * 3]     + (planePos[i * 3]     - spherePos[i * 3])     * t,
                spherePos[i * 3 + 1] + (planePos[i * 3 + 1] - spherePos[i * 3 + 1]) * t,
                spherePos[i * 3 + 2] + (planePos[i * 3 + 2] - spherePos[i * 3 + 2]) * t,
            );
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
        atmosMat.uniforms.uMorph.value = t;
        const s = Math.max(1 - t, 0);
        atmosphere.scale.set(s, s, s);
        atmosphere.visible = t < 0.95;
    }

    function easeInOutCubic(t: number) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /*
      Match flat-plane size & position to the Leaflet map container.

      Leaflet container:  maxWidth 1024 px − 48 px padding, centred.
      Section has 100 px paddingTop, so the Leaflet map's vertical centre
      is 50 px below the section's (= Three.js viewport's) centre.
    */
    const aspect  = container.clientWidth / container.clientHeight;
    const fovRad  = (45 * Math.PI) / 180;
    const halfTan = Math.tan(fovRad / 2);

    // Leaflet map width in px
    const leafletW    = Math.min(container.clientWidth, 1024) - 48;
    const widthRatio  = leafletW / container.clientWidth;           // fraction of viewport

    // Camera Z so the flat plane appears the SAME width as the Leaflet map
    const zEnd = (mapS / 2) / (widthRatio * aspect * halfTan);

    // --- Y offsets (both applied during morph) ---
    // 1) Latitude: Leaflet centred at 20 °N, plane centred at equator
    const leafletCenterV = 1 - mercY(20);
    const yLatOffset = (leafletCenterV - 0.5) * mapS;

    // 2) Container: Leaflet map centre is 50 px below 3-D viewport centre
    const visibleH = 2 * zEnd * halfTan;
    const yContainerOffset = 50 * visibleH / container.clientHeight;

    const yOffset = yLatOffset + yContainerOffset;

    /* Timeline */
    const SPIN = 1400, MORPH = 1400, FADE = 100;
    const TOTAL = SPIN + MORPH + FADE;
    const zStart = 3.2;
    const startTime = performance.now();
    let rotY = 0, animId = 0;

    function animate(time: number) {
        animId = requestAnimationFrame(animate);
        const elapsed = time - startTime;

        if (elapsed < SPIN) {
            rotY += 0.025;
            globe.rotation.y = rotY;
            atmosphere.rotation.y = rotY;
        }

        if (elapsed >= SPIN && elapsed < SPIN + MORPH) {
            const rawT = (elapsed - SPIN) / MORPH;
            const t = easeInOutCubic(rawT);
            applyMorph(t);

            // Rotation: stop adding speed early, decay cubically so it
            // reaches ≈ 0 well before the plane is fully flat.
            if (t < 0.4) rotY += 0.025 * (1 - t);
            const rotDecay = Math.pow(1 - t, 1.5);   // gentle decay → slower unwind
            globe.rotation.y = rotY * rotDecay;
            atmosphere.rotation.y = globe.rotation.y;
            camera.position.z = zStart + (zEnd - zStart) * t;

            // Shift globe down so Leaflet center (20 °N) aligns with camera
            globe.position.y = -yOffset * t;
            atmosphere.position.y = globe.position.y;
        }

        if (elapsed >= SPIN + MORPH) {
            const fadeRaw = Math.min((elapsed - SPIN - MORPH) / FADE, 1);
            // Ease-out quadratic for smooth dissolve
            const fadeT = fadeRaw * (2 - fadeRaw);
            renderer.domElement.style.opacity = `${1 - fadeT}`;
        }

        renderer.render(scene, camera);

        if (elapsed >= TOTAL) {
            cancelAnimationFrame(animId);
            onDone();
        }
    }

    animId = requestAnimationFrame(animate);

    const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return {
        cleanup: () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            geo.dispose();
            texture.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        },
        texture,
    };
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
