/** Interface for the data from a geospatial question */
export interface GeoProperties {
  coordinates: { lat: number; lng: number };
  city: string;
  countryName: string;
  countryCode: string;
  district: string;
  region: string;
  street: string;
  subRegion: string;
  address: string;
}
