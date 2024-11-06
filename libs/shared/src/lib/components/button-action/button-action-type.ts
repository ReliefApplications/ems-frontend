import { Category, Variant } from '@oort-front/ui';

/** Field interface for sendNotification action */
interface Field {
  format: any;
  name: string;
  type: string;
  kind: string;
  label: string;
  width: number;
  filter: any;
  sort: any;
  fields?: Array<Field>;
  first: number;
}

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
    reloadDashboard?: boolean;
  };
  // Add Record
  addRecord?: {
    resource?: string;
    template?: string;
    fieldsForUpdate?: Array<string>;
    reloadDashboard?: boolean;
  };
  // Notifications
  subscribeToNotification?: {
    notification?: string;
  };
  sendNotification?: {
    distributionList?: string;
    templates?: Array<string>;
    fields?: Array<Field>;
  };
};
