/** The retro pixel font used throughout the UI. */
export const FONT = { fontFamily: "'Press Start 2P', monospace" } as const;

/** Blog post categories. */
export const CATEGORIES = [
    'Culture',
    'History',
    'Tourism',
    'Transportation',
    'Politic',
    'Food and Drink',
    'Personal Story',
] as const;

export type Category = (typeof CATEGORIES)[number];
