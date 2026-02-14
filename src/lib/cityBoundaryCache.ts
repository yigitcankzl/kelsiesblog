/**
 * Fetches city boundary GeoJSON from Nominatim (OpenStreetMap).
 * Results are cached in-memory so each city is fetched only once per session.
 * City polygons are clipped against the country land boundary to remove maritime areas.
 */
import intersect from '@turf/intersect';
import { polygon, multiPolygon } from '@turf/helpers';
import countriesGeoJson from '../data/countries.geo.json';

const cache = new Map<string, GeoJSON.Feature | null>();
const pending = new Map<string, Promise<GeoJSON.Feature | null>>();

/**
 * Find the country land polygon from countries.geo.json to use for clipping.
 */
function getCountryPolygon(country: string): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null {
    const feature = (countriesGeoJson as any).features.find(
        (f: any) => (f.properties?.ADMIN === country || f.properties?.name === country)
    );
    if (!feature) return null;
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        return feature;
    }
    return null;
}

/**
 * Clip a city boundary against the country land boundary to remove sea areas.
 */
function clipToLand(cityFeature: GeoJSON.Feature, country: string): GeoJSON.Feature {
    try {
        const countryFeature = getCountryPolygon(country);
        if (!countryFeature) return cityFeature;

        const result = intersect(
            // @ts-ignore — turf types are slightly different from GeoJSON types
            { type: 'FeatureCollection', features: [cityFeature, countryFeature] }
        );

        if (result) {
            return {
                ...cityFeature,
                geometry: result.geometry,
            };
        }
    } catch (err) {
        console.warn('Failed to clip city boundary to land:', err);
    }
    return cityFeature;
}

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

        let feature: GeoJSON.Feature = {
            type: 'Feature',
            properties: { name: city, country },
            geometry: result.geojson,
        };

        // Clip against country land boundary to remove maritime areas
        feature = clipToLand(feature, country);

        return feature;
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
