import { useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

    const getBaseStyle = useCallback((name: string) => {
        const has = countriesWithPosts.includes(name);
        return {
            fillColor: has ? '#059669' : '#E5E7EB',
            weight: has ? 1.5 : 0.5,
            opacity: 1,
            color: has ? '#047857' : '#ffffff',
            fillOpacity: has ? 0.7 : 0.4,
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
                    fillColor: has ? '#10B981' : '#d1d5db',
                    fillOpacity: has ? 0.85 : 0.55,
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

    return (
        <>
            {/* Map hero section */}
            <section className="relative w-full h-[75vh] min-h-[500px] bg-background flex flex-col items-center overflow-hidden">
                {/* Editorial heading overlay */}
                <div className="z-[500] text-center py-8 sm:py-10 relative px-4">
                    <p className="text-[var(--brand)] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                        Explore The World
                    </p>
                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-2 tracking-tight"
                        style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
                    >
                        Where to next?
                    </h1>
                    <div className="w-16 h-1 bg-[var(--brand)] mx-auto mt-4 opacity-60" />
                </div>

                {/* Map container */}
                <div className="w-full flex-1 relative">
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
                                    <div className="bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        {mainPost && (
                                            <div className="relative h-28 overflow-hidden">
                                                <img
                                                    src={mainPost.coverImage}
                                                    alt={selectedCountry}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-block px-2.5 py-1 bg-[var(--brand)] text-[9px] font-bold tracking-[0.15em] uppercase text-white">
                                                        Guide
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3
                                                    className="text-lg font-bold text-gray-900 dark:text-white"
                                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                                >
                                                    {selectedCountry}
                                                </h3>
                                                <span className="text-xs text-gray-400">{countryPosts.length}→</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 font-light leading-relaxed">
                                                {mainPost ? `From the ${mainPost.city} ${mainPost.sections[0]?.heading?.toLowerCase() || 'highlights'} to the ${mainPost.sections[1]?.heading?.toLowerCase() || 'beauty'} of ${selectedCountry}...` : `Explore ${selectedCountry}`}
                                            </p>
                                            <button
                                                onClick={() => { setSelectedPost(null); setSelectedCountry(selectedCountry); }}
                                                className="text-[var(--brand)] text-[11px] font-bold uppercase tracking-[0.12em] hover:underline cursor-pointer flex items-center gap-1"
                                            >
                                                Read Journal
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>

                    {/* Visited counter */}
                    <div className="absolute bottom-10 left-8 z-[600] hidden md:flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            Total Visited
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span
                                className="text-3xl text-gray-900 dark:text-white"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {countriesWithPosts.length}
                            </span>
                            <span
                                className="text-sm text-gray-500 italic"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                countries
                            </span>
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
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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
