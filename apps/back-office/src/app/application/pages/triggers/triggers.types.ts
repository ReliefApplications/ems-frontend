import { Access } from '@oort-front/shared';

/** Triggers type for Resource */
export enum Triggers {
  cronBased = 'cronBased',
  onRecordCreation = 'onRecordCreation',
  onRecordUpdate = 'onRecordUpdate',
}

/** Triggers type for Resource */
export enum NotificationType {
  email = 'email',
  notification = 'notification',
}

/** Resource triggers filters type */
export type ResourceTriggersFilters = {
  filter: Access;
  triggers: {
    [key in Triggers]: boolean;
  };
};

/**
 * Triggers typw
 */
export const triggers = [
  'cronBased',
  'onRecordCreation',
  'onRecordUpdate',
] as const;
export type TriggersType = (typeof triggers)[number];
