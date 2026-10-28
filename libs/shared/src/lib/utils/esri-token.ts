/**
 * Whether a URL points to an Esri ArcGIS Online host, over https.
 * The shared ArcGIS API key must only ever be sent to those hosts: web maps can
 * reference layers and styles hosted anywhere, and the key would otherwise leak
 * to (and be billed on behalf of) whoever controls that host.
 *
 * @param url url to check
 * @returns true when the key may be sent to this url
 */
export const isArcgisHost = (url: string | null | undefined): boolean => {
  if (!url) {
    return false;
  }
  try {
    const { protocol, hostname } = new URL(url);
    return (
      protocol === 'https:' &&
      (hostname === 'arcgis.com' || hostname.endsWith('.arcgis.com'))
    );
  } catch {
    return false;
  }
};

/**
 * Gets the ArcGIS API key to pass as `token` option of an esri-leaflet layer.
 *
 * @param url url of the layer
 * @param apiKey shared ArcGIS API key
 * @returns the key for ArcGIS Online hosts, undefined otherwise
 */
export const esriTokenFor = (
  url: string | null | undefined,
  apiKey: string
): string | undefined => (isArcgisHost(url) ? apiKey : undefined);

/**
 * Appends the ArcGIS API key as `token` query parameter, only for ArcGIS Online hosts.
 *
 * @param url url to request
 * @param apiKey shared ArcGIS API key
 * @returns url to request, with the token when allowed
 */
export const withEsriToken = (url: string, apiKey: string): string => {
  if (!isArcgisHost(url)) {
    return url;
  }
  const parsed = new URL(url);
  parsed.searchParams.set('token', apiKey);
  return parsed.toString();
};
