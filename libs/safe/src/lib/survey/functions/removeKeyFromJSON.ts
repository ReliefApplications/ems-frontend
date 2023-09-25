/**
 * Delete an element from a JSON object given its key (this was made to work with nested objects inside the JSON)
 *
 * @param obj The JSON object.
 * @param keyToRemove The key of element to remove.
 */

function removeKeyFromJSON(obj: object, keyToRemove: any) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      removeKeyFromJSON(obj[i], keyToRemove);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const prop in obj) {
      if (prop === keyToRemove) {
        delete obj[prop as keyof object];
      } else {
        removeKeyFromJSON(obj[prop as keyof object], keyToRemove);
      }
    }
  }
}
export default removeKeyFromJSON;
