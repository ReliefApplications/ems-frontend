/** Select field types */
export const selectFieldTypes = ['select', 'dropdown', 'checkbox', 'tagbox'];
/**
 * Regex for valid strings in layout page select
 */
export const TokenRegex = /{{([^}]+)}}/g;
/** Regex for valid email */
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\\"!#\\$]{1,}(\.[^<>()[\]\\.,;:\s@\\"!#\\$]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"!#\\$]+\.)+[^<>()[\]\\.,;:\s@\\"!#\\$]{2,})$/;

/**
 * Array for missing types
 */
export const missingTypesArray = ['matrix', 'matrixdynamic', 'matrixdropdown'];
