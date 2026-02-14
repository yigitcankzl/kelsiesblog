import { useMemo, useCallback } from 'react';
import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useBlogStore } from '../../store/store';

function createCityLabel(cityName: string): L.DivIcon {
    return L.divIcon({
        className: 'custom-city-label',
        html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        cursor: pointer;
      ">
        <span style="
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          color: #00FF41;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-shadow: 0 0 8px rgba(0,255,65,0.6);
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
    const { getCitiesForCountry, getPostsForCity, setSelectedPost, getCityBoundariesForCountry } = useBlogStore();
    const citiesWithPosts = getCitiesForCountry(country);
    const boundaries = getCityBoundariesForCountry(country);

    // Build GeoJSON FeatureCollection from stored boundaries
    const greenGeoJson = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: boundaries.map(b => ({
            type: 'Feature' as const,
            properties: { name: b.city, country: b.country },
            geometry: b.geojson,
        })),
    }), [boundaries]);

    const greenStyle = useCallback(() => ({
        fillColor: '#00FF41',
        weight: 1.5,
        opacity: 1,
        color: '#00cc33',
        fillOpacity: 0.5,
    }), []);

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
                icon={createCityLabel(cityData.city)}
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
        `${country}-${boundaries.length}-${citiesWithPosts.map(c => c.city).join(',')}`,
        [country, boundaries, citiesWithPosts]
    );

    return (
        <>
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
