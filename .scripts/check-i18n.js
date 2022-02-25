const enJson = require('../projects/safe/src/i18n/en.json');
const fs = require('fs');

const DEFAULT_VALUE = '******';

/**
 * Writes in a new JSON default value for each key.
 *
 * @param {*} json json to copy
 * @param {*} defaultValue default value to apply
 * @returns 
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

const testJson = setDefaultValue(enJson, DEFAULT_VALUE);

fs.writeFile('projects/safe/src/i18n/test.json', JSON.stringify(testJson), err => {
    if (err) {
        console.error(err);
        return;
    }
    // else success
});
