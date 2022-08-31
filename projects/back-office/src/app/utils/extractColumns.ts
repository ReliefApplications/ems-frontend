/**
 * Get all fields from an object.
 *
 * @param object The source object
 * @param columns The columns list in which we add the fields
 * @param userAccess The current user's access permissions to the fields
 */
export const extractColumns = (
  object: any,
  columns: any,
  userAccess: any
): void => {
  if (object.elements) {
    for (const element of object.elements) {
      if (element.type === 'panel') {
        extractColumns(element, columns, userAccess);
      } else {
        if (userAccess[element.name]?.canSee) columns.push(element.name);
      }
    }
  }
};
