import { useCallback, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minimize2, Maximize2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBlogStore } from '@/store/store';
import { countryBounds } from '@/data/countryBounds';
import CountryView from '@/components/map/CountryView';
import ContentArea from '@/components/content/ContentArea';
import countriesGeoJson from '@/data/countries.geo.json';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41],
});

function FlyToCountry({ country }: { country: string | null }) {
    const map = useMap();
    const bounds = countryBounds.find(c => c.name === country);
    if (country && bounds) {
        map.flyToBounds(bounds.bounds, { duration: 1.2, padding: [40, 40] });
    } else if (!country) {
        map.flyTo([20, 0], 2, { duration: 1.2 });
    }
    return null;
}

export default function MapPage() {
    const { selectedCountry, setSelectedCountry, setSelectedPost, getCountriesWithPosts, posts } = useBlogStore();
    const countriesWithPosts = getCountriesWithPosts();
    const hoveredLayerRef = useRef<L.Layer | null>(null);

    const MAP_SIZES = [
        { label: 'SM', height: 'h-[40vh] min-h-[300px]' },
        { label: 'MD', height: 'h-[55vh] min-h-[400px]' },
        { label: 'LG', height: 'h-[75vh] min-h-[500px]' },
        { label: 'XL', height: 'h-[90vh] min-h-[600px]' },
    ] as const;
    const [sizeIndex, setSizeIndex] = useState(2);

    const getBaseStyle = useCallback((name: string) => {
        const has = countriesWithPosts.includes(name);
        return {
            fillColor: has ? '#00FF41' : '#222222',
            weight: has ? 1.5 : 0.5,
            opacity: 1,
            color: has ? '#00cc33' : '#333333',
            fillOpacity: has ? 0.5 : 0.3,
        };
    }, [countriesWithPosts]);

    const geoJsonStyle = useCallback((feature: any) => {
        const name = feature?.properties?.ADMIN || feature?.properties?.name || '';
        return getBaseStyle(name);
    }, [getBaseStyle]);

    const onEachCountry = useCallback((feature: any, layer: L.Layer) => {
        const name = feature?.properties?.ADMIN || feature?.properties?.name || '';
        const has = countriesWithPosts.includes(name);
        layer.bindTooltip(name, { sticky: true, direction: 'auto' });
        layer.on({
            mouseover: () => {
                hoveredLayerRef.current = layer;
                (layer as any).setStyle({
                    fillColor: has ? '#00FF41' : '#333333',
                    fillOpacity: has ? 0.7 : 0.4,
                });
            },
            mouseout: () => {
                hoveredLayerRef.current = null;
                (layer as any).setStyle(getBaseStyle(name));
            },
            click: () => {
                if (has) { setSelectedPost(null); setSelectedCountry(name); }
            },
        });
    }, [countriesWithPosts, setSelectedCountry, setSelectedPost, getBaseStyle]);

    const geoJsonKey = useMemo(
        () => countriesWithPosts.join(','),
        [countriesWithPosts]
    );

    // XP percentage — max 10 countries as "100%"
    const xpPercent = Math.min((countriesWithPosts.length / 10) * 100, 100);

    return (
        <>
            {/* Map hero section */}
            <section className={`relative w-full pt-20 ${MAP_SIZES[sizeIndex].height} bg-black flex flex-col items-center overflow-hidden scanlines transition-all duration-700 ease-in-out`}>

                {/* Map container */}
                <div className="flex-1 relative" style={{ maxWidth: '1024px', width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
                    {/* Country popup card */}
                    <AnimatePresence>
                        {selectedCountry && (() => {
                            const countryPosts = posts.filter(p => p.country === selectedCountry);
                            const mainPost = countryPosts[0];
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                                    className="absolute top-4 right-4 z-[1000] w-64"
                                >
                                    <div className="bg-black retro-corners overflow-hidden"
                                        style={{ boxShadow: '0 0 15px rgba(0, 255, 65, 0.25)' }}>
                                        <span className="rc-extra absolute inset-0 z-10" />
                                        {mainPost && (
                                            <div className="relative h-28 overflow-hidden">
                                                <img
                                                    src={mainPost.coverImage}
                                                    alt={selectedCountry}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-block px-2.5 py-1 bg-[var(--brand)] text-black text-[6px] font-bold tracking-[0.15em] uppercase"
                                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                                        GUIDE
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-[10px] font-bold text-white"
                                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                                    {selectedCountry}
                                                </h3>
                                                <span className="text-[8px] text-[var(--neon-cyan)]"
                                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                                    {countryPosts.length}→
                                                </span>
                                            </div>
                                            <p className="text-[7px] text-gray-400 mb-3 line-clamp-2 leading-relaxed"
                                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                                {mainPost ? `${mainPost.city} adventures...` : `Explore ${selectedCountry}`}
                                            </p>
                                            <button
                                                onClick={() => { setSelectedPost(null); setSelectedCountry(selectedCountry); }}
                                                className="text-[var(--brand)] text-[7px] font-bold uppercase tracking-[0.12em] hover:underline cursor-pointer flex items-center gap-1"
                                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                                            >
                                                ▶ READ
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>

                    {/* Visited counter + XP bar + Size toggle */}
                    <div className="absolute bottom-10 left-8 z-[600] hidden md:flex items-end gap-5">
                        {/* Score */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-gray-500"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                SCORE
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl text-[var(--brand)] neon-glow"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {countriesWithPosts.length}
                                </span>
                                <span className="text-[8px] text-[var(--neon-amber)]"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    LVL
                                </span>
                            </div>
                            {/* XP Bar */}
                            <div className="xp-bar w-24 mt-2">
                                <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
                            </div>
                            <span className="text-[5px] text-gray-600 mt-1"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {countriesWithPosts.length}/10 XP
                            </span>
                        </div>

                        {/* Map size toggle */}
                        <div className="flex flex-col gap-0 border-2 border-[var(--brand)]"
                            style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)' }}>
                            <button
                                onClick={() => setSizeIndex(Math.min(sizeIndex + 1, MAP_SIZES.length - 1))}
                                disabled={sizeIndex >= MAP_SIZES.length - 1}
                                className="bg-black text-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-all w-8 h-7 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-[var(--brand)] border-b border-[var(--brand)]/30"
                            >
                                <Maximize2 className="w-3 h-3" />
                            </button>
                            <div className="bg-black text-center py-0.5 border-b border-[var(--brand)]/30">
                                <span className="text-[5px] text-[var(--brand)]"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {MAP_SIZES[sizeIndex].label}
                                </span>
                            </div>
                            <button
                                onClick={() => setSizeIndex(Math.max(sizeIndex - 1, 0))}
                                disabled={sizeIndex <= 0}
                                className="bg-black text-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-all w-8 h-7 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-[var(--brand)]"
                            >
                                <Minimize2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>


                    {/* Featured destinations — bottom-right */}
                    <div className="absolute bottom-10 right-8 z-[1000] hidden md:flex flex-col gap-3 items-end bg-black retro-corners p-5"
                        style={{ boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)' }}>
                        <span className="rc-extra absolute inset-0" />
                        <span className="text-[6px] font-bold uppercase tracking-[0.2em] text-[var(--neon-amber)] mb-1"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            ★ TOP DESTINATIONS
                        </span>
                        <div className="flex flex-col gap-3 items-end">
                            {countriesWithPosts.slice(0, 3).map((country, i) => (
                                <button
                                    key={country}
                                    onClick={() => { setSelectedPost(null); setSelectedCountry(country); }}
                                    className="flex items-center gap-3 text-[8px] font-medium text-white hover:text-[var(--brand)] transition-colors cursor-pointer group/dest"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                >
                                    <span className="text-[5px] text-gray-600"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {country}
                                    <span className="w-2 h-2"
                                        style={{
                                            backgroundColor: i === 0 ? '#00FF41' : i === 1 ? '#00FFFF' : '#FFB800',
                                            boxShadow: `0 0 6px ${i === 0 ? 'rgba(0,255,65,0.5)' : i === 1 ? 'rgba(0,255,255,0.5)' : 'rgba(255,184,0,0.5)'}`,
                                        }} />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Bottom fade */}
                    <div className="map-bottom-fade" />

                    <MapContainer
                        center={[20, 0]} zoom={2} minZoom={2} maxZoom={12}
                        zoomControl={true} scrollWheelZoom={true}
                        dragging={true}
                        style={{ width: '100%', height: '100%' }}
                        maxBounds={[[-85, -180], [85, 180]]}
                        maxBoundsViscosity={1.0}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        <GeoJSON key={geoJsonKey} data={countriesGeoJson as any} style={geoJsonStyle} onEachFeature={onEachCountry} />
                        <FlyToCountry country={selectedCountry} />
                        {selectedCountry && <CountryView country={selectedCountry} />}
                    </MapContainer>
                </div>
            </section>

            {/* Content below map */}
            <ContentArea />
        </>
    );
}
