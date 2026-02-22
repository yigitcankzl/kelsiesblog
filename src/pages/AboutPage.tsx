import { motion } from 'framer-motion';
import { MapPin, Globe, Camera, Plane, Instagram, Twitter, Mail, Github, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useBlogStore } from '@/store/store';
import { FONT } from '@/lib/constants';

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
        <section className="bg-black min-h-screen pb-16 pt-[100px]">
            <div className="max-w-screen-lg mx-auto px-6">
                {/* Header */}
                <PageHeader
                    onBack={() => setActivePage('map')}
                    title="ABOUT ME"
                    subtitle={<>
                        <span style={{ color: 'var(--neon-cyan)' }}>PLAYER PROFILE</span>
                        <span style={{ color: '#555' }}> // LOADED</span>
                    </>}
                />

                {/* Main content */}
                <div className="grid grid-cols-1 gap-8">

                    {/* Bio section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="retro-corners relative p-8 border border-[#1a1a1a]"
                        style={{
                            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                            boxShadow: '0 0 20px rgba(0, 255, 65, 0.05)',
                        }}
                    >
                        <span className="rc-extra absolute inset-0" />

                        {/* Terminal-style header */}
                        <div className="flex items-center gap-2 mb-6">
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand)', boxShadow: '0 0 8px rgba(0,255,65,0.5)' }} />
                            <span style={{ ...FONT, fontSize: '10px', color: 'var(--neon-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                ▸ PLAYER.BIO
                            </span>
                        </div>

                        <h2 style={{ ...FONT, fontSize: '18px', color: '#fff', marginBottom: '20px', lineHeight: 1.8 }}>
                            Hey, I'm <span style={{ color: 'var(--brand)', textShadow: '0 0 10px rgba(0,255,65,0.4)' }}>{aboutContent.name}</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            <p style={{
                                ...FONT,
                                fontSize: '11px',
                                color: '#999',
                                lineHeight: '2.4',
                                borderLeft: '2px solid var(--brand)',
                                paddingLeft: '16px',
                            }}>
                                {aboutContent.bio1}
                            </p>

                            <p style={{
                                ...FONT,
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
                        className="grid grid-cols-3 gap-4"
                    >
                        {[
                            { icon: Globe, label: 'COUNTRIES', value: countriesVisited, color: 'var(--brand)' },
                            { icon: Camera, label: 'STORIES', value: totalPosts, color: 'var(--neon-cyan)' },
                            { icon: Plane, label: 'STATUS', value: 'ACTIVE', color: 'var(--neon-amber)' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="retro-corners relative p-6 border border-[#1a1a1a] bg-[#0a0a0a] text-center"
                                style={{ boxShadow: `0 0 12px ${stat.color}15` }}
                            >
                                <span className="rc-extra absolute inset-0" />
                                <stat.icon style={{
                                    width: '20px',
                                    height: '20px',
                                    color: stat.color,
                                    margin: '0 auto 12px',
                                    filter: `drop-shadow(0 0 6px ${stat.color})`,
                                }} />
                                <p style={{
                                    ...FONT,
                                    fontSize: typeof stat.value === 'number' ? '22px' : '13px',
                                    color: stat.color,
                                    textShadow: `0 0 10px ${stat.color}`,
                                    marginBottom: '8px',
                                }}>
                                    {stat.value}
                                </p>
                                <p style={{ ...FONT, fontSize: '9px', color: '#555', letterSpacing: '0.15em' }}>
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
                        className="retro-corners relative p-8 border border-[#1a1a1a]"
                        style={{
                            background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.05)',
                        }}
                    >
                        <span className="rc-extra absolute inset-0" />

                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" style={{ boxShadow: '0 0 8px rgba(0,255,255,0.5)' }} />
                            <span className="uppercase tracking-wider text-[var(--neon-amber)]" style={{ ...FONT, fontSize: '10px' }}>
                                ▸ QUEST.LOG
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {aboutContent.quests.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                                    className="p-4 border-l-2 border-l-[var(--brand)] border-b border-b-[#1a1a1a]"
                                >
                                    <p style={{ ...FONT, fontSize: '11px', color: '#fff', marginBottom: '8px' }}>
                                        {item.title}
                                    </p>
                                    <p style={{ ...FONT, fontSize: '9px', color: '#666', lineHeight: '2', letterSpacing: '0.05em' }}>
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
                            className="retro-corners relative p-8 border border-[#1a1a1a]"
                            style={{
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                                boxShadow: '0 0 20px rgba(255, 0, 128, 0.05)',
                            }}
                        >
                            <span className="rc-extra absolute inset-0 pointer-events-none" />

                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-2 rounded-full bg-[var(--neon-magenta,#ff0080)]" style={{ boxShadow: '0 0 8px rgba(255,0,128,0.5)' }} />
                                <span className="uppercase tracking-wider text-[var(--neon-amber)]" style={{ ...FONT, fontSize: '10px' }}>
                                    ▸ SOCIAL.LINKS
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
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
                                            className="flex items-center gap-2.5 px-5 py-3.5 border border-[#222] bg-[#0a0a0a] text-[#999] no-underline transition-all duration-300 cursor-pointer"
                                            whileHover={{
                                                borderColor: 'var(--brand)',
                                                color: '#fff',
                                                boxShadow: '0 0 16px rgba(0,255,65,0.15)',
                                            }}
                                        >
                                            <IconComponent className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
                                            <span style={{ ...FONT, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
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
                        className="text-center py-10"
                    >
                        <p style={{ ...FONT, fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '20px' }}>
                            ◂ READY TO EXPLORE? ▸
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button
                                onClick={() => setActivePage('map')}
                                className="cursor-pointer flex items-center gap-2 px-5 py-3 border-2 border-[var(--brand)] bg-transparent text-[var(--brand)] tracking-wide transition-all duration-300"
                                style={{ ...FONT, fontSize: '10px', boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)' }}
                            >
                                <MapPin className="w-3 h-3" />
                                VIEW MAP
                            </button>
                            <button
                                onClick={() => setActivePage('stories')}
                                className="cursor-pointer flex items-center gap-2 px-5 py-3 border-2 border-[var(--neon-cyan)] bg-transparent text-[var(--neon-cyan)] tracking-wide transition-all duration-300"
                                style={{ ...FONT, fontSize: '10px', boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)' }}
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
