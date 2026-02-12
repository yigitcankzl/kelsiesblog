import { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBlogStore } from '@/store/store';
import { countryBounds } from '@/data/countryBounds';
import CountryView from '@/components/map/CountryView';
import ContentArea from '@/components/content/ContentArea';
import { Badge } from '@/components/ui/badge';
import countriesGeoJson from '@/data/countries.geo.json';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
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
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    const geoJsonStyle = useCallback((feature: any) => {
        const countryName = feature?.properties?.ADMIN || feature?.properties?.name || '';
        const hasPosts = countriesWithPosts.includes(countryName);
        const isHovered = hoveredCountry === countryName;

        return {
            fillColor: hasPosts ? (isHovered ? '#22c55e' : '#2d6a4f') : (isHovered ? '#e5e7eb' : '#d1d5db'),
            weight: hasPosts ? 2 : 1,
            opacity: 1,
            color: hasPosts ? '#1a472a' : '#b0b0b0',
            fillOpacity: hasPosts ? (isHovered ? 0.8 : 0.65) : (isHovered ? 0.5 : 0.35),
        };
    }, [countriesWithPosts, hoveredCountry]);

    const onEachCountry = useCallback((feature: any, layer: L.Layer) => {
        const countryName = feature?.properties?.ADMIN || feature?.properties?.name || '';
        const hasPosts = countriesWithPosts.includes(countryName);

        layer.bindTooltip(countryName, {
            sticky: true,
            direction: 'auto',
        });

        layer.on({
            mouseover: () => setHoveredCountry(countryName),
            mouseout: () => setHoveredCountry(null),
            click: () => {
                if (hasPosts) {
                    setSelectedPost(null);
                    setSelectedCountry(countryName);
                }
            },
        });
    }, [countriesWithPosts, setSelectedCountry, setSelectedPost]);

    const geoJsonKey = useMemo(() => `${hoveredCountry}-${countriesWithPosts.join(',')}`, [hoveredCountry, countriesWithPosts]);

    return (
        <>
            {/* Map section — scrolls with page */}
            <div className="relative h-[55vh] min-h-[320px] flex-shrink-0 border-b border-border">
                {/* Country indicator overlay */}
                <AnimatePresence>
                    {selectedCountry && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            className="absolute bottom-4 left-4 z-[1000]"
                        >
                            <Badge variant="secondary" className="flex items-center gap-2.5 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-lg text-base">
                                <MapPin className="w-4 h-4 text-[#2d6a4f]" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold leading-none">Exploring</p>
                                    <p className="text-sm font-semibold leading-tight mt-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        {selectedCountry}
                                    </p>
                                </div>
                            </Badge>
                        </motion.div>
                    )}
                </AnimatePresence>

                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    minZoom={2}
                    maxZoom={18}
                    zoomControl={true}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%' }}
                    maxBounds={[[-85, -180], [85, 180]]}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/voyager_nolabels/{z}/{x}/{y}{r}.png"
                    />
                    <GeoJSON
                        key={geoJsonKey}
                        data={countriesGeoJson as any}
                        style={geoJsonStyle}
                        onEachFeature={onEachCountry}
                    />
                    <FlyToCountry country={selectedCountry} />
                    {selectedCountry && <CountryView country={selectedCountry} />}
                </MapContainer>
            </div>

            {/* Content area — part of normal flow */}
            <ContentArea />
        </>
    );
}
