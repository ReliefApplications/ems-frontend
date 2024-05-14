import {
  get,
  has,
  isArray,
  isEmpty,
  isNil,
  isObject,
  isString,
  mapValues,
} from 'lodash';
import { Question } from 'survey-core';

/**
 * Remove empty placeholders from object
 *
 * @param obj object to clean
 */
const removeEmptyPlaceholders = (obj: any) => {
  for (const key in obj) {
    if (has(obj, key)) {
      if (isArray(obj[key])) {
        // If the value is an array, recursively parse each element
        obj[key].forEach((element: any) => {
          removeEmptyPlaceholders(element);
        });
        obj[key] = obj[key].filter((element: any) =>
          isObject(element) ? !isEmpty(element) : true
        );
      } else if (isObject(obj[key])) {
        // Recursively call the function for nested objects
        removeEmptyPlaceholders(obj[key]);
      } else if (
        isString(obj[key]) &&
        obj[key].startsWith('{{') &&
        obj[key].endsWith('}}')
      ) {
        delete obj[key];
      }
    }
  }
};

/**
 * Parse JSON values of object.
 *
 * @param obj object to transform
 * @returns object, where string properties that can be transformed to objects, are returned as objects
 */
const parseJSONValues = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((element: any) => parseJSONValues(element));
  }
  return mapValues(obj, (value: any) => {
    if (isString(value)) {
      try {
        return isObject(JSON.parse(value)) ? JSON.parse(value) : value;
      } catch (error) {
        // If parsing fails, return the original string value
        return value;
      }
    } else if (isArray(value)) {
      // If the value is an array, recursively parse each element
      return value.map((element: any) => parseJSONValues(element));
    } else if (isObject(value)) {
      // If the value is an object, recursively parse it
      return parseJSONValues(value);
    } else {
      // If the value is neither a string nor an object, return it as is
      return value;
    }
  });
};

/**
 * Replace values in object with data
 *
 * @param object Object to transform
 * @param data data to inject
 * @returns transformed object
 */
const replaceValues = (object: any, data: any): any => {
  const regex = /["']?{{(.*?)}}["']?/;
  if (isEmpty(data)) {
    return parseJSONValues(object);
  }
  // Transform all string fields into object ones when possible
  const objectAsJSON = parseJSONValues(object);
  const toString = JSON.stringify(objectAsJSON);
  const replaced = toString.replace(new RegExp(regex, 'g'), (match) => {
    const field = match.replace(/["']?\{\{/, '').replace(/\}\}["']?/, '');
    // Default value get
    let fieldValue = get(data, field);
    // Check if the filter set in the graphql variables is a nested property by splitting the value in the {{}} by dots
    const recursiveField = field.split('.');
    if (recursiveField.length > 1) {
      // Get the actual non primitive value using the first position, related to the question name, e.g. countries
      fieldValue = get(data, recursiveField[0]);
      // Then build the nested path to the needed primitive data using all the other fields in the previous array except the first one, needed only to select the question data from the survey
      // taking in account that the ItemValue object is a {text, value} object type, e.g. value.id
      const dataPath = `value.${recursiveField.slice(1).join('.')}`;
      // If it's an array(tagbox), we collect all primitives and build an array
      if (Array.isArray(fieldValue)) {
        const valueHelper: any[] = [];
        fieldValue.forEach((value) => {
          const primitive = get(value, dataPath);
          valueHelper.push(primitive);
        });
        fieldValue = valueHelper;
      } else {
        fieldValue = get(fieldValue, dataPath);
      }
    }
    return isNil(fieldValue) ? match : JSON.stringify(fieldValue);
  });
  const parsed = JSON.parse(replaced);
  return parsed;
};

/**
 * Get graphql variables from question definition
 *
 * @param question SurveyJS question
 * @param property path to property, storing variables mapping
 * @returns transformed graphql variables
 */
const graphQLVariables = (question: Question, property: string) => {
  try {
    let mapping = JSON.parse(get(question, property) || '');
    mapping = replaceValues(mapping, get(question, 'survey.data'));
    removeEmptyPlaceholders(mapping);
    return mapping;
  } catch {
    return {};
  }
};

// referenceDataVariableMapping

export default graphQLVariables;
