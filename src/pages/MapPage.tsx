import { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBlogStore } from '../store/store';
import { countryBounds } from '../data/countryBounds';
import CountryView from '../components/map/CountryView';
import BlogPanel from '../components/blog/BlogPanel';
import countriesGeoJson from '../data/countries.geo.json';

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
    const navigate = useNavigate();
    const { selectedCountry, setSelectedCountry, selectedPost, setSelectedPost, getCountriesWithPosts } = useBlogStore();
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
                    setSelectedCountry(countryName);
                }
            },
        });
    }, [countriesWithPosts, setSelectedCountry]);

    const geoJsonKey = useMemo(() => `${hoveredCountry}-${countriesWithPosts.join(',')}`, [hoveredCountry, countriesWithPosts]);

    return (
        <div className="relative w-full h-full">
            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none"
            >
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="pointer-events-auto">
                        <motion.div
                            className="flex items-center gap-3 bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg border border-white/20 cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => { setSelectedCountry(null); setSelectedPost(null); }}
                        >
                            <Globe className="w-5 h-5 text-[#2d6a4f]" />
                            <div>
                                <h1 className="text-lg font-semibold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Kelsie Sharp
                                </h1>
                                <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-medium">Travel Journal</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-3 pointer-events-auto">
                        {selectedCountry && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => { setSelectedCountry(null); setSelectedPost(null); }}
                                className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium hover:bg-white transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                World View
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 bg-[#1a472a]/90 backdrop-blur-xl text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium hover:bg-[#1a472a] transition-colors cursor-pointer"
                        >
                            <Settings className="w-4 h-4" />
                            Admin
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Country indicator */}
            <AnimatePresence>
                {selectedCountry && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 z-[1000] flex items-center gap-3 bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg"
                    >
                        <MapPin className="w-5 h-5 text-[#2d6a4f]" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Exploring</p>
                            <p className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {selectedCountry}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map */}
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

            {/* Blog Panel */}
            <AnimatePresence>
                {selectedPost && <BlogPanel />}
            </AnimatePresence>
        </div>
    );
}
