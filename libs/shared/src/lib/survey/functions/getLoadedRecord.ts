import { SurveyModel } from 'survey-core';
import { GlobalOptions } from '../types';

/**
 * Gets a record by id if loaded into cache.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params params passed to the function
 * @returns The list of rows that have that value in the column.
 */
function getLoadedRecord(this: { survey: SurveyModel }, params: any[]) {
  // id of the record to load and the element to get, if any
  const [record, element] = params;
  if (typeof record !== 'string') {
    return null;
  }
  const rec = this.survey?.loadedRecords?.get(record);
  if (!rec) {
    return null;
  }

  return element ? rec.data[element] : rec.data;
}

/**
 *  Generator for the custom function getLoadedRecord.
 *
 * @param _ Global options
 * @returns The custom function getLoadedRecord
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getLoadedRecord;
