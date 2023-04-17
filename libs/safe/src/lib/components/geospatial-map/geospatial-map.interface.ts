export interface ReverseGeocodeResult {
  Coordinates: { lat: number; lng: number };
  City: string;
  Country: string;
  District: string;
  Region: string;
  Street: string;
}
