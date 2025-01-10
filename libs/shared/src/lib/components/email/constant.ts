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

/**
 * Common Services default available fields
 */
export const commonServiceFields = [
  { key: 'Application', label: 'Application' },
  { key: 'PermissionAccessType', label: 'Access' },
  { key: 'SystemRole', label: 'ApplicationRoleName' },
  { key: 'SystemPosition', label: 'ApplicationPositionName' },
  { key: 'Country', label: 'Country' },
  { key: 'Region', label: 'Region' },
  { key: 'LocationType', label: 'LocationType' },
  { key: 'InternalExternal', label: 'InternalExternal' },
];

/**
 * proxy Graphql Path
 */
export const proxyGraphqlPath = 'CS_DEV/graphql/';

/** Maximum number of files allowed */
export const MAX_FILE_COUNT = 5;

/** Maximum file size allowed (7MB in bytes) */
export const MAX_FILE_SIZE = 7 * 1024 * 1024;

/** Required filter keys for validation */
export const REQUIRED_FILTER_KEYS = [
  'DocumentType',
  'InformationConfidentiality',
];
