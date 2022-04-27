const fs = require('fs');
const I18N_FOLDER_PATH = 'projects/safe/src/i18n/';
const enJson = require('../'+I18N_FOLDER_PATH+'en.json');


/** Default value that will be used as key in test translation file. */
const DEFAULT_VALUE = ' ****** ';

// Regex matching everything that is not between double brackets
// Can be improved to match even values without brackets and leave the spaces before and after brackets
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
 * Gets all keys (including nested) in JSON Object
 *
 * @param {*} json json to inspect and extract the keys from
 * @param {*} ret_array array in which we will return the keys
 * @returns ret_array, containing all the keys
 */
function getAllJsonKeys(json, ret_array = []) {
  for (key in json) {
      if (typeof(json[key]) === 'object') {
          ret_array.push(key);
          getAllJsonKeys(json[key], ret_array);
      } else {
          ret_array.push(key);
      }
  }
  return ret_array
}

let listOfJson = [];
let listOfFileNames = [];

//Getting the name of all the files in the I18n folder except for 'test.json'
listOfFileNames = fs.readdirSync(I18N_FOLDER_PATH);
const indexTestJson = listOfFileNames.indexOf('test.json');
if (indexTestJson > -1) {
  listOfFileNames.splice(indexTestJson,1); 
}

//Putting all the JSONs in a list
listOfJson = listOfFileNames.map(filename=>require('../'+I18N_FOLDER_PATH+filename));

//Sort all the JSONs
listOfJson = listOfJson.map(json=>sortJson(json));
let enJsonSorted = sortJson(enJson);

//Create a list of all the JSONs files except en.json
let listOfJSONWithoutEn = JSON.parse(JSON.stringify(listOfJson));
const indexEnJson = listOfFileNames.indexOf('en.json');
if (indexEnJson > -1) {
  listOfJSONWithoutEn.splice(indexEnJson,1); 
}

// Check that translation files are sorted.
for(let i in listOfJson){
  fs.writeFile(
    I18N_FOLDER_PATH + listOfFileNames[i],
    JSON.stringify(listOfJson[i], null, '\t'),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // else success
    }
  );
}

//Check that the "non-english" files have the same keys than en.json
let allKeysEn = [];
getAllJsonKeys(enJsonSorted,allKeysEn);
listOfJSONWithoutEn.map(element=>{
  let allKeys = [];
  getAllJsonKeys(element,allKeys);
  if(allKeys.toString() !== allKeysEn.toString()){
    console.error('Error : One of the other languages does not contain exactly the same keys as en.json');
    return;
  }
  // else success
})

// Update the i18n test file.
const testJson = setDefaultValue(enJsonSorted, DEFAULT_VALUE);
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

