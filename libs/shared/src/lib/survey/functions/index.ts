import addDays from './addDays';
import getMatrixTitles from './getMatrixTitles';
import getPrescriptionInfo from './getPrescriptionInfo';
import intersect from './intersect';
import length from './length';
import listColsForRows from './listColsForRows';
import listRowsWithColValue from './listRowsWithColValue';
import addTime from './addTime';
import nl2br from './nl2br';
import weekday from './weekday';
import getField from './getField';
import elementAt from './elementAt';
import getWorkflowContext from './getWorkflowContext';
import summarizeAids from './summarizeAids';
import push from './push';
import getComplaintsByType from './getComplaintsByType';
import getNumberOfMembers from './getNumberOfMembers';
import formatDate from './formatDate';
import getLoadedRecord from './getLoadedRecord';
import getListByProp from './getListByProp';
import filter from './filter';
import sum from './sum';

/** Generators for each custom function available  */
export const functions = [
  { fn: getPrescriptionInfo, name: 'getPrescriptionInfo' },
  { fn: getWorkflowContext, name: 'getWorkflowContext' },
  { fn: getField, name: 'getField' },
  { fn: elementAt, name: 'elementAt' },
  { fn: weekday, name: 'weekday' },
  { fn: addDays, name: 'addDays' },
  { fn: listRowsWithColValue, name: 'listRowsWithColValue' },
  { fn: listColsForRows, name: 'listColsForRows' },
  { fn: nl2br, name: 'nl2br' },
  { fn: getMatrixTitles, name: 'getMatrixTitles' },
  { fn: length, name: 'length' },
  { fn: intersect, name: 'intersect' },
  { fn: addTime, name: 'addTime' },
  { fn: summarizeAids, name: 'summarizeAids' },
  { fn: push, name: 'push' },
  { fn: getNumberOfMembers, name: 'getNumberOfMembers' },
  { fn: formatDate, name: 'formatDate' },
  { fn: getLoadedRecord, name: 'getLoadedRecord' },
  { fn: getListByProp, name: 'getListByProp' },
  { fn: filter, name: 'filter' },
  { fn: sum, name: 'sum' },
];

/** Generators for each async custom function available  */
export const asyncFunctions = [
  { fn: getComplaintsByType, name: 'getComplaintsByType' },
];
