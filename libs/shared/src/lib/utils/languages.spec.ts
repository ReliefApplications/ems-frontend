import { localeAliases, toI18nLocale, toSurveyLocale } from './languages';

describe('languages utility', () => {
  describe('toSurveyLocale', () => {
    it('maps i18n/Angular codes to their SurveyJS equivalents', () => {
      expect(toSurveyLocale('uk')).toBe('ua');
      expect(toSurveyLocale('el')).toBe('gr');
      expect(toSurveyLocale('sr')).toBe('rs');
      expect(toSurveyLocale('te')).toBe('tel');
    });

    it('returns the code unchanged when there is no mismatch', () => {
      expect(toSurveyLocale('en')).toBe('en');
      expect(toSurveyLocale('fr')).toBe('fr');
    });
  });

  describe('toI18nLocale', () => {
    it('maps SurveyJS codes back to their i18n/Angular equivalents', () => {
      expect(toI18nLocale('ua')).toBe('uk');
      expect(toI18nLocale('gr')).toBe('el');
      expect(toI18nLocale('rs')).toBe('sr');
      expect(toI18nLocale('tel')).toBe('te');
    });

    it('returns the code unchanged when there is no mismatch', () => {
      expect(toI18nLocale('en')).toBe('en');
      expect(toI18nLocale('fr')).toBe('fr');
    });

    it('is the inverse of toSurveyLocale for mapped codes', () => {
      expect(toI18nLocale(toSurveyLocale('uk'))).toBe('uk');
    });
  });

  describe('localeAliases', () => {
    it('returns both naming conventions for a mismatched code', () => {
      expect(localeAliases('uk')).toEqual(['uk', 'ua']);
      expect(localeAliases('ua')).toEqual(['ua', 'uk']);
    });

    it('de-duplicates when both conventions agree', () => {
      expect(localeAliases('en')).toEqual(['en']);
    });

    it('returns an empty array for empty/nullish input', () => {
      expect(localeAliases('')).toEqual([]);
      expect(localeAliases(null)).toEqual([]);
      expect(localeAliases(undefined)).toEqual([]);
    });
  });
});
