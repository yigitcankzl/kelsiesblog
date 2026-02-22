import { ArrowLeft } from 'lucide-react';
import { FONT } from '@/lib/constants';

interface BackButtonProps {
    onClick: () => void;
    label?: string;
}

export default function BackButton({ onClick, label = 'BACK' }: BackButtonProps) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer flex items-center gap-2 shrink-0 px-4 py-2.5 border-2 border-[var(--brand)] bg-transparent text-[var(--brand)] uppercase tracking-wide transition-all duration-300"
            style={{ ...FONT, fontSize: '7px', boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)' }}
        >
            <ArrowLeft className="w-3 h-3" />
            &#x25C2; {label}
        </button>
    );
}
