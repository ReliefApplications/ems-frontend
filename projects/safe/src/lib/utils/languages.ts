import { startCase } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  /** DisplayNames class */
  class DisplayNames {
    /**
     * Constructor of display names
     *
     * @param locales The language to use
     * @param options The options
     */
    constructor(locales?: string | string[], options?: any);
    public of: (lang: string) => string;
  }
}

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
