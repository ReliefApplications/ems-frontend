import { GlobalOptions } from '../types';

/**
 *  Generator for the custom function createdAt.
 *
 * @param options Global options
 * @returns The custom function createdAt
 */
export default (options: GlobalOptions) => {
  const record = options.record;

  /** @returns when the record was created, or now if it's a new one */
  const createdAt = () =>
    record ? new Date(Number(record.createdAt) || '') : new Date();
  return createdAt;
};
