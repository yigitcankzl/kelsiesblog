import { useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBlogStore } from '@/store/store';
import { countryBounds } from '@/data/countryBounds';
import CountryView from '@/components/map/CountryView';
import ContentArea from '@/components/content/ContentArea';
import AllStoriesPage from '@/pages/AllStoriesPage';
import GalleryPage from '@/pages/GalleryPage';
import AboutPage from '@/pages/AboutPage';
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
    const { activePage, selectedCountry, setSelectedCountry, setSelectedPost, getCountriesWithPosts, posts } = useBlogStore();
    const countriesWithPosts = getCountriesWithPosts();
    const hoveredLayerRef = useRef<L.Layer | null>(null);

    const getBaseStyle = useCallback((name: string) => {
        const has = countriesWithPosts.includes(name);
        const isSelected = selectedCountry === name;

        // When a country is selected, make it just an outline so city polygons stand out
        if (isSelected) {
            return {
                fillColor: '#00FF41',
                weight: 1,
                opacity: 0.6,
                color: '#00cc33',
                fillOpacity: 0.08,
            };
        }

        return {
            fillColor: has ? '#00FF41' : '#222222',
            weight: has ? 1.5 : 0.5,
            opacity: 1,
            color: has ? '#00cc33' : '#333333',
            fillOpacity: has ? 0.5 : 0.3,
        };
    }, [countriesWithPosts, selectedCountry]);

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
        () => `${countriesWithPosts.join(',')}-${selectedCountry || 'none'}`,
        [countriesWithPosts, selectedCountry]
    );

    // XP percentage — max 10 countries as "100%"
    const xpPercent = Math.min((countriesWithPosts.length / 10) * 100, 100);

    if (activePage === 'stories') {
        return <AllStoriesPage />;
    }

    if (activePage === 'gallery') {
        return <GalleryPage />;
    }

    if (activePage === 'about') {
        return <AboutPage />;
    }

    return (
        <>
            {/* Map hero section */}
            <section className="relative w-full pt-20 h-[75vh] min-h-[500px] bg-black flex flex-col items-center overflow-hidden scanlines">

                {/* Map container */}
                <div className="flex-1 relative" style={{ maxWidth: '1024px', width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>

                    {/* Visited counter + XP bar */}
                    <div className="absolute bottom-10 left-8 z-[600] hidden md:flex items-end gap-5">
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
                            <div className="xp-bar w-24 mt-2">
                                <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
                            </div>
                            <span className="text-[5px] text-gray-600 mt-1"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {countriesWithPosts.length}/10 XP
                            </span>
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
