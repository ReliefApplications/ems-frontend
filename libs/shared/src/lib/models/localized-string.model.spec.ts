import { resolveLocalizedString } from './localized-string.model';

describe('resolveLocalizedString', () => {
  it('returns nullish values as an empty string', () => {
    expect(resolveLocalizedString(null, 'en')).toBe('');
    expect(resolveLocalizedString(undefined, 'en')).toBe('');
  });

  it('returns plain strings as-is', () => {
    expect(resolveLocalizedString('Sales by region', 'fr')).toBe(
      'Sales by region'
    );
  });

  it('resolves a per-locale map against the active locale', () => {
    const value = { en: 'Sales by region', fr: 'Ventes par région' };
    expect(resolveLocalizedString(value, 'fr')).toBe('Ventes par région');
  });

  it('matches the active locale under both naming conventions', () => {
    const value = { en: 'Request received', ua: 'Запит отримано' };
    // Angular 'uk' should resolve the SurveyJS-keyed 'ua' entry.
    expect(resolveLocalizedString(value, 'uk')).toBe('Запит отримано');
  });

  it('prefers the default key over an arbitrary first entry', () => {
    const value = { default: 'New request received', ua: 'Запит отримано' };
    expect(resolveLocalizedString(value, 'fr')).toBe('New request received');
  });

  it('falls back to English when the active locale is missing', () => {
    const value = { en: 'Sales by region', fr: 'Ventes par région' };
    expect(resolveLocalizedString(value, 'de')).toBe('Sales by region');
  });

  it('falls back to the first non-empty entry when nothing else matches', () => {
    const value = { fr: 'Ventes par région' };
    expect(resolveLocalizedString(value, 'de')).toBe('Ventes par région');
  });

  it('uses the fallback locale when the active one is nullish', () => {
    const value = { en: 'Sales by region', fr: 'Ventes par région' };
    expect(resolveLocalizedString(value, null)).toBe('Sales by region');
  });

  it('honors a custom fallback locale', () => {
    const value = { fr: 'Ventes par région', de: 'Umsatz nach Region' };
    expect(resolveLocalizedString(value, null, 'de')).toBe(
      'Umsatz nach Region'
    );
  });

  it('returns an empty string for an empty map', () => {
    expect(resolveLocalizedString({}, 'en')).toBe('');
  });
});
