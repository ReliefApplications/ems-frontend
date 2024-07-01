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
import getCurrentYearAids from './getCurrentYearAids';
import todayDate from './todayDate';
import startsWith from './startsWith';
import endsWith from './endsWith';
import replace from './replace';
import regexReplace from './regexReplace';
import round from './round';
import parseJSON from './parseJSON';
import once from './once';
import formatDateTime from './formatDateTime';
import join from './join';
import concat from './concat';
import indexedRepeat from './indexedRepeat';
import string from './string';
import sumElements from './sumElements';
import maxElements from './maxElements';
import minElements from './minElements';
import regex from './regex';
import int from './int';
import selected from './selected';

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
  { fn: formatDateTime, name: 'formatDateTime' },
  { fn: getLoadedRecord, name: 'getLoadedRecord' },
  { fn: getListByProp, name: 'getListByProp' },
  { fn: filter, name: 'filter' },
  { fn: sum, name: 'sum' },
  { fn: todayDate, name: 'todayDate' },
  { fn: startsWith, name: 'startsWith' },
  { fn: endsWith, name: 'endsWith' },
  { fn: replace, name: 'replace' },
  { fn: regexReplace, name: 'regexReplace' },
  { fn: round, name: 'round' },
  { fn: parseJSON, name: 'parseJSON' },
  { fn: once, name: 'once' },
  { fn: join, name: 'join' },
  { fn: concat, name: 'concat' },
  { fn: indexedRepeat, name: 'indexedRepeat' },
  { fn: string, name: 'string' },
  { fn: sumElements, name: 'sumElements' },
  { fn: maxElements, name: 'maxElements' },
  { fn: minElements, name: 'minElements' },
  { fn: regex, name: 'regex' },
  { fn: int, name: 'int' },
  { fn: selected, name: 'selected' },
];

/** Generators for each async custom function available  */
export const asyncFunctions = [
  { fn: getComplaintsByType, name: 'getComplaintsByType' },
  { fn: getCurrentYearAids, name: 'getCurrentYearAids' },
];
