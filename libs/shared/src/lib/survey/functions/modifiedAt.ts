import { GlobalOptions } from '../types';

/**
 *  Generator for the custom function modifiedAt.
 *
 * @param options Global options
 * @returns The custom function modifiedAt
 */
export default (options: GlobalOptions) => {
  const record = options.record;

  /** @returns when the record was modified, or now if it's a new one */
  const modifiedAt = () =>
    record ? new Date(Number(record.modifiedAt) || '') : new Date();
  return modifiedAt;
};
