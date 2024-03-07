/**
 * Gets the message in the graphql error
 *
 * @param errors GraphQL error
 * @returns formatted message
 */
export const errorMessageFormatter = (errors: any): string =>
  (errors.networkError || errors)?.[0].message ?? '';
