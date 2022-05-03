/**
 * Get the full name of a language from its code
 *
 * @param lang The code of the language we want the name of
 * @returns The language name
 */
export const getLanguageName = (lang: string): string => {
  try {
    // create the displayName object for the language
    const displayName = new (Intl as any).DisplayNames(lang, {
      type: 'language',
    });
    // get the name of the language in the lang of the language
    const langName = displayName.of(lang);
    return toTitleCase(langName);
  } catch {
    // if it is not a language, return the code
    return toTitleCase(lang);
  }
};

/**
 * Convert a word to title case
 *
 * @param text An input word
 * @returns The word in title case
 */
const toTitleCase = (text: string): string =>
  text.charAt(0).toUpperCase() + text.substring(1);
