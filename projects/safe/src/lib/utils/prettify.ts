/**
 * Prettify field labels: replace underscores with spaces, and capitalize the
 * first letter of each word
 *
 * @param {string} label - The label of the field.
 * @returns The prettified label.
 */
export const prettifyLabel = (label: string): string => {
  label = label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  label = label.charAt(0).toUpperCase() + label.slice(1);
  return label;
};
