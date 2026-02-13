import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBlogStore } from '../../store/store';

function createCityIcon(hasPosts: boolean): L.DivIcon {
    const rawColor = hasPosts ? '#00FF41' : '#555555';
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
          border-radius: 0;
        "></div>
        <div style="
          width: 10px;
          height: 10px;
          background: ${rawColor};
          border: 2px solid #000000;
          border-radius: 0;
          box-shadow: 0 0 8px ${rawColor}99;
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
                        <div style={{ fontFamily: "'Press Start 2P', monospace" }} className="p-1">
                            <p className="text-[8px] text-[#00FF41] mb-1">{cityData.city}</p>
                            <p className="text-gray-400 text-[6px]">
                                {posts.length} {posts.length === 1 ? 'POST' : 'POSTS'}
                            </p>
                            {posts.length > 0 && (
                                <div className="mt-1.5">
                                    {posts.map(post => (
                                        <button
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            className="block w-full text-left px-2 py-1 mt-0.5 bg-[#001a0a] border border-[#00FF41] text-[6px] cursor-pointer hover:bg-[#00FF41] hover:text-black transition-colors text-white"
                                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                                        >
                                            ▶ {post.title}
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
