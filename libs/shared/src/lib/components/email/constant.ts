import { QuestionType } from './../../services/form-helper/form-helper.service';

/** Select field types */
export const selectFieldTypes = [
  QuestionType.SELECT,
  QuestionType.DROPDOWN,
  QuestionType.CHECKBOX,
  QuestionType.TAGBOX,
];
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
export const missingTypesArray = [
  QuestionType.MATRIX,
  QuestionType.MATRIX_DYNAMIC,
  QuestionType.MATRIX_DROPDOWN,
];
