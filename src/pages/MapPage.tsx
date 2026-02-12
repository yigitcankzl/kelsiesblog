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
            fillColor: has ? '#2d6a4f' : '#d1d5db',
            weight: has ? 2 : 1,
            opacity: 1,
            color: has ? '#1a472a' : '#b0b0b0',
            fillOpacity: has ? 0.65 : 0.35,
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
                    fillColor: has ? '#22c55e' : '#e5e7eb',
                    fillOpacity: has ? 0.8 : 0.5,
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

    // Only re-render GeoJSON when the list of countries with posts changes
    const geoJsonKey = useMemo(
        () => countriesWithPosts.join(','),
        [countriesWithPosts]
    );

    return (
        <>
            {/* Map hero */}
            <div className="relative h-[50vh] min-h-[300px] flex-shrink-0">
                {/* Country label overlay */}
                <AnimatePresence>
                    {selectedCountry && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            className="absolute top-4 left-4 z-[1000]"
                        >
                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-3 py-2 rounded-lg shadow-lg border border-white/50">
                                <MapPin className="w-4 h-4 text-[var(--brand)]" />
                                <div>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-semibold leading-none">
                                        Exploring
                                    </p>
                                    <p className="text-sm font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        {selectedCountry}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom gradient fade */}
                <div className="map-bottom-fade" />

                <MapContainer
                    center={[20, 0]} zoom={2} minZoom={2} maxZoom={12}
                    zoomControl={true} scrollWheelZoom={false}
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

            {/* Content */}
            <ContentArea />
        </>
    );
}
