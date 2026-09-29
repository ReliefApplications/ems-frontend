/** Columns displayed by the email notification list. */
export const EMAIL_NOTIFICATION_COLUMNS = [
  'name',
  'alerttype',
  'status',
  'configuredBy',
  'lastExecution',
  'actions',
] as const;

/** Timezone used by the scheduler and its execution timestamps. */
export const EMAIL_NOTIFICATION_TIMEZONE = 'UTC';
