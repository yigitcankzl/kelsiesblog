import { useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useBlogStore } from '@/store/store';
import { countryBounds } from '@/data/countryBounds';
import countriesGeoJson from '@/data/countries.geo.json';
import CountryView from '@/components/map/CountryView';
import ContentArea from '@/components/content/ContentArea';
import AllStoriesPage from '@/pages/AllStoriesPage';
import GalleryPage from '@/pages/GalleryPage';
import AboutPage from '@/pages/AboutPage';

// Configure Leaflet marker icon
L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Mapping from countryBounds names → GeoJSON ADMIN names (for mismatches)
const countryNameAliases: Record<string, string> = {
    'United States': 'United States of America',
    'Czech Republic': 'Czechia',
    'UAE': 'United Arab Emirates',
    'Tanzania': 'United Republic of Tanzania',
};

// Build a reverse map: GeoJSON ADMIN name → countryBounds name
const reverseAliases: Record<string, string> = {};
for (const [boundsName, geoName] of Object.entries(countryNameAliases)) {
    reverseAliases[geoName] = boundsName;
}

// Given a GeoJSON ADMIN name, return the countryBounds name (or itself if no alias)
function toPostName(geoJsonName: string): string {
    return reverseAliases[geoJsonName] || geoJsonName;
}

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
    const { activePage, selectedCountry, setSelectedCountry, setSelectedPost, getCountriesWithPosts } = useBlogStore();
    const countriesWithPosts = getCountriesWithPosts();
    const hoveredLayerRef = useRef<L.Layer | null>(null);

    const getBaseStyle = useCallback((geoJsonName: string) => {
        const postName = toPostName(geoJsonName);
        const has = countriesWithPosts.includes(postName);
        const isSelected = selectedCountry === postName;

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
        const geoName = feature?.properties?.ADMIN || feature?.properties?.name || '';
        return getBaseStyle(geoName);
    }, [getBaseStyle]);

    const onEachCountry = useCallback((feature: any, layer: L.Layer) => {
        const geoName = feature?.properties?.ADMIN || feature?.properties?.name || '';
        const postName = toPostName(geoName);
        const has = countriesWithPosts.includes(postName);
        layer.bindTooltip(postName, { sticky: true, direction: 'auto' });
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
                (layer as any).setStyle(getBaseStyle(geoName));
            },
            click: () => {
                if (has) { setSelectedPost(null); setSelectedCountry(postName); }
            },
        });
    }, [countriesWithPosts, setSelectedCountry, setSelectedPost, getBaseStyle]);

    const geoJsonKey = useMemo(
        () => `${countriesWithPosts.join(',')}-${selectedCountry || 'none'}`,
        [countriesWithPosts, selectedCountry]
    );

    const totalCountries = countryBounds.length;
    const xpPercent = Math.min((countriesWithPosts.length / totalCountries) * 100, 100);

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
            <section className="relative w-full h-[75vh] min-h-[500px] bg-black flex flex-col items-center overflow-hidden scanlines" style={{ paddingTop: '100px' }}>

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
                                {countriesWithPosts.length}/{totalCountries} XP
                            </span>
                        </div>
                    </div>


                    {/* Bottom fade */}
                    <div className="map-bottom-fade" />

                    <MapContainer
                        center={[20, 0]} zoom={2} minZoom={2} maxZoom={12}
                        zoomControl={true} scrollWheelZoom={false}
                        dragging={true}
                        worldCopyJump={true}
                        maxBounds={[[-85, -Infinity], [85, Infinity]]}
                        maxBoundsViscosity={1.0}
                        style={{ width: '100%', height: '100%' }}
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
