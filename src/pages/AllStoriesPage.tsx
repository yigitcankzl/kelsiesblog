import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useBlogStore } from '@/store/store';
import { estimateReadTime, type BlogPost } from '@/types';
import { FONT } from '@/lib/constants';
import CategoryFilter from '@/components/shared/CategoryFilter';

export default function AllStoriesPage() {
    const { posts, setSelectedCountry, setSelectedPost, setActivePage } = useBlogStore();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredPosts = activeCategory
        ? posts.filter(p =>
            p.category.includes(activeCategory) ||
            (activeCategory === 'Food and Drink' && p.category.includes('Food'))
        )
        : posts;

    const grouped = filteredPosts.reduce<Record<string, BlogPost[]>>((acc, post) => {
        if (!acc[post.country]) acc[post.country] = [];
        acc[post.country].push(post);
        return acc;
    }, {});

    const handlePostClick = (post: BlogPost) => {
        setActivePage('map');
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    return (
        <section className="bg-black min-h-screen pb-16 pt-[100px]">
            <div className="max-w-screen-lg mx-auto px-6">
                {/* Header row */}
                <PageHeader
                    onBack={() => setActivePage('map')}
                    title="ALL STORIES"
                    subtitle={<>
                        <span style={{ color: 'var(--neon-cyan)' }}>{filteredPosts.length}</span>
                        <span style={{ color: '#555' }}> {filteredPosts.length === 1 ? 'STORY' : 'STORIES'}</span>
                    </>}
                />

                {/* Category filters */}
                <div className="mb-8">
                    <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                </div>

                {/* Posts grouped by country */}
                <div className="flex flex-col gap-10">
                    {Object.entries(grouped).map(([country, countryPosts]) => (
                        <motion.div
                            key={country}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Country header */}
                            <div className="flex items-center gap-2.5 mb-5">
                                <MapPin className="w-3 h-3 text-[var(--brand)]" />
                                <h2 style={{ ...FONT, fontSize: '12px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    {country}
                                </h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-[#333] to-transparent" />
                                <span style={{ ...FONT, fontSize: '8px', color: '#444' }}>
                                    {countryPosts.length} {countryPosts.length === 1 ? 'ENTRY' : 'ENTRIES'}
                                </span>
                            </div>

                            {/* Post cards - adjusted to single column stack */}
                            <div className="flex flex-col gap-6">
                                {countryPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.06, duration: 0.4 }}
                                        onClick={() => handlePostClick(post)}
                                        className="group cursor-pointer flex flex-col sm:flex-row gap-6 items-start transition-transform duration-500"
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        {/* Image - reduced size and fixed width on desktop */}
                                        <div className="retro-corners hover-glitch w-full sm:w-48 md:w-64 shrink-0 relative overflow-hidden aspect-[4/3]"
                                            style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                            <span className="rc-extra absolute inset-0" />
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700"
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>

                                        {/* Content side */}
                                        <div className="flex-1 min-w-0">
                                            {/* Meta */}
                                            <div className="flex items-center gap-2.5 mb-2 uppercase tracking-wide"
                                                style={{ ...FONT, fontSize: '7px' }}>
                                                <span style={{ color: 'var(--neon-cyan)' }}>{post.date}</span>
                                                <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                                                <span className="flex items-center gap-1 text-[#555]">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {estimateReadTime(post.sections)} MIN
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3
                                                className="text-glitch"
                                                data-text={post.title}
                                                style={{
                                                    ...FONT,
                                                    fontSize: '11px',
                                                    color: '#fff',
                                                    marginBottom: '8px',
                                                    lineHeight: '1.8',
                                                    transition: 'color 0.3s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
                                            >
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p style={{
                                                ...FONT,
                                                fontSize: '8px',
                                                color: '#666',
                                                lineHeight: '2.2',
                                                marginBottom: '10px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {post.sections[0]?.content?.substring(0, 120)}...
                                            </p>

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {post.category.map(cat => (
                                                    <span key={cat} style={{
                                                        ...FONT,
                                                        fontSize: '5px',
                                                        padding: '4px 8px',
                                                        border: '1px solid #333',
                                                        color: '#555',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em',
                                                    }}>
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 style={{ ...FONT, fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                            NO STORIES FOUND
                        </h3>
                        <p style={{ ...FONT, fontSize: '9px', color: '#444', lineHeight: '2' }}>
                            {'>'} TRY A DIFFERENT CATEGORY_
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
