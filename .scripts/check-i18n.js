const enJson = require('../projects/safe/src/i18n/en.json');
const fs = require('fs');

/** Default value that will be used as key in test translation file. */
const DEFAULT_VALUE = '******';

/**
 * Sort a JSON object by its keys. (Array are not available)
 *
 * @param {*} json json to sort
 * @returns sorted by keys json
 */
const sortJson = (json) => {
  const sortedJson = {};
  const keys = Object.keys(json).sort();
  for (const key of keys) {
    if (typeof json[key] === 'object') {
      sortedJson[key] = sortJson(json[key]);
    } else {
      sortedJson[key] = json[key];
    }
  }
  return sortedJson;
};

/**
 * Writes in a new JSON default value for each key.
 *
 * @param {*} json json to copy
 * @param {*} defaultValue default value to apply
 * @returns new json
 */
const setDefaultValue = (json, defaultValue) => {
  const newJson = { ...json };
  for (const key of Object.keys(json)) {
    if (typeof newJson[key] === 'string') {
      newJson[key] = defaultValue;
    } else {
      newJson[key] = setDefaultValue(newJson[key], defaultValue);
    }
  }
  return newJson;
};

// Check that translation files are sorted.
// console.log(enJson);
const sortedEnJson = sortJson(enJson);
// console.log(sortedEnJson);
fs.writeFile(
  'projects/safe/src/i18n/en.json',
  JSON.stringify(sortedEnJson, null, '\t'),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    // else success
  }
);

// Update the i18n test file.
const testJson = setDefaultValue(enJson, DEFAULT_VALUE);

fs.writeFile(
  'projects/safe/src/i18n/test.json',
  JSON.stringify(testJson, null, '\t'),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    // else success
  }
);
