import { print } from 'graphql';
import {
  EMAIL_NOTIFICATION_COLUMNS,
  EMAIL_NOTIFICATION_TIMEZONE,
  isEmailNotificationScheduled,
} from './email-list.constants';
import { GET_EMAIL_NOTIFICATIONS } from './graphql/queries';

describe('Email notification list', () => {
  it('includes configurer and last execution columns', () => {
    expect(EMAIL_NOTIFICATION_COLUMNS).toEqual(
      expect.arrayContaining(['configuredBy', 'lastExecution'])
    );
  });

  it('requests the last execution timestamp', () => {
    expect(print(GET_EMAIL_NOTIFICATIONS)).toContain('lastExecution');
  });

  it('uses a delivery column instead of the constant notification type', () => {
    expect(EMAIL_NOTIFICATION_COLUMNS).toContain('delivery');
    expect(EMAIL_NOTIFICATION_COLUMNS).not.toContain('alerttype');
    expect(print(GET_EMAIL_NOTIFICATIONS)).toContain('scheduleEnabled');
  });

  it('classifies enabled schedules as scheduled and missing schedules as manual', () => {
    expect(isEmailNotificationScheduled({ scheduleEnabled: true })).toBe(true);
    expect(isEmailNotificationScheduled({ scheduleEnabled: false })).toBe(
      false
    );
    expect(isEmailNotificationScheduled(null)).toBe(false);
  });

  it('displays execution timestamps in the scheduler timezone', () => {
    expect(EMAIL_NOTIFICATION_TIMEZONE).toBe('UTC');
  });
});
