/**
 * Graphql regex validator to check a name can be used in graphql syntax.
 *
 * A correct name begins with a letter or an underscore, and then is followed
 * by letters, underscores or digits.
 * It contains at least one character.
 * It cannot begin with 2 underscores (there are reserved names).
 *
 * Source:
 * https://spec.graphql.org/October2021/#sec-Names
 */
export const graphQLValidator = /^[_a-z]$|^(?:_[a-z0-9]|[a-z]\w)\w*$/i;

/**
 * APi name validator.
 */
export const apiValidator = /^[A-Za-z-_]+$/i;
