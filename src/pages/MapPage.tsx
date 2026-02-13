import { useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
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
    const { selectedCountry, setSelectedCountry, setSelectedPost, getCountriesWithPosts } = useBlogStore();
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
                <div className="z-10 text-center py-8 sm:py-10 relative px-4">
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
                    {/* Country badge */}
                    <AnimatePresence>
                        {selectedCountry && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                                className="absolute top-4 left-4 z-[1000]"
                            >
                                <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl px-4 py-2.5 shadow-lg border border-gray-100 dark:border-gray-700">
                                    <MapPin className="w-4 h-4 text-[var(--brand)]" />
                                    <div>
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold leading-none">
                                            Exploring
                                        </p>
                                        <p
                                            className="text-sm font-bold leading-tight text-gray-900 dark:text-white"
                                            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
                                        >
                                            {selectedCountry}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
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
