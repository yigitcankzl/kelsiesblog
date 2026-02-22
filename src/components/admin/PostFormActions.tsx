import { Save } from 'lucide-react';
import { FONT } from '@/lib/constants';

interface PostFormActionsProps {
    isValid: boolean;
    isEditing: boolean;
    showPreview: boolean;
    onCancel: () => void;
    onTogglePreview: () => void;
}

export default function PostFormActions({
    isValid, isEditing, showPreview, onCancel, onTogglePreview,
}: PostFormActionsProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
            <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer"
                style={{
                    ...FONT,
                    fontSize: '8px',
                    padding: '12px 20px',
                    background: 'none',
                    border: '1px solid #333',
                    color: '#555',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#888'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }}
            >
                CANCEL
            </button>
            <button
                type="button"
                onClick={onTogglePreview}
                className="cursor-pointer"
                style={{
                    ...FONT,
                    fontSize: '8px',
                    padding: '12px 20px',
                    background: 'none',
                    border: '1px solid',
                    borderColor: showPreview ? 'var(--neon-cyan)' : '#333',
                    color: showPreview ? 'var(--neon-cyan)' : '#555',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s',
                    boxShadow: showPreview ? '0 0 8px rgba(0, 255, 255, 0.2)' : 'none',
                }}
                onMouseEnter={e => {
                    if (!showPreview) { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }
                }}
                onMouseLeave={e => {
                    if (!showPreview) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }
                }}
            >
                {showPreview ? 'HIDE PREVIEW' : 'PREVIEW'}
            </button>
            <button
                type="submit"
                disabled={!isValid}
                className="cursor-pointer"
                style={{
                    ...FONT,
                    fontSize: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isValid ? 'var(--brand)' : '#1a1a1a',
                    color: isValid ? '#000' : '#444',
                    border: 'none',
                    padding: '12px 24px',
                    letterSpacing: '0.1em',
                    boxShadow: isValid ? '0 0 15px rgba(0, 255, 65, 0.3)' : 'none',
                    transition: 'all 0.3s',
                    cursor: isValid ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={e => { if (isValid) e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 65, 0.5)'; }}
                onMouseLeave={e => { if (isValid) e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.3)'; }}
            >
                <Save style={{ width: '14px', height: '14px' }} />
                {isEditing ? 'UPDATE' : 'PUBLISH'}
            </button>
        </div>
    );
}
