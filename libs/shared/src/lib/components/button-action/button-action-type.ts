import { Category, Variant } from '@oort-front/ui';

/**
 *
 */
export const ButtonActionTypes = ['link', 'recordEdition', 'emailNotification'];

type ButtonActionTypesT = 'link' | 'recordEdition' | 'emailNotification';

/**
 * Button Action Type
 */
type BaseButtonActionT = {
  type: ButtonActionTypesT;
  text: string;
  hasRoleRestriction: boolean;
  roles: string[];
  variant: Variant;
  category: Category;
};

type linkButtonActionT = BaseButtonActionT & {
  type: 'link';
  href: string;
  openInNewTab: boolean;
};

type recordEditionButtonActionT = BaseButtonActionT & {
  type: 'recordEdition';
};

type emailNotificationT = BaseButtonActionT & {
  type: 'emailNotification';
};

export type ButtonActionT =
  | linkButtonActionT
  | recordEditionButtonActionT
  | emailNotificationT;
