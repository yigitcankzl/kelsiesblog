import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBlogStore } from '../../store/store';

function createCityIcon(hasPosts: boolean): L.DivIcon {
    const rawColor = hasPosts ? '#10B981' : '#9ca3af';
    const pulseClass = hasPosts ? 'marker-pulse' : '';

    return L.divIcon({
        className: 'custom-city-marker',
        html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div class="${pulseClass}" style="
          position: absolute;
          width: 24px;
          height: 24px;
          background: ${rawColor}33;
          border-radius: 50%;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          background: ${rawColor};
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
    // Only show cities that have blog posts
    const cities = getCitiesForCountry(country).filter(c => c.hasPosts);

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
                        <div className="font-sans p-1">
                            <p className="font-semibold text-sm mb-0.5">{cityData.city}</p>
                            <p className="text-gray-500 text-xs">
                                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                            </p>
                            {posts.length > 0 && (
                                <div className="mt-1.5">
                                    {posts.map(post => (
                                        <button
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            className="block w-full text-left px-2 py-1 mt-0.5 bg-[var(--brand-surface)] border border-green-200 rounded-md text-xs cursor-pointer font-sans hover:bg-green-100 transition-colors"
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
