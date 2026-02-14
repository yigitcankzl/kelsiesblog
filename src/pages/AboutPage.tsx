import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Globe, Camera, Plane, Instagram, Twitter, Mail, Github, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import { useBlogStore } from '@/store/store';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    instagram: Instagram,
    twitter: Twitter,
    mail: Mail,
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
};

export default function AboutPage() {
    const { setActivePage, posts, getCountriesWithPosts, aboutContent } = useBlogStore();
    const countriesVisited = getCountriesWithPosts().length;
    const totalPosts = posts.length;

    return (
        <section className="bg-black min-h-screen pb-16" style={{ paddingTop: '100px' }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                {/* Header */}
                <motion.div
                    className="flex items-end gap-6 mb-10"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={() => setActivePage('map')}
                        className="cursor-pointer"
                        style={{
                            ...font,
                            fontSize: '7px',
                            padding: '10px 16px',
                            border: '2px solid var(--brand)',
                            backgroundColor: 'transparent',
                            color: 'var(--brand)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase' as const,
                            boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexShrink: 0,
                        }}
                    >
                        <ArrowLeft style={{ width: '12px', height: '12px' }} />
                        ◂ BACK
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--brand)', opacity: 0.3 }} />
                        <div>
                            <h1 className="text-glitch" style={{ ...font, fontSize: '24px', color: '#fff', lineHeight: 1.4 }}
                                data-text="ABOUT ME">
                                ABOUT ME
                            </h1>
                            <p style={{ ...font, fontSize: '9px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                <span style={{ color: 'var(--neon-cyan)' }}>PLAYER PROFILE</span>
                                <span style={{ color: '#555' }}> // LOADED</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Main content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>

                    {/* Bio section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="retro-corners"
                        style={{
                            position: 'relative',
                            padding: '32px',
                            border: '1px solid #1a1a1a',
                            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                            boxShadow: '0 0 20px rgba(0, 255, 65, 0.05)',
                        }}
                    >
                        <span className="rc-extra" style={{ position: 'absolute', inset: 0 }} />

                        {/* Terminal-style header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand)', boxShadow: '0 0 8px rgba(0,255,65,0.5)' }} />
                            <span style={{ ...font, fontSize: '10px', color: 'var(--neon-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                ▸ PLAYER.BIO
                            </span>
                        </div>

                        <h2 style={{ ...font, fontSize: '18px', color: '#fff', marginBottom: '20px', lineHeight: 1.8 }}>
                            Hey, I'm <span style={{ color: 'var(--brand)', textShadow: '0 0 10px rgba(0,255,65,0.4)' }}>{aboutContent.name}</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{
                                ...font,
                                fontSize: '11px',
                                color: '#999',
                                lineHeight: '2.4',
                                borderLeft: '2px solid var(--brand)',
                                paddingLeft: '16px',
                            }}>
                                {aboutContent.bio1}
                            </p>

                            <p style={{
                                ...font,
                                fontSize: '11px',
                                color: '#777',
                                lineHeight: '2.4',
                                borderLeft: '2px solid var(--neon-cyan)',
                                paddingLeft: '16px',
                            }}>
                                {aboutContent.bio2}
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
                    >
                        {[
                            { icon: Globe, label: 'COUNTRIES', value: countriesVisited, color: 'var(--brand)' },
                            { icon: Camera, label: 'STORIES', value: totalPosts, color: 'var(--neon-cyan)' },
                            { icon: Plane, label: 'STATUS', value: 'ACTIVE', color: 'var(--neon-amber)' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="retro-corners"
                                style={{
                                    position: 'relative',
                                    padding: '24px',
                                    border: '1px solid #1a1a1a',
                                    background: '#0a0a0a',
                                    textAlign: 'center',
                                    boxShadow: `0 0 12px ${stat.color}15`,
                                }}
                            >
                                <span className="rc-extra" style={{ position: 'absolute', inset: 0 }} />
                                <stat.icon style={{
                                    width: '20px',
                                    height: '20px',
                                    color: stat.color,
                                    margin: '0 auto 12px',
                                    filter: `drop-shadow(0 0 6px ${stat.color})`,
                                }} />
                                <p style={{
                                    ...font,
                                    fontSize: typeof stat.value === 'number' ? '22px' : '13px',
                                    color: stat.color,
                                    textShadow: `0 0 10px ${stat.color}`,
                                    marginBottom: '8px',
                                }}>
                                    {stat.value}
                                </p>
                                <p style={{ ...font, fontSize: '9px', color: '#555', letterSpacing: '0.15em' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Quest log / What I do */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="retro-corners"
                        style={{
                            position: 'relative',
                            padding: '32px',
                            border: '1px solid #1a1a1a',
                            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.05)',
                        }}
                    >
                        <span className="rc-extra" style={{ position: 'absolute', inset: 0 }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--neon-cyan)', boxShadow: '0 0 8px rgba(0,255,255,0.5)' }} />
                            <span style={{ ...font, fontSize: '10px', color: 'var(--neon-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                ▸ QUEST.LOG
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {aboutContent.quests.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                                    style={{
                                        padding: '16px',
                                        borderLeft: '2px solid var(--brand)',
                                        borderBottom: '1px solid #1a1a1a',
                                    }}
                                >
                                    <p style={{ ...font, fontSize: '11px', color: '#fff', marginBottom: '8px' }}>
                                        {item.title}
                                    </p>
                                    <p style={{ ...font, fontSize: '9px', color: '#666', lineHeight: '2', letterSpacing: '0.05em' }}>
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Social / Contact */}
                    {aboutContent.socials.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.4 }}
                            className="retro-corners"
                            style={{
                                position: 'relative',
                                padding: '32px',
                                border: '1px solid #1a1a1a',
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                                boxShadow: '0 0 20px rgba(255, 0, 128, 0.05)',
                            }}
                        >
                            <span className="rc-extra" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--neon-magenta, #ff0080)', boxShadow: '0 0 8px rgba(255,0,128,0.5)' }} />
                                <span style={{ ...font, fontSize: '10px', color: 'var(--neon-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                    ▸ SOCIAL.LINKS
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {aboutContent.socials.map((social, i) => {
                                    const IconComponent = iconMap[social.icon] || ExternalLink;
                                    return (
                                        <motion.a
                                            key={social.label}
                                            href={social.url}
                                            target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.45 + i * 0.08, duration: 0.3 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '14px 20px',
                                                border: '1px solid #222',
                                                backgroundColor: '#0a0a0a',
                                                color: '#999',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                            }}
                                            whileHover={{
                                                borderColor: 'var(--brand)',
                                                color: '#fff',
                                                boxShadow: '0 0 16px rgba(0,255,65,0.15)',
                                            }}
                                        >
                                            <IconComponent style={{ width: '14px', height: '14px', color: 'var(--brand)', flexShrink: 0 }} />
                                            <span style={{ ...font, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                                {social.label}
                                            </span>
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        style={{ textAlign: 'center', padding: '40px 0' }}
                    >
                        <p style={{ ...font, fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '20px' }}>
                            ◂ READY TO EXPLORE? ▸
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setActivePage('map')}
                                className="cursor-pointer"
                                style={{
                                    ...font,
                                    fontSize: '10px',
                                    padding: '12px 20px',
                                    border: '2px solid var(--brand)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--brand)',
                                    letterSpacing: '0.12em',
                                    boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <MapPin style={{ width: '12px', height: '12px' }} />
                                VIEW MAP
                            </button>
                            <button
                                onClick={() => setActivePage('stories')}
                                className="cursor-pointer"
                                style={{
                                    ...font,
                                    fontSize: '10px',
                                    padding: '12px 20px',
                                    border: '2px solid var(--neon-cyan)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--neon-cyan)',
                                    letterSpacing: '0.12em',
                                    boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                READ STORIES
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
