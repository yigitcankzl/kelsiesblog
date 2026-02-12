import { BlogPost } from '../types';

export const mockPosts: BlogPost[] = [
    {
        id: 'kyoto-temples',
        title: 'Temples & Tea in Kyoto',
        country: 'Japan',
        city: 'Kyoto',
        coordinates: [35.0116, 135.7681],
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
        sections: [
            {
                heading: 'Arriving in Gion',
                content: 'The narrow streets of Gion welcomed us with the soft click of wooden sandals on stone. Geishas — or rather, maiko in training — glided past in flashes of silk and white makeup. The air smelled of incense and grilled mochi, and every corner felt like stepping into a woodblock print come to life.',
                image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800'
            },
            {
                heading: 'The Golden Pavilion',
                content: 'Kinkaku-ji is one of those places that no photograph can truly capture. The pavilion floats above the mirror pond, gilded in actual gold leaf, reflecting a perfect twin of itself in the still water. We arrived early enough to beat the crowds and had a few precious minutes of silence to take it all in.',
                image: 'https://images.unsplash.com/photo-1490761668535-35497054764d?w=800'
            },
            {
                heading: 'A Traditional Tea Ceremony',
                content: 'Our host, Tanaka-san, guided us through every deliberate movement — the rotation of the bowl, the exact angle of the whisk, the mindful sip. In a world of rush, the ceremony was a masterclass in slowing down. The matcha was earthy, slightly bitter, and absolutely perfect with the delicate wagashi sweet.',
            }
        ]
    },
    {
        id: 'tokyo-neon',
        title: 'Neon Nights in Tokyo',
        country: 'Japan',
        city: 'Tokyo',
        coordinates: [35.6762, 139.6503],
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
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
        id: 'rome-eternal',
        title: 'The Eternal City',
        country: 'Italy',
        city: 'Rome',
        coordinates: [41.9028, 12.4964],
        coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
        sections: [
            {
                heading: 'The Colosseum at Dawn',
                content: 'We queued before sunrise and were rewarded with golden light streaming through the ancient arches. Standing in the arena where gladiators once fought, you can almost hear the roar of 50,000 spectators. The scale of Roman ambition is humbling — this was built nearly 2,000 years ago without modern machinery.',
                image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800'
            },
            {
                heading: 'Trastevere by Night',
                content: 'Cobblestone streets, ivy-clad buildings, the warm glow of trattorias spilling onto sidewalks — Trastevere is Rome at its most romantic. We found a tiny restaurant where the pasta was handmade that morning and the house wine was better than anything back home.',
                image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800'
            },
            {
                heading: 'Vatican Museums',
                content: 'Nothing prepares you for the Sistine Chapel. After winding through seemingly endless galleries of Renaissance masterpieces, you enter the chapel and instinctively look up. Michelangelo\'s ceiling is overwhelming — every panel tells a story, every figure pulses with divine energy.'
            }
        ]
    },
    {
        id: 'florence-art',
        title: 'Art & Aperitivo in Florence',
        country: 'Italy',
        city: 'Florence',
        coordinates: [43.7696, 11.2558],
        coverImage: 'https://images.unsplash.com/photo-1543429258-bce5fa4f5f86?w=1200',
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
    },
    {
        id: 'istanbul-crossroads',
        title: 'Where East Meets West',
        country: 'Turkey',
        city: 'Istanbul',
        coordinates: [41.0082, 28.9784],
        coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
        sections: [
            {
                heading: 'Hagia Sophia',
                content: 'Stepping into Hagia Sophia is like entering a dream. The massive dome seems to float above, supported by shafts of golden light streaming through high windows. For nearly 1,500 years, this building has been a cathedral, a mosque, a museum, and now a mosque again — each era leaving its mark on the walls.',
                image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800'
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
    }
];
