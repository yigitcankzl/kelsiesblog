import { useMemo, useCallback } from 'react';
import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useBlogStore } from '../../store/store';
import citiesGeoJson from '../../data/cities.geo.json';

// Label coordinates for cities without posts (for positioning text labels)
const notableCities: Record<string, { city: string; coordinates: [number, number] }[]> = {
    'Greece': [
        { city: 'Athens', coordinates: [37.9838, 23.7275] },
        { city: 'Thessaloniki', coordinates: [40.6401, 22.9444] },
        { city: 'Mykonos', coordinates: [37.4467, 25.3289] },
        { city: 'Crete', coordinates: [35.2401, 24.4709] },
        { city: 'Rhodes', coordinates: [36.4349, 28.2176] },
    ],
    'Turkey': [
        { city: 'Cappadocia', coordinates: [38.6431, 34.8289] },
        { city: 'Antalya', coordinates: [36.8969, 30.7133] },
        { city: 'Bodrum', coordinates: [37.0344, 27.4305] },
        { city: 'Izmir', coordinates: [38.4192, 27.1287] },
        { city: 'Ankara', coordinates: [39.9334, 32.8597] },
    ],
    'Japan': [
        { city: 'Kyoto', coordinates: [35.0116, 135.7681] },
        { city: 'Osaka', coordinates: [34.6937, 135.5023] },
        { city: 'Hiroshima', coordinates: [34.3853, 132.4553] },
        { city: 'Nara', coordinates: [34.6851, 135.8048] },
        { city: 'Fukuoka', coordinates: [33.5904, 130.4017] },
    ],
    'Italy': [
        { city: 'Rome', coordinates: [41.9028, 12.4964] },
        { city: 'Venice', coordinates: [45.4408, 12.3155] },
        { city: 'Milan', coordinates: [45.4642, 9.1900] },
        { city: 'Naples', coordinates: [40.8518, 14.2681] },
        { city: 'Amalfi', coordinates: [40.6340, 14.6027] },
    ],
};

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
    const cityNamesWithPosts = new Set(citiesWithPosts.map(c => c.city));

    const extraCities = (notableCities[country] || []).filter(
        c => !cityNamesWithPosts.has(c.city)
    );

    // Filter REAL GeoJSON boundaries for cities WITH posts (green)
    const greenGeoJson = useMemo(() => {
        const features = (citiesGeoJson as any).features.filter(
            (f: any) => f.properties.country === country && cityNamesWithPosts.has(f.properties.name)
        );
        return { type: 'FeatureCollection' as const, features };
    }, [country, cityNamesWithPosts]);

    // Filter REAL GeoJSON boundaries for cities WITHOUT posts (gray)
    const grayGeoJson = useMemo(() => {
        const grayCityNames = new Set(extraCities.map(c => c.city));
        const features = (citiesGeoJson as any).features.filter(
            (f: any) => f.properties.country === country && grayCityNames.has(f.properties.name)
        );
        return { type: 'FeatureCollection' as const, features };
    }, [country, extraCities]);

    // Style — same as country polygons in MapPage
    const greenStyle = useCallback(() => ({
        fillColor: '#00FF41',
        weight: 1.5,
        opacity: 1,
        color: '#00cc33',
        fillOpacity: 0.5,
    }), []);

    const grayStyle = useCallback(() => ({
        fillColor: '#555555',
        weight: 0.8,
        opacity: 1,
        color: '#444444',
        fillOpacity: 0.25,
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

    // Tooltip for gray cities
    const onEachGrayCity = useCallback((feature: any, layer: L.Layer) => {
        const cityName = feature.properties.name;
        layer.bindTooltip(cityName, {
            sticky: true,
            direction: 'auto',
        });
    }, []);

    // Text labels
    const labels = useMemo(() => {
        const greenLabels = citiesWithPosts.map(cityData => (
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
        const grayLabels = extraCities.map(cityData => (
            <Marker
                key={`label-${cityData.city}`}
                position={cityData.coordinates}
                icon={createCityLabel(cityData.city, false)}
            />
        ));
        return [...greenLabels, ...grayLabels];
    }, [citiesWithPosts, extraCities, country, getPostsForCity, setSelectedPost]);

    const geoKey = useMemo(() =>
        `${country}-${citiesWithPosts.map(c => c.city).join(',')}`,
        [country, citiesWithPosts]
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
            {grayGeoJson.features.length > 0 && (
                <GeoJSON
                    key={`gray-${geoKey}`}
                    data={grayGeoJson as any}
                    style={grayStyle}
                    onEachFeature={onEachGrayCity}
                />
            )}
            {labels}
        </>
    );
}
