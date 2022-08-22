/**
 * Get all fields from an object.
 *
 * @param object The source object
 * @param columns The columns list in which we add the fields
 */
export const extractColumns = (object: any, columns: any): void => {
  if (object.elements) {
    for (const element of object.elements) {
      if (element.type === 'panel') {
        extractColumns(element, columns);
      } else {
        columns.push(element.name);
      }
    }
  }
};
