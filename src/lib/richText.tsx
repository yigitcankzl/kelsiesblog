import { type ReactNode } from 'react';

/**
 * Lightweight inline-markdown renderer.
 * Supports: **bold**, *italic*, [text](url), and bare URLs.
 */
export function renderRichText(text: string): ReactNode[] {
    const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|(https?:\/\/[^\s<]+)/g;

    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        if (match[1] && match[2]) {
            parts.push(
                <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--neon-cyan)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    {match[1]}
                </a>
            );
        } else if (match[3]) {
            parts.push(<strong key={match.index} style={{ color: '#fff' }}>{match[3]}</strong>);
        } else if (match[4]) {
            parts.push(<em key={match.index}>{match[4]}</em>);
        } else if (match[5]) {
            parts.push(
                <a key={match.index} href={match[5]} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--neon-cyan)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    {match[5]}
                </a>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length ? parts : [text];
}

/** Returns true when text contains any markdown formatting tokens. */
export function hasFormatting(text: string): boolean {
    return /\*\*.+?\*\*|\*.+?\*|\[.+?\]\(https?:\/\/.+?\)|https?:\/\/\S+/.test(text);
}
