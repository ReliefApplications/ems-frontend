import { FormControl } from '@angular/forms';
import { cronValidator } from './cron.validator';

describe('cronValidator', () => {
  const validate = (value: unknown) => cronValidator()(new FormControl(value));

  it('returns a pattern error for empty values', () => {
    expect(validate(null)).toEqual({ pattern: { value: null } });
    expect(validate('')).toEqual({ pattern: { value: '' } });
  });

  it('returns a pattern error for invalid expressions', () => {
    expect(validate('not a cron')).toEqual({
      pattern: { value: 'not a cron' },
    });
    // 6 fields: seconds are not enabled
    expect(validate('* * * * * *')).toEqual({
      pattern: { value: '* * * * * *' },
    });
    // out of range minute
    expect(validate('60 * * * *')).toEqual({
      pattern: { value: '60 * * * *' },
    });
  });

  it('returns null for valid expressions', () => {
    expect(validate('* * * * *')).toBeNull();
    expect(validate('*/5 * * * *')).toBeNull();
    expect(validate('0 12 * * 1-5')).toBeNull();
  });

  it('accepts the default expression seeded by the schedule alert step', () => {
    expect(validate('0/5 * 1/1 * *')).toBeNull();
  });

  it('accepts aliases', () => {
    expect(validate('0 12 * * MON')).toBeNull();
    expect(validate('0 0 1 JAN *')).toBeNull();
  });
});
