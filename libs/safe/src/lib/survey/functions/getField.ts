/**
 * Get field from object
 *
 * @param params Array of parameters (object, field)
 * @returns Field value or null
 */
const getField = (params: any[]) => {
  const object = params[0];
  const field = params[1];

  if (!object || typeof object !== 'object' || Array.isArray(object))
    return null;
  if (!field) return null;

  return object[field] ?? null;
};

export default getField;
