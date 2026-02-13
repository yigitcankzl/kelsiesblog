import type { BlogPost } from '../types';

export const mockPosts: BlogPost[] = [
    {
        id: 'santorini-sunset',
        title: 'Sunset in Santorini: Chasing the Golden Hour',
        country: 'Greece',
        city: 'Santorini',
        coordinates: [36.3932, 25.4615],
        coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200',
        date: 'OCT 12, 2023',
        category: '5 Min Read',
        sections: [
            {
                heading: 'Arriving in Oia',
                content: 'The narrow streets of Oia are filled with anticipation as the sun begins its descent. Finding the perfect spot requires patience, but the reward is a front-row seat to one of the most photographed sunsets in the world. The white-washed buildings glow amber, and the caldera shimmers below.',
                image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800'
            },
            {
                heading: 'Blue Domes at Dawn',
                content: 'Before the cruise ship crowds arrive, Santorini belongs to the early risers. The iconic blue domes of Oia catch the first light, and the Aegean stretches out endlessly. We walked through empty alleys, past sleeping cats and closed tavernas, feeling like we had the whole island to ourselves.',
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'
            },
            {
                heading: 'Wine Tasting in Pyrgos',
                content: 'Santorini\'s volcanic soil produces some of Greece\'s finest wines. At a hillside vineyard in Pyrgos, we tasted crisp Assyrtiko and velvety Vinsanto while overlooking terraced vineyards that cascade toward the sea. The sommelier explained how the unique basket-shaped vines protect grapes from the fierce Aegean winds.'
            }
        ]
    },
    {
        id: 'istanbul-coffee',
        title: 'Coffee Culture in Istanbul',
        country: 'Turkey',
        city: 'Istanbul',
        coordinates: [41.0082, 28.9784],
        coverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200',
        date: 'SEP 28, 2023',
        category: 'Food & Drink',
        sections: [
            {
                heading: 'Beyoğlu\'s Historic Cafes',
                content: 'Exploring the historic cafes of Beyoğlu and the ritual of Turkish coffee preparation. Each cup tells a story — the beans ground to powder, the cezve heated slowly over sand, the foam rising just so. In Istanbul, coffee is not a drink; it is a ceremony, a conversation starter, a fortune-telling device.',
                image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800'
            },
            {
                heading: 'The Grand Bazaar',
                content: 'With over 4,000 shops spread across 61 covered streets, the Grand Bazaar is sensory overload in the best way. Turkish lamps cast kaleidoscopic patterns, spice merchants offer samples of saffron and sumac, and carpet sellers invite you for tea before showing their treasures.',
                image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800'
            },
            {
                heading: 'Bosphorus at Dusk',
                content: 'We took a ferry across the Bosphorus as the sun dipped behind the minarets. Seagulls rode the wind, the call to prayer echoed across the water, and for a moment, suspended between two continents, everything felt absolutely right with the world.'
            }
        ]
    },
    {
        id: 'tokyo-weekend',
        title: 'A Weekend in Tokyo',
        country: 'Japan',
        city: 'Tokyo',
        coordinates: [35.6762, 139.6503],
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
        date: 'AUG 15, 2023',
        category: 'City Break',
        sections: [
            {
                heading: 'Shibuya Crossing',
                content: 'Standing at the world\'s busiest intersection, watching thousands of people cross in organized chaos, is a surreal experience. The neon billboards tower above, the energy is electric, and for a moment, you feel like you\'re inside a cyberpunk movie.',
                image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800'
            },
            {
                heading: 'Tsukiji Outer Market',
                content: 'Even though the inner market moved to Toyosu, the outer market remains a paradise for food lovers. We tried impossibly fresh sushi for breakfast, tamagoyaki still warm from the grill, and skewers of wagyu beef that melted like butter. Every stall told a story of generational craft.',
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
            },
            {
                heading: 'Lost in Golden Gai',
                content: 'Each bar in Golden Gai seats maybe six people. We ducked into one draped in vintage movie posters, where the bartender — a retired film critic — poured Japanese whisky and told stories about meeting Kurosawa. It was one of those magical, unrepeatable travel moments.'
            }
        ]
    },
    {
        id: 'cinque-terre',
        title: 'Colors of Cinque Terre',
        country: 'Italy',
        city: 'Cinque Terre',
        coordinates: [44.1461, 9.6439],
        coverImage: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=1200',
        date: 'JUL 04, 2023',
        category: 'Coastal',
        sections: [
            {
                heading: 'Hiking the Azure Trail',
                content: 'Hiking the Azure Trail between the five famous villages of the Italian Riviera. The path winds along cliffsides with views that stop you in your tracks — turquoise water crashing against ancient rocks, pastel houses stacked like a painter\'s palette, and lemon groves perfuming the salty air.',
                image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800'
            },
            {
                heading: 'Manarola at Golden Hour',
                content: 'As the sun dips toward the Ligurian Sea, Manarola transforms. The colorful houses glow warm against the deepening blue sky, fishing boats rock gently in the tiny harbor, and the locals gather at the waterfront bar for aperitivo. This is Italy at its most magical.',
                image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800'
            },
            {
                heading: 'Vernazza\'s Hidden Beach',
                content: 'Tucked below the main piazza, Vernazza\'s small beach feels like a secret. We spread towels on the rocks, swam in impossibly clear water, and watched the medieval tower cast long shadows across the harbor. The simplest pleasures, elevated by extraordinary beauty.'
            }
        ]
    },
    {
        id: 'florence-art',
        title: 'Art & Aperitivo in Florence',
        country: 'Italy',
        city: 'Florence',
        coordinates: [43.7696, 11.2558],
        coverImage: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=1200',
        date: 'JUN 20, 2023',
        category: 'Art',
        sections: [
            {
                heading: 'The Uffizi Gallery',
                content: 'Botticelli\'s Birth of Venus stopped us in our tracks. In a gallery filled with masterpieces, she commands the room — ethereal, timeless, impossibly beautiful. We spent four hours in the Uffizi and barely scratched the surface of one of the world\'s greatest art collections.',
                image: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800'
            },
            {
                heading: 'Sunset from Piazzale Michelangelo',
                content: 'The panoramic view of Florence at golden hour is the stuff of postcards — the red dome of the Duomo, the Arno glinting below, the Tuscan hills rolling into the distance. We sat on the steps with aperol spritzes and watched the sky turn from gold to pink to purple.'
            }
        ]
    }
];
