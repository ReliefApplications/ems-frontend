import addDays from './addDays';
import getAidsGiven from './getAidsGiven';
import getMatrixTitles from './getMatrixTitles';
import getTotalAids from './getTotalAids';
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
import searchEnterpriseName from './searchEnterpriseName';
import push from './push';
import getComplaintsByType from './getComplaintsByType';
import getNumberOfMembers from './getNumberOfMembers';

/** Generators for each custom function available  */
export const functions = [
  { fn: getTotalAids, name: 'getTotalAids' },
  { fn: getWorkflowContext, name: 'getWorkflowContext' },
  { fn: getField, name: 'getField' },
  { fn: elementAt, name: 'elementAt' },
  { fn: weekday, name: 'weekday' },
  { fn: getAidsGiven, name: 'getAidsGiven' },
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
  { fn: getNumberOfMembers, name: 'getNumberOfMembers'}
];

/** Generators for each async custom function available  */
export const asyncFunctions = [
  { fn: searchEnterpriseName, name: 'searchEnterpriseName' },
  { fn: getComplaintsByType, name: 'getComplaintsByType' },
];
