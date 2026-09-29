import { print } from 'graphql';
import {
  EMAIL_NOTIFICATION_COLUMNS,
  EMAIL_NOTIFICATION_TIMEZONE,
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

  it('displays execution timestamps in the scheduler timezone', () => {
    expect(EMAIL_NOTIFICATION_TIMEZONE).toBe('UTC');
  });
});
