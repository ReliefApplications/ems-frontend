/**
 * Calculates the great-circle distance between two points on Earth given their longitudes and latitudes.
 *
 * @param lat1 - Latitude of first point in degrees.
 * @param lon1 - Longitude of first point in degrees.
 * @param lat2 - Latitude of second point in degrees.
 * @param lon2 - Longitude of second point in degrees.
 * @returns The great-circle distance between the two points in km.
 */
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const earthRadius = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const deltaLat = toRad(lat2 - lat1);
  const deltaLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};
