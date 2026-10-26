import { Category, Variant } from '@oort-front/ui';
import { LocalizedString } from '../../../models/localized-string.model';

/**
 * Action button Type
 */
export type ActionButton = {
  columnLabel: LocalizedString;
  text: LocalizedString;
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
  // Clone Record
  cloneRecord?: {
    template?: string;
    onSave?: {
      navigateTo?: {
        targetUrl?: {
          href?: string;
          openInNewTab?: boolean;
        };
        targetPage?: {
          pageUrl?: string;
          field?: string;
        };
      };
    };
  };
  // Visibility filter
  filter: any;
};
