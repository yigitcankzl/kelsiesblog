/**
 * Fetches city boundary GeoJSON from Nominatim (OpenStreetMap).
 * Results are cached in-memory so each city is fetched only once per session.
 */

const cache = new Map<string, GeoJSON.Feature | null>();
const pending = new Map<string, Promise<GeoJSON.Feature | null>>();

async function fetchFromNominatim(city: string, country: string): Promise<GeoJSON.Feature | null> {
    // Use q= with multiple results so we can pick the admin boundary (relation),
    // not a point node. Relations (osm_type=R) contain full city boundary polygons.
    const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(city + ', ' + country)}` +
        `&format=json&polygon_geojson=1&limit=5`;

    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'TravelBlog/1.0' },
        });
        if (!res.ok) return null;

        const data = await res.json();
        if (!data.length) return null;

        // Prefer results that are OSM relations (R) — these have admin boundary polygons
        // Then ways (W), and finally nodes (N) as last resort
        const preferred = data.find(
            (r: any) =>
                r.osm_type === 'R' &&
                r.geojson &&
                (r.geojson.type === 'Polygon' || r.geojson.type === 'MultiPolygon')
        );

        const fallback = data.find(
            (r: any) =>
                r.geojson &&
                (r.geojson.type === 'Polygon' || r.geojson.type === 'MultiPolygon')
        );

        const result = preferred || fallback;
        if (!result) return null;

        return {
            type: 'Feature',
            properties: { name: city, country },
            geometry: result.geojson,
        } as GeoJSON.Feature;
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
