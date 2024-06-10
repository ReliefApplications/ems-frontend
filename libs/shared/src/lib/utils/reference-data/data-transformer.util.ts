import { get, isArray, map, set } from 'lodash';

/**
 * Reference data transformer.
 * Convert data from reference data into graphQL data.
 */
export class DataTransformer {
  /** Reference data fields */
  fields: any[];

  /** Reference data raw data */
  data: any[];

  /**
   * Reference data transformer.
   * Convert data from reference data into graphQL data.
   *
   * @param fields Reference data fields
   * @param data Reference data raw data
   */
  constructor(fields: any[], data: any[]) {
    this.fields = fields;
    this.data = data;
  }

  /**
   * Transform raw data into graphQL data
   *
   * @returns graphQL data
   */
  transformData(): any {
    const getNestedValues = (obj: any, path: any): any => {
      if (path.includes('.')) {
        const splitPath = path.split('.');
        const parent = splitPath.shift();
        return isArray(get(obj, parent))
          ? map(get(obj, parent), (item: any) =>
              getNestedValues(item, splitPath.join('.'))
            )
          : getNestedValues(get(obj, parent), splitPath.join('.'));
      } else {
        return get(obj, path);
      }
    };

    return this.data.map((item) => {
      const transformedItem = {};

      this.fields.forEach((field) => {
        const { name, graphQLFieldName } = field;
        const value = getNestedValues(item, name);
        set(transformedItem, graphQLFieldName, value);
      });

      return transformedItem;
    });
  }
}
