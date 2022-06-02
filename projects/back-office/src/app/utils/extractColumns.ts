/** Get all fields from an object. */
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
