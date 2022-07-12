/**
 * Remove null values from a record.
 *
 * @param record record to clean
 * @returns record without null values
 */
export const cleanRecord = (record: any): any => {
  const entries = Object.entries(record).filter(([, value]) => value !== null);
  return entries.reduce((o, [key, value]) => ({ ...o, [key]: value }), {});
};
