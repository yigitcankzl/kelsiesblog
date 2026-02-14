import { useState, useEffect, useMemo, useCallback } from 'react';
import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useBlogStore } from '../../store/store';
import { fetchCityBoundaries } from '../../lib/cityBoundaryCache';

function createCityLabel(cityName: string, hasPosts: boolean): L.DivIcon {
    const color = hasPosts ? '#00FF41' : '#555555';
    const glow = hasPosts ? 'text-shadow: 0 0 8px rgba(0,255,65,0.6);' : '';
    const cursor = hasPosts ? 'pointer' : 'default';

    return L.divIcon({
        className: 'custom-city-label',
        html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        cursor: ${cursor};
      ">
        <span style="
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          color: ${color};
          letter-spacing: 0.1em;
          text-transform: uppercase;
          ${glow}
        ">${cityName}</span>
      </div>
    `,
        iconSize: [0, 0],
        iconAnchor: [-4, 8],
    });
}

interface CountryViewProps {
    country: string;
}

export default function CountryView({ country }: CountryViewProps) {
    const { getCitiesForCountry, getPostsForCity, setSelectedPost } = useBlogStore();
    const citiesWithPosts = getCitiesForCountry(country);

    const [boundaryFeatures, setBoundaryFeatures] = useState<GeoJSON.Feature[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch city boundaries from Nominatim for cities that have posts
    useEffect(() => {
        if (citiesWithPosts.length === 0) return;

        let cancelled = false;
        setLoading(true);

        const citiesToFetch = citiesWithPosts.map(c => ({
            city: c.city,
            country,
        }));

        fetchCityBoundaries(citiesToFetch).then(features => {
            if (!cancelled) {
                setBoundaryFeatures(features);
                setLoading(false);
            }
        });

        return () => { cancelled = true; };
    }, [country, citiesWithPosts]);

    // Build GeoJSON FeatureCollection from fetched boundaries
    const greenGeoJson = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: boundaryFeatures,
    }), [boundaryFeatures]);

    // Green style for cities with posts
    const greenStyle = useCallback(() => ({
        fillColor: '#00FF41',
        weight: 1.5,
        opacity: 1,
        color: '#00cc33',
        fillOpacity: 0.5,
    }), []);

    // Hover + click for green cities
    const onEachGreenCity = useCallback((feature: any, layer: L.Layer) => {
        const cityName = feature.properties.name;
        layer.bindTooltip(cityName, {
            sticky: true,
            direction: 'auto',
            className: 'city-tooltip-green',
        });
        layer.on({
            mouseover: () => {
                (layer as any).setStyle({ fillOpacity: 0.7, weight: 2.5 });
            },
            mouseout: () => {
                (layer as any).setStyle({ fillOpacity: 0.5, weight: 1.5 });
            },
            click: () => {
                const posts = getPostsForCity(country, cityName);
                if (posts.length > 0) setSelectedPost(posts[0]);
            },
        });
    }, [country, getPostsForCity, setSelectedPost]);

    // Text labels for cities with posts
    const labels = useMemo(() => {
        return citiesWithPosts.map(cityData => (
            <Marker
                key={`label-${cityData.city}`}
                position={cityData.coordinates}
                icon={createCityLabel(cityData.city, true)}
                eventHandlers={{
                    click: () => {
                        const posts = getPostsForCity(country, cityData.city);
                        if (posts.length > 0) setSelectedPost(posts[0]);
                    },
                }}
            />
        ));
    }, [citiesWithPosts, country, getPostsForCity, setSelectedPost]);

    const geoKey = useMemo(() =>
        `${country}-${boundaryFeatures.length}-${citiesWithPosts.map(c => c.city).join(',')}`,
        [country, boundaryFeatures, citiesWithPosts]
    );

    return (
        <>
            {loading && citiesWithPosts.length > 0 && (
                <Marker
                    position={citiesWithPosts[0].coordinates}
                    icon={L.divIcon({
                        className: 'loading-label',
                        html: `<span style="font-family:'Press Start 2P',monospace;font-size:6px;color:#00FF41;opacity:0.6">LOADING...</span>`,
                        iconSize: [0, 0],
                    })}
                />
            )}
            {greenGeoJson.features.length > 0 && (
                <GeoJSON
                    key={`green-${geoKey}`}
                    data={greenGeoJson as any}
                    style={greenStyle}
                    onEachFeature={onEachGreenCity}
                />
            )}
            {labels}
        </>
    );
}
