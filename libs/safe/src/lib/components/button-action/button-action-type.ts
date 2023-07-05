import { Category, Variant } from '@oort-front/ui';

/**
 * Button Action Type
 */
export type ButtonActionT = {
  text: string;
  href: string;
  variant: Variant;
  category: Category;
  openInNewTab: boolean;
};
