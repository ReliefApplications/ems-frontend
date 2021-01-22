/*  Get all fields from an object.
*/
export function extractColumns(object, columns): void {
    for (const element of object.elements) {
        if (element.type === 'panel') {
            extractColumns(element, columns);
        } else {
            columns.push(element.name);
        }
    }
}
