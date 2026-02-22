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
            className="cursor-pointer"
            style={{
                ...FONT,
                fontSize: '7px',
                padding: '10px 16px',
                border: '2px solid var(--brand)',
                backgroundColor: 'transparent',
                color: 'var(--brand)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
            }}
        >
            <ArrowLeft style={{ width: '12px', height: '12px' }} />
            &#x25C2; {label}
        </button>
    );
}
