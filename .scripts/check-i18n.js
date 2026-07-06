const fs = require('fs');
/** Translation files are stored there */
const I18N_FOLDER_PATH = 'libs/shared/src/i18n/';

const DEFAULT_LANGUAGE = 'en';
const TEST_LANGUAGE = 'test';

/** Default language */
const DEFAULT_I18N = require('../' +
  I18N_FOLDER_PATH +
  DEFAULT_LANGUAGE +
  '.json');

/** Default value that will be used as key in test translation file. */
const DEFAULT_VALUE = ' ****** ';

/**
 * Regex matching everything that is not between double brackets.
 * Can be improved to match even values without brackets and leave the spaces before and after brackets.
 */
const REGEX_VALUE_VARIABLE = new RegExp(/([^{}]+(?={{))|((?<=}})[^{}]+)/, 'g');

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
 * Write in a new JSON default value for each key.
 *
 * @param {*} json json to copy
 * @param {*} defaultValue default placeholder value
 * @returns new json
 */
const setDefaultValue = (json, defaultValue) => {
  const newJson = { ...json };
  for (const key of Object.keys(json)) {
    if (typeof newJson[key] === 'string') {
      newJson[key] = REGEX_VALUE_VARIABLE.test(json[key])
        ? json[key].replaceAll(REGEX_VALUE_VARIABLE, defaultValue).trim()
        : defaultValue.trim();
    } else {
      newJson[key] = setDefaultValue(newJson[key], defaultValue);
    }
  }
  return newJson;
};

/**
 * Update translation file
 *
 * @param {*} lang language
 * @param {*} json json value
 */
const updateFile = (lang, json) => {
  fs.writeFileSync(
    I18N_FOLDER_PATH + lang + '.json',
    JSON.stringify(json, null, '\t'),
    (err) => {
      if (err) {
        throw err;
      }
      // else success
    }
  );
};

/**
 * Check the translation key in a JSON.
 *
 * @param {*} module module name
 * @param {*} language language to test
 * @param {*} json language json
 * @param {*} baseLanguage language reference
 * @param {*} baseJson language reference json
 * @returns
 */
const checkTranslationKeys = (
  language,
  json,
  baseLanguage,
  baseJson,
  prefix
) => {
  prefix = prefix || '';
  for (const key of Object.keys(baseJson)) {
    if (typeof baseJson[key] === 'string') {
      if (!json[key] || typeof json[key] !== 'string') {
        throw `Missing key: ${prefix + key} in ${language} translation.`;
      }
    } else {
      if (!json[key] || typeof json[key] === 'string') {
        throw `Incorrect key: ${prefix + key} in ${language} translation.`;
      } else {
        checkTranslationKeys(
          language,
          json[key],
          baseLanguage,
          baseJson[key],
          prefix + key + '.'
        );
      }
    }
  }
};

try {
  // Build dictionnary from files
  let filenames = fs.readdirSync(I18N_FOLDER_PATH);
  let languages = filenames
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.split('.json')[0]);

  let dictionnary = languages.map((lang) => ({
    lang: lang,
    value: require('../' + I18N_FOLDER_PATH + lang + '.json'),
  }));

  // Sort the files
  dictionnary
    .filter((x) => x.lang !== TEST_LANGUAGE)
    .map((x) => {
      x.value = sortJson(x.value);
      updateFile(x.lang, x.value);
    });

  // Check the files content
  dictionnary
    .filter((x) => ![TEST_LANGUAGE, DEFAULT_LANGUAGE].includes(x.lang))
    .forEach((x) =>
      checkTranslationKeys(x.lang, x.value, DEFAULT_LANGUAGE, DEFAULT_I18N)
    );

  // Update the i18n test file.
  const testJson = setDefaultValue(
    dictionnary.find((x) => x.lang === DEFAULT_LANGUAGE).value,
    DEFAULT_VALUE
  );
  updateFile(TEST_LANGUAGE, testJson);
} catch (err) {
  console.error(err);
  process.exit(1);
}
