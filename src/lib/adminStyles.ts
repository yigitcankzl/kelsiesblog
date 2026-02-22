import { FONT } from './constants';

export const inputStyle: React.CSSProperties = {
    ...FONT,
    fontSize: '9px',
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    color: 'var(--brand)',
    outline: 'none',
    transition: 'all 0.3s',
    letterSpacing: '0.1em',
};

export const labelStyle: React.CSSProperties = {
    ...FONT,
    fontSize: '7px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
};

export const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical' as const,
    lineHeight: '2.2',
};

export const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--brand)';
    e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 255, 65, 0.15)';
};

export const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#333';
    e.currentTarget.style.boxShadow = 'none';
};
