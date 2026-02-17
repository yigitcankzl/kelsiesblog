export const countryDescriptions: Record<string, string> = {
    'United States': 'A vast patchwork of cities, deserts, forests, and coastlines where road trips, small towns, and megacities all collide in one restless experiment.',
    Canada: 'Endless wilderness, glacier-fed lakes, and quietly vibrant cities — a place where nature and culture share center stage.',
    Mexico: 'From highland cities to turquoise coasts, Mexico hums with color, flavor, and centuries of living history.',
    Brazil: 'Rainforests, roaring waterfalls, and cities pulsing with music — Brazil is a country that always seems to move to its own rhythm.',
    'United Kingdom': 'Castles, cobblestones, and coastal walks weave together old stories and new ideas on a surprisingly compact set of islands.',
    France: 'A country of slow lunches, fast trains, and villages that look like movie sets — France makes the everyday feel cinematic.',
    Spain: 'Late-night plazas, sun-washed coastlines, and layered history make Spain feel like a permanent golden hour.',
    Italy: 'Ancient ruins, chaotic streets, and perfect espresso — Italy is a beautiful contradiction at every turn.',
    Germany: 'Forests, fairytale towns, and hyper-efficient cities sit side by side in a country that quietly rewards curiosity.',
    Netherlands: 'Bikes, canals, and big skies — the Netherlands turns everyday errands into gentle little journeys.',
    Switzerland: 'Alpine peaks, mirror-still lakes, and trains that feel like moving postcards define this mountain playground.',
    Japan: 'Neon skylines, tranquil temples, and vending machines for almost everything — Japan is endlessly surprising and deeply soothing at once.',
    'South Korea': 'Cafe culture, neon nights, and green mountains create a country that feels both futuristic and warmly familiar.',
    Thailand: 'Island sunsets, jungle trails, and bustling markets make Thailand a masterclass in sensory overload — in the best way.',
    Vietnam: 'Rice terraces, smoky street food stalls, and fast-flowing cities stretch along a coastline built for slow travel.',
    Indonesia: 'Thousand-island archipelago of volcanoes, coral reefs, and villages where life moves with the tides.',
    Australia: 'Sun-baked coasts, easygoing cities, and wild outback skies make Australia feel both remote and instantly welcoming.',
    'New Zealand': 'End-of-the-world landscapes, tiny towns, and twisty roads that always seem to end at another incredible view.',
    Morocco: 'Medina mazes, desert horizons, and mountain passes wrapped in the scent of mint tea and spices.',
    Turkey: 'Bridges continents with bazaars, blue coasts, and layers of history stacked under every skyline.',
    Greece: 'Whitewashed villages, rugged islands, and ancient stones glowing in the late-afternoon light.',
    Iceland: 'Glaciers, geysers, and long, lonely roads through alien landscapes that feel made for slow, thoughtful travel.',
};

export function getCountryDescription(country: string | null | undefined): string | null {
    if (!country) return null;

    const fromMap = countryDescriptions[country];
    if (fromMap) return fromMap;

    // Fallback: concise, engaging generic line if we do not have a custom blurb yet
    return `Stories from ${country} — a place of unexpected corners, everyday rituals, and little moments that linger long after you leave.`;
}

