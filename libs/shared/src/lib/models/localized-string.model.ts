/**
 * A string that may be localized per language code, or a plain string for
 * legacy/unlocalized content. Use `LocalizePipe` (`sharedLocalize`) in
 * templates or {@link resolveLocalizedString} in component code to resolve
 * either shape against the current UI language.
 *
 * @example
 *   const a: LocalizedString = 'Sales by region';
 *   const b: LocalizedString = { en: 'Sales by region', fr: 'Ventes par région', uk: '...' };
 */
export type LocalizedString = string | Partial<Record<string, string>>;

/** Locale used when the value is missing the active language. */
export const DEFAULT_FALLBACK_LOCALE = 'en';

/**
 * Resolve a {@link LocalizedString} to the best string for `locale`, with
 * fallback to English and then to the first non-empty entry. Returns the
 * value as-is when it is a plain string.
 *
 * @param value Plain string or per-locale map.
 * @param locale Active language code.
 * @param fallbackLocale Locale used when the active one is missing.
 * @returns Resolved string for the active language, or empty string.
 */
export function resolveLocalizedString(
  value: LocalizedString | null | undefined,
  locale: string | null | undefined,
  fallbackLocale: string = DEFAULT_FALLBACK_LOCALE
): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const active = locale || fallbackLocale;
  return (
    value[active] ??
    value[fallbackLocale] ??
    Object.values(value).find((v): v is string => !!v) ??
    ''
  );
}
