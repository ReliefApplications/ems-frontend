import localForage from 'localforage';

/** Interface for store items with  */
interface ExpiringItem {
  value: any;
  expiry: number;
}

/** Default TTL for cached items  */
const DEFAULT_TTL = 1 * 24 * 3600 * 1000; // 1 day

/**
 * Cache an item with an expiry time.
 *
 * @param key Key used to cache item.
 * @param value Value to cache.
 * @param ttl Number of milliseconds before expiracy. Default is equivalent to 1 day.
 */
export const setWithExpiry = (
  key: string,
  value: any,
  ttl = DEFAULT_TTL
): void => {
  const item: ExpiringItem = {
    value,
    expiry: new Date().getTime() + ttl,
  };
  localForage.setItem(key, item);
};

/**
 * Retrieve an item with expiry time.
 *
 * @param key Key used to cache item.
 * @returns Value cached.
 */
export const getWithExpiry = async (key: string): Promise<null | any> => {
  const item: ExpiringItem | null = await localForage.getItem(key);
  if (item === null) {
    return item;
  }
  if (new Date().getTime() > item.expiry) {
    await localForage.removeItem(key);
    return null;
  }
  return item.value;
};

/**
 * Retrieve the list of keys stored in cache.
 *
 * @returns List of keys.
 */
export const getListOfKeys = async (): Promise<string[]> => localForage.keys();
