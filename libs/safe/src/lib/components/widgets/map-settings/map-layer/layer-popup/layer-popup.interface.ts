export type popupElementType = 'text' | 'fields';

/**
 * Interface of popup element.
 */
export interface popupElement {
  type: popupElementType;
  text?: string;
  title?: string;
  description?: string;
  fields?: string[];
}
