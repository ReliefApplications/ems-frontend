import {
  isArray,
  isEqual,
  get,
  cloneDeep,
  groupBy,
  pick,
  orderBy,
  flatMap,
  sum,
  mean,
  max,
  size,
  min,
  last,
  head,
  isEmpty,
  isBoolean,
  eq,
  isNil,
  isString,
  map,
} from 'lodash';

/**
 * Calculate an operation for filters
 *
 * @param foreignValue The value which comes from the record item
 * @param operator The operator to use for the operation
 * @param localValue The value which comes from the filter
 * @returns A boolean, indicating the result of the operation
 */
export const operate = (
  foreignValue: any,
  operator: string,
  localValue: any
): boolean => {
  switch (operator) {
    case 'eq':
      return isEqual(foreignValue, localValue);
    case 'neq':
      return !isEqual(foreignValue, localValue);
    case 'gte':
      return foreignValue >= localValue;
    case 'gt':
      return foreignValue > localValue;
    case 'lte':
      return foreignValue <= localValue;
    case 'lt':
      return foreignValue < localValue;
    case 'contains':
      if (foreignValue === null) return false;
      if (isArray(localValue)) {
        for (const itemValue of localValue) {
          if (!foreignValue.includes(itemValue)) {
            return false;
          }
        }
        return true;
      } else {
        return foreignValue.includes(localValue);
      }
    case 'doesnotcontain':
      if (foreignValue === null) return true;
      if (isArray(localValue)) {
        for (const itemValue of localValue) {
          if (foreignValue.includes(itemValue)) {
            return false;
          }
        }
        return true;
      } else {
        return !foreignValue.includes(localValue);
      }
    case 'iscontained':
      return operate(localValue, 'contains', foreignValue);
    case 'isnotcontained':
      return operate(localValue, 'doesnotcontain', foreignValue);
    default:
      return true;
  }
};

/**
 * Apply the filter provided to the specified field
 *
 * @param data Array of fields
 * @param filter Filter object
 * @returns Returns a boolean with the result of the filter
 */
const applyFilters = (data: any, filter: any): boolean => {
  if (filter.logic) {
    switch (filter.logic) {
      case 'or':
        return filter.filters.length
          ? filter.filters.some((f: any) => applyFilters(data, f))
          : true;
      case 'and':
        return filter.filters.every((f: any) => applyFilters(data, f));
      default:
        return false;
    }
  }

  if (filter.field && filter.operator) {
    const value = get(data, filter.field);
    let intValue: number | null;
    try {
      intValue = Number(filter.value);
    } catch {
      intValue = null;
    }
    switch (filter.operator) {
      case 'eq':
        if (isBoolean(value)) {
          return eq(value, filter.value);
        } else {
          return eq(value, String(filter.value)) || eq(value, intValue);
        }
      case 'ne':
      case 'neq':
        if (isBoolean(value)) {
          return !eq(value, filter.value);
        } else {
          return !(eq(value, String(filter.value)) || eq(value, intValue));
        }
      case 'gt':
        return !isNil(value) && value > filter.value;
      case 'gte':
        return !isNil(value) && value >= filter.value;
      case 'lt':
        return !isNil(value) && value < filter.value;
      case 'lte':
        return !isNil(value) && value <= filter.value;
      case 'isnull':
        return isNil(value);
      case 'isnotnull':
        return !isNil(value);
      case 'startswith':
        return !isNil(value) && value.startsWith(filter.value);
      case 'endswith':
        return !isNil(value) && value.endsWith(filter.value);
      case 'contains':
        if (isString(filter.value)) {
          const regex = new RegExp(filter.value, 'i');
          if (isString(value)) {
            return !isNil(value) && regex.test(value);
          } else {
            return !isNil(value) && value.includes(filter.value);
          }
        } else {
          return !isNil(value) && value.includes(filter.value);
        }
      case 'doesnotcontain':
        if (isString(filter.value)) {
          const regex = new RegExp(filter.value, 'i');
          if (isString(value)) {
            return isNil(value) || !regex.test(value);
          } else {
            return isNil(value) || !value.includes(filter.value);
          }
        } else {
          return isNil(value) || !value.includes(filter.value);
        }
      case 'in':
        if (isString(value)) {
          if (isArray(filter.value)) {
            return !isNil(filter.value) && filter.value.includes(value);
          } else {
            const regex = new RegExp(value, 'i');
            return !isNil(filter.value) && regex.test(filter.value);
          }
        } else {
          return !isNil(filter.value) && filter.value.includes(value);
        }
      case 'notint':
        if (isString(value)) {
          if (isArray(filter.value)) {
            return isNil(filter.value) || !filter.value.includes(value);
          } else {
            const regex = new RegExp(value, 'i');
            return isNil(filter.value) || !regex.test(filter.value);
          }
        } else {
          return isNil(filter.value) || !filter.value.includes(value);
        }
      default:
        // For any unknown operator, we return false
        return false;
    }
  }

  // Return false by default
  return false;
};

/**
 * filters the data with the given pipeline filter
 *
 * @param data data to be filtered
 * @param filter pipeline filter
 * @returns filtered data
 */
const getFilteredArray = (data: any, filter: any): any => {
  if (isEmpty(filter)) {
    return data;
  } else {
    return data.filter((item: any) => {
      return applyFilters(item, filter);
    });
  }
};

/**
 * procs an operator
 *
 * @param data data to add
 * @param operator operator to filter the data
 * @returns data operated
 */
