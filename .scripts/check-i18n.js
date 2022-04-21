const enJson = require('../projects/safe/src/i18n/en.json');
const fs = require('fs');

const I18N_FOLDER_PATH = 'projects/safe/src/i18n/';

/** Default value that will be used as key in test translation file. */
const DEFAULT_VALUE = '******';

// Regex which matches variables inside translations
// Be aware that it will only match when the variable name is a single word, which should always be the case
const REGEX_VALUE_VARIABLE = /({{\w+}})/;

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
 * @param {*} defaultValue default placeholder value
 * @returns new json
 */
const setDefaultValue = (json, defaultValue) => {
  const newJson = { ...json };
  for (const key of Object.keys(json)) {
    if (typeof newJson[key] === 'string') {
      let newValue = defaultValue;
      if (REGEX_VALUE_VARIABLE.test(newJson[key])) {
        // Split the translation value using variables as delimiter, including them in the array
        // Then, filter out empty values
        const splittedValue = json[key]
          .split(REGEX_VALUE_VARIABLE)
          .filter((x) => x.length > 0);

        // Build the placeholder by replacing all text that is not the variable by the default value, and remove whitespace at start and end
        newValue = splittedValue
          .reduce((prev, curr) => {
            return REGEX_VALUE_VARIABLE.test(curr)
              ? prev.concat(' ' + curr)
              : prev.concat(' ' + DEFAULT_VALUE);
          }, '')
          .trim();
      }
      newJson[key] = newValue;
    } else {
      newJson[key] = setDefaultValue(newJson[key], defaultValue);
    }
  }
  return newJson;
};

// Check that translation files are sorted.
const sortedEnJson = sortJson(enJson);
fs.writeFile(
  I18N_FOLDER_PATH + 'en.json',
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
  I18N_FOLDER_PATH + 'test.json',
  JSON.stringify(testJson, null, '\t'),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    // else success
  }
);
