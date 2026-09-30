import { EmailNotificationSchedule } from '../../models/email-notifications.model';

/** Columns displayed by the email notification list. */
export const EMAIL_NOTIFICATION_COLUMNS = [
  'name',
  'delivery',
  'status',
  'configuredBy',
  'lastExecution',
  'actions',
] as const;

/** Timezone used by the scheduler and its execution timestamps. */
export const EMAIL_NOTIFICATION_TIMEZONE = 'UTC';

/**
 * Determine whether a notification uses scheduled delivery.
 *
 * @param schedule Notification schedule configuration
 * @returns Whether scheduled delivery is enabled
 */
export const isEmailNotificationScheduled = (
  schedule: EmailNotificationSchedule | null | undefined
): boolean => schedule?.scheduleEnabled === true;
