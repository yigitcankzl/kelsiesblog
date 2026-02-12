import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBlogStore } from '../../store/store';

function createCityIcon(hasPosts: boolean): L.DivIcon {
    const color = hasPosts ? '#22c55e' : '#9ca3af';
    const pulseClass = hasPosts ? 'marker-pulse' : '';

    return L.divIcon({
        className: 'custom-city-marker',
        html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div class="${pulseClass}" style="
          position: absolute;
          width: 24px;
          height: 24px;
          background: ${color}33;
          border-radius: 50%;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
          z-index: 1;
          cursor: ${hasPosts ? 'pointer' : 'default'};
        "></div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
}

interface CountryViewProps {
    country: string;
}

export default function CountryView({ country }: CountryViewProps) {
    const { getCitiesForCountry, getPostsForCity, setSelectedPost } = useBlogStore();
    const cities = getCitiesForCountry(country);

    const markers = useMemo(() => {
        return cities.map((cityData) => {
            const posts = getPostsForCity(country, cityData.city);
            const icon = createCityIcon(cityData.hasPosts);

            return (
                <Marker
                    key={cityData.city}
                    position={cityData.coordinates}
                    icon={icon}
                    eventHandlers={{
                        click: () => {
                            if (cityData.hasPosts && posts.length > 0) {
                                setSelectedPost(posts[0]);
                            }
                        },
                    }}
                >
                    <Popup>
                        <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px' }}>
                            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{cityData.city}</p>
                            <p style={{ color: '#6b7280', fontSize: '12px' }}>
                                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                            </p>
                            {posts.length > 0 && (
                                <div style={{ marginTop: '6px' }}>
                                    {posts.map(post => (
                                        <button
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '4px 8px',
                                                marginTop: '3px',
                                                background: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                        >
                                            {post.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            );
        });
    }, [cities, country, getPostsForCity, setSelectedPost]);

    return <>{markers}</>;
}
