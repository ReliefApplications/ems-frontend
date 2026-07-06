import { TranslateService } from '@ngx-translate/core';
import { startCase } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  /** DisplayNames class */
  class DisplayNames {
    /**
     * Constructor of the DisplayNames class
     *
     * @param locales The language to use
     * @param options The options
     */
    constructor(locales?: string | string[], options?: any);

    /**
     * Get the native name of a language
     *
     * @param lang The language code
     * @returns The native name of the language
     */
    public of: (lang: string) => string;
  }
}

/**
 * Mapping of i18n/Angular language codes (ISO 639-1) to their SurveyJS locale
 * equivalents, for the codes where the two libraries disagree. SurveyJS uses a
 * few non-standard codes (checked against survey-core's locale list):
 * - Ukrainian: 'uk' (Angular) vs 'ua' (SurveyJS)
 * - Greek: 'el' vs 'gr'
 * - Serbian: 'sr' vs 'rs'
 * - Telugu: 'te' vs 'tel'
 */
const I18N_TO_SURVEY_LOCALE: Record<string, string> = {
  uk: 'ua',
  el: 'gr',
  sr: 'rs',
  te: 'tel',
};

/** Reverse of {@link I18N_TO_SURVEY_LOCALE}: SurveyJS locale to i18n/Angular code. */
const SURVEY_TO_I18N_LOCALE: Record<string, string> = Object.keys(
  I18N_TO_SURVEY_LOCALE
).reduce((acc, i18n) => {
  acc[I18N_TO_SURVEY_LOCALE[i18n]] = i18n;
  return acc;
}, {} as Record<string, string>);

/**
 * Convert an i18n/Angular language code to the matching SurveyJS locale code.
 *
 * @param lang The i18n/Angular language code
 * @returns The equivalent SurveyJS locale code (unchanged when there is no mismatch)
 */
export const toSurveyLocale = (lang: string): string =>
  I18N_TO_SURVEY_LOCALE[lang] ?? lang;

/**
 * Convert a SurveyJS locale code to the matching i18n/Angular language code.
 *
 * @param locale The SurveyJS locale code
 * @returns The equivalent i18n/Angular code (unchanged when there is no mismatch)
 */
export const toI18nLocale = (locale: string): string =>
  SURVEY_TO_I18N_LOCALE[locale] ?? locale;

/**
 * Candidate locale codes to try when resolving localized content, accounting
 * for the cases where i18n/Angular and SurveyJS disagree on the code (e.g.
 * Angular 'uk' vs SurveyJS 'ua'). Returns the given code first, then its
 * cross-library alias, de-duplicated and ignoring empty values.
 *
 * @param locale The active locale code, in either convention
 * @returns Ordered, de-duplicated list of codes to look up
 */
export const localeAliases = (locale: string | null | undefined): string[] => {
  if (!locale) return [];
  const candidates = [locale, toSurveyLocale(locale), toI18nLocale(locale)];
  return candidates.filter((code, i) => code && candidates.indexOf(code) === i);
};

/**
 * Get the full native name of a language from its code
 *
 * @param lang The code of the language we want the name of
 * @returns The language native name
 */
export const getLanguageNativeName = (lang: string): string => {
  try {
    // try to get names for the asking language
    const displayName = new Intl.DisplayNames(lang, { type: 'language' });
    return startCase(displayName.of(lang)) || lang;
  } catch {
    // if lang argument is not a language code
    return lang;
  }
};

/**
 * Get the full name of a language in the current language of the user
 *
 * @param lang The code of the language we want the name of
 * @param translate The translate service
 * @returns The language name
 */
export const getLanguageName = (lang: string, translate: TranslateService) => {
  try {
    // try to get names for the asking language
    const displayLang = translate.currentLang || translate.defaultLang;
    const displayName = new Intl.DisplayNames(displayLang, {
      type: 'language',
    });
    return startCase(displayName.of(lang)) || lang;
  } catch {
    // if lang argument is not a language code
    return lang;
  }
};