const procOperator = (data: any, operator: any) => {
  switch (operator.operator) {
    case 'sum':
      return {
        sum: sum(
          data.map((element: any) => Number(get(element, operator.field)))
        ),
      };
    case 'avg':
      return {
        avg: mean(
          data.map((element: any) => Number(get(element, operator.field)))
        ),
      };
    case 'count':
      return { count: size(data) };
    case 'max':
      return {
        max: max(
          data.map((element: any) => Number(get(element, operator.field)))
        ),
      };
    case 'min':
      return {
        min: min(
          data.map((element: any) => Number(get(element, operator.field)))
        ),
      };
    case 'last':
      return {
        last: last<any>(orderBy(data, operator.field))[operator.field],
      };
    case 'first':
      return {
        first: head<any>(orderBy(data, operator.field))[operator.field],
      };
    default:
      return data;
  }
};

/**
 * returns the result for a pipeline step
 *
 * @param pipelineStep step of the pipeline to build a result from
 * @param data the reference data
 * @param sourceFields fields we want to get in our final data
 * @returns filtered data
 */
export const procPipelineStep = (
  pipelineStep: any,
  data: any,
  sourceFields: any
) => {
  switch (pipelineStep.type) {
    case 'group':
      const operators = pipelineStep.form?.addFields?.map(
        (operator: any) => operator.expression
      );
      const keysToGroupBy = pipelineStep.form.groupBy.map(
        (key: any) => key.field
      );
      data = groupBy(data, (item) =>
        keysToGroupBy.map((key: any) => get(item, key))
      );
      // Mapping between new group keys and data path
      const mapping: Record<string, string> = {};
      for (const key of keysToGroupBy) {
        // Check if the key contains a '.'
        if (key.includes('.')) {
          // Split the key by '.' and extract the last part
          const newKey = key.split('.').pop();
          mapping[newKey] = key;
        } else {
          mapping[key] = key;
        }
      }

      /**
       * Transform object, using mapping object
       *
       * @param obj Object to transform
       * @returns Transformed object
       */
      const transformObject = (obj: Record<string, any>) => {
        const newObj: Record<string, any> = {};
        for (const [key, path] of Object.entries(mapping)) {
          newObj[key] = get(obj, path);
        }
        return newObj;
      };

      for (const key in data) {
        let supplementaryFields: any;
        for (const operator of operators) {
          supplementaryFields = {
            ...supplementaryFields,
            ...procOperator(data[key], operator),
          };
        }
        data[key] = { initialData: data[key], ...supplementaryFields };
      }
      const dataToKeep = [];
      for (const key in data) {
        //projecting on interesting fields
        dataToKeep.push({
          ...pick(data[key].initialData[0], sourceFields),
          ...pick(
            data[key],
            operators.map((operator: any) => operator.operator)
          ),
          ...transformObject(data[key].initialData[0]),
        });
      }
      return dataToKeep;
    case 'filter':
      return getFilteredArray(data, pipelineStep.form);
    case 'sort':
      return orderBy(data, pipelineStep.form.field, pipelineStep.form.order);
    case 'unwind':
      return flatMap(data, (item) => {
        let fieldToUnwind = get(item, pipelineStep.form.field);
        try {
          fieldToUnwind =
            typeof fieldToUnwind === 'string'
              ? JSON.parse(fieldToUnwind.replace(/'/g, '"')) //replace single quotes to correctly get JSON fields
              : fieldToUnwind;
        } catch {
          console.error(`error while parsing field ${fieldToUnwind}`);
        }
        if (isArray(fieldToUnwind)) {
          return map(fieldToUnwind, (value: any) => {
            return {
              ...cloneDeep(item),
              [pipelineStep.form.field]: value,
            };
          });
        }
        return item;
      });
    case 'addFields':
      pipelineStep.form?.map((elt: any) => {
        switch (elt.expression.operator) {
          case 'add':
            data.map((obj: any) => {
              obj[elt.name] = get(obj, elt.expression.field);
            });
            break;
          case 'month':
            data.map((obj: any) => {
              try {
                const month =
                  new Date(get(obj, elt.expression.field)).getMonth() + 1;
                const monthAsString =
                  month < 10 ? '0' + month : month.toString();
                const dateWithMonth =
                  new Date(get(obj, elt.expression.field)).getFullYear() +
                  '-' +
                  monthAsString;
                obj[elt.name] = dateWithMonth;
              } catch {
                obj[elt.name] = undefined;
              }
            });
            break;
          case 'year':
            data.map((obj: any) => {
              try {
                const year = new Date(
                  get(obj, elt.expression.field)
                ).getFullYear();
                const yearAsString = year.toString();
                obj[elt.name] = yearAsString;
              } catch {
                obj[elt.name] = undefined;
              }
            });
            break;
          case 'day':
            data.map((obj: any) => {
              try {
                const date = new Date(get(obj, elt.expression.field));
                const dayAsString =
                  date.getFullYear() +
                  '-' +
                  (date.getMonth() + 1).toString() +
                  '-' +
                  (date.getDate() + 1).toString();
                obj[elt.name] = dayAsString;
              } catch {
                obj[elt.name] = undefined;
              }
            });
            break;
          case 'week':
            data.map((obj: any) => {
              try {
                const date = new Date(get(obj, elt.expression.field));
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDaysOfYear =
                  (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
                const weekNo = Math.ceil(
                  (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
                );
                const dateWithWeek = date.getFullYear() + '-week' + weekNo;
                obj[elt.name] = dateWithWeek;
              } catch {
                obj[elt.name] = undefined;
              }
            });
            break;
          case 'multiply':
            data.map((obj: any) => {
              obj[elt.name] = get(obj, elt.expression.field);
            });
            break;
        }
      });
      return data;
    default:
      console.error('Aggregation not supported yet');
      return;
  }
};
