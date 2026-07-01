import { localeAliases } from '../utils/languages';

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
 * fallback to the `default` key, then English, then the first non-empty entry.
 * Returns the value as-is when it is a plain string.
 *
 * The active locale is matched against both its i18n/Angular and SurveyJS code
 * (e.g. 'uk' and 'ua'), since per-locale maps may be keyed in either
 * convention depending on where they originate. Some maps also carry an
 * explicit `default` key (e.g. choice metadata shaped like
 * `{ default: 'New request received', ua: '...' }`); it is preferred over the
 * arbitrary first-entry fallback.
 *
 * @param value Plain string or per-locale map.
 * @param locale Active language code, in either i18n/Angular or SurveyJS form.
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
  // Try the active locale under both naming conventions before falling back.
  for (const code of localeAliases(active)) {
    if (value[code] != null) return value[code] as string;
  }
  return (
    value['default'] ??
    value[fallbackLocale] ??
    Object.values(value).find((v): v is string => !!v) ??
    ''
  );
}
