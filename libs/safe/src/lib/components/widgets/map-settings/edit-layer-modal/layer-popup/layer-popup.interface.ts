/**
 * Layer popup types and interfaces
 */

/** Popup block type */
export type contentType = 'field' | 'text';

/** Popup blocks content interface */
export interface Content {
  type: contentType;
  content: {
    title: string;
    description?: string;
  };
}
