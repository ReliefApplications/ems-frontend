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

/**
 * Convert an i18n/Angular language code to the matching SurveyJS locale code.
 *
 * @param lang The i18n/Angular language code
 * @returns The equivalent SurveyJS locale code (unchanged when there is no mismatch)
 */
export const toSurveyLocale = (lang: string): string =>
  I18N_TO_SURVEY_LOCALE[lang] ?? lang;

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
