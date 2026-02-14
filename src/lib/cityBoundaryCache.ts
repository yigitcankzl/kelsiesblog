/**
 * Fetches city boundary GeoJSON from Nominatim (OpenStreetMap).
 * Results are cached in-memory so each city is fetched only once per session.
 */

const cache = new Map<string, GeoJSON.Feature | null>();
const pending = new Map<string, Promise<GeoJSON.Feature | null>>();

async function fetchFromNominatim(city: string, country: string): Promise<GeoJSON.Feature | null> {
    const url = `https://nominatim.openstreetmap.org/search?` +
        `city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}` +
        `&format=json&polygon_geojson=1&limit=1`;

    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'TravelBlog/1.0' },
        });
        if (!res.ok) return null;

        const data = await res.json();
        if (!data.length) return null;

        const result = data[0];
        // Only use polygon-type geometries (city boundaries)
        if (
            result.geojson &&
            (result.geojson.type === 'Polygon' || result.geojson.type === 'MultiPolygon')
        ) {
            return {
                type: 'Feature',
                properties: { name: city, country },
                geometry: result.geojson,
            } as GeoJSON.Feature;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Fetch city boundary with deduplication and caching.
 * Respects Nominatim rate limit (1 req/sec) via sequential fetching.
 */
export async function fetchCityBoundary(
    city: string,
    country: string
): Promise<GeoJSON.Feature | null> {
    const key = `${country}::${city}`;

    if (cache.has(key)) return cache.get(key) ?? null;
    if (pending.has(key)) return pending.get(key)!;

    const promise = fetchFromNominatim(city, country).then(result => {
        cache.set(key, result);
        pending.delete(key);
        return result;
    });

    pending.set(key, promise);
    return promise;
}

/**
 * Fetch boundaries for multiple cities sequentially (respecting rate limit).
 */
export async function fetchCityBoundaries(
    cities: { city: string; country: string }[]
): Promise<GeoJSON.Feature[]> {
    const results: GeoJSON.Feature[] = [];

    for (const { city, country } of cities) {
        const key = `${country}::${city}`;
        // Skip if already cached
        if (cache.has(key)) {
            const cached = cache.get(key);
            if (cached) results.push(cached);
            continue;
        }

        const feature = await fetchCityBoundary(city, country);
        if (feature) results.push(feature);

        // Rate limit: wait 1 second between uncached requests
        await new Promise(r => setTimeout(r, 1100));
    }

    return results;
}
