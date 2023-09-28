import { GlobalOptions } from '../types';

/**
 *  Generator for the custom function createdBy.
 *
 * @param options Global options
 * @returns The custom function createdBy
 */
export default (options: GlobalOptions) => {
  const { record, authService } = options;

  /** @returns who created the record, or current user if new record */
  const createdBy = () => {
    if (record) {
      return record.createdBy?.name || '';
    } else {
      return authService.userValue?.name || '';
    }
  };
  return createdBy;
};
