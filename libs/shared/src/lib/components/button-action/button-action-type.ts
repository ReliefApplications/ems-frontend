import { Category, Variant } from '@oort-front/ui';

/**
 * Button Action Type
 */
export type ButtonActionT = {
  general: {
    buttonText: string;
    hasRoleRestriction: boolean;
    roles: string[];
    category: Category;
    variant: Variant;
  };
  action: {
    navigateTo: {
      enabled: boolean;
      previousPage: boolean;
      targetUrl: {
        enabled: boolean;
        href: string;
        openInNewTab: boolean;
      };
    };
    editRecord: {
      enabled: boolean;
      template: string;
    };
    addRecord: boolean;
    suscribeToNotification: boolean;
    sendNotification: boolean;
  };
};
