import { isEmpty, isObject, pickBy } from 'lodash';

/**
 * Remove empty arrays from an object recursively
 *
 * @param obj Object to clean
 * @returns Cleaned object
 */
export const removeEmptyArrays = (obj: any): any => {
  if (!isObject(obj)) {
    return obj;
  }
  return pickBy(obj, (value: any) => {
    if (Array.isArray(value)) {
      return !isEmpty(
        value.filter(
          (item) => !isObject(item) || !isEmpty(removeEmptyArrays(item))
        )
      );
    }
    if (isObject(value)) {
      return !isEmpty(removeEmptyArrays(value));
    }
    return true;
  });
};
