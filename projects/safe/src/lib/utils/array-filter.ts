export const equals = (itemValue: any, filterValue: any): boolean => contains(itemValue, filterValue) && contains(filterValue, itemValue);

export const notEquals = (itemValue: any, filterValue: any): boolean => !equals(itemValue, filterValue);

export const contains = (itemValue: any, filterValue: any): boolean => filterValue?.every((i: any) => itemValue?.includes(i));

export const notContains = (itemValue: any, filterValue: any): boolean => !filterValue?.some((i: any) => itemValue?.includes(i));

// export const isempty = (itemValue: any): boolean => {
//     return !notEmpty(itemValue);
// };

// export const notEmpty = (itemValue: any): boolean => {
//     return itemValue && itemValue.length > 0;
// };
