import { GlobalOptions } from '../types';

/**
 *  Generator for the custom function id.
 *
 * @param options Global options
 * @returns The custom function id
 */
export default (options: GlobalOptions) => {
  const record = options.record;

  /** @returns the id of the record, if exists or 'unknown id' if in a new record */
  const id = () => (record ? record.id : 'unknown id');

  return id;
};
