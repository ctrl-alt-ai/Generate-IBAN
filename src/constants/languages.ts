/**
 * Shared language constants to avoid duplication across the codebase
 */
export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de'] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];