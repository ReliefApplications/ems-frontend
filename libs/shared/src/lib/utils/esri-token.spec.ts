import { esriTokenFor, isArcgisHost, withEsriToken } from './esri-token';

/** Fake ArcGIS API key */
const KEY = 'AAPT-test-key';

describe('esri-token (L-01)', () => {
  describe('isArcgisHost', () => {
    it.each([
      'https://www.arcgis.com/sharing/rest/content/items/abc/resources/styles/root.json',
      'https://tiles.arcgis.com/tiles/x/arcgis/rest/services/y/VectorTileServer',
      'https://services.arcgis.com/x/arcgis/rest/services/y/FeatureServer/0',
      'https://arcgis.com/',
    ])('accepts %s', (url) => {
      expect(isArcgisHost(url)).toBe(true);
    });

    const refused: [any, string][] = [
      ['http://www.arcgis.com/style.json', 'plain http'],
      ['https://evil.example/arcgis.com/style.json', 'arcgis.com in the path'],
      ['https://arcgis.com.evil.example/style.json', 'arcgis.com as a prefix'],
      ['https://notarcgis.com/style.json', 'suffix without the dot'],
      [
        'https://gis.who.int/arcgis/rest/services/x/MapServer',
        'other GIS server',
      ],
      ['/relative/style.json', 'relative url'],
      ['not a url', 'garbage'],
      ['', 'empty'],
      [undefined, 'undefined'],
      [null, 'null'],
    ];
    it.each(refused)('refuses %s (%s)', (url) => {
      expect(isArcgisHost(url as any)).toBe(false);
    });
  });

  describe('esriTokenFor', () => {
    it('returns the key for ArcGIS Online layers only', () => {
      expect(
        esriTokenFor('https://services.arcgis.com/x/FeatureServer/0', KEY)
      ).toBe(KEY);
      expect(
        esriTokenFor('https://gis.who.int/arcgis/rest/services/x', KEY)
      ).toBeUndefined();
      expect(esriTokenFor(undefined, KEY)).toBeUndefined();
    });
  });

  describe('withEsriToken', () => {
    it('appends the token to ArcGIS Online urls', () => {
      expect(withEsriToken('https://www.arcgis.com/style.json', KEY)).toBe(
        `https://www.arcgis.com/style.json?token=${KEY}`
      );
    });

    it('keeps existing query parameters', () => {
      expect(
        withEsriToken('https://www.arcgis.com/style.json?f=json', KEY)
      ).toBe(`https://www.arcgis.com/style.json?f=json&token=${KEY}`);
    });

    it('never adds the token to other hosts', () => {
      const url = 'https://gis.who.int/style.json?f=json';
      expect(withEsriToken(url, KEY)).toBe(url);
      expect(withEsriToken(url, KEY)).not.toContain(KEY);
    });
  });
});
