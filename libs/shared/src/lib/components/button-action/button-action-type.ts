import { Category, Variant } from '@oort-front/ui';

/**
 * Button Action Type
 */
export type ButtonActionT = {
  text: string;
  // Display
  variant: Variant;
  category: Category;
  // Role restriction
  hasRoleRestriction: boolean;
  roles: string[];
  // Navigation
  href?: string;
  openInNewTab: boolean;
  previousPage?: boolean;
  // Edit Record
  editRecord?: {
    template?: string;
  };
  // Add Record
  addRecord?: {
    resource?: string;
    template?: string;
    fieldsForUpdate?: Array<string>;
  };
  // Notifications
  subscribeToNotification?: {
    notification?: string;
  }
  
};
