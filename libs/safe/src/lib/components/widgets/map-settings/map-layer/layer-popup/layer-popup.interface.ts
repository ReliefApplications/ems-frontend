export type popupElementType = 'text' | 'fields';

export interface popupElement {
  type: popupElementType;
  text?: string;
  title?: string;
  description?: string;
  fields?: string[];
}
