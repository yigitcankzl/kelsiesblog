import { motion } from 'framer-motion';
import BackButton from './BackButton';
import { FONT } from '@/lib/constants';

interface PageHeaderProps {
    onBack: () => void;
    backLabel?: string;
    title: string;
    subtitle?: React.ReactNode;
}

export default function PageHeader({ onBack, backLabel, title, subtitle }: PageHeaderProps) {
    return (
        <motion.div
            className="flex items-end gap-6 mb-10"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <BackButton onClick={onBack} label={backLabel} />
            <div className="flex items-center gap-4">
                <div className="w-px h-10 bg-[var(--brand)] opacity-30" />
                <div>
                    <h1 className="text-glitch" style={{ ...FONT, fontSize: '18px', color: '#fff', lineHeight: 1.4 }}
                        data-text={title}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p style={{ ...FONT, fontSize: '6px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
