import { convertToMinutes } from './convert-to-minutes';

describe('convertToMinutes', () => {
  it('returns the value as is for minutes', () => {
    expect(convertToMinutes(5, 'minutes')).toBe(5);
    expect(convertToMinutes(0, 'minutes')).toBe(0);
    expect(convertToMinutes(90, 'minutes')).toBe(90);
  });

  it('converts hours to minutes', () => {
    expect(convertToMinutes(1, 'hours')).toBe(60);
    expect(convertToMinutes(2, 'hours')).toBe(120);
  });

  it('converts days to minutes', () => {
    expect(convertToMinutes(1, 'days')).toBe(1440);
    expect(convertToMinutes(3, 'days')).toBe(3 * 1440);
  });

  it('converts weeks to minutes', () => {
    expect(convertToMinutes(1, 'weeks')).toBe(10080);
    expect(convertToMinutes(2, 'weeks')).toBe(2 * 10080);
  });

  describe('calendar based units', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      // Fixed date, at midnight so the diff with the computed past date
      // (always built at midnight) is a whole number of days
      jest.setSystemTime(new Date(2026, 2, 15)); // March 15th, 2026
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('converts months to minutes from the current date', () => {
      // February 15th -> March 15th 2026: 28 days
      expect(convertToMinutes(1, 'months')).toBe(28 * 1440);
      // January 15th -> March 15th 2026: 31 + 28 days
      expect(convertToMinutes(2, 'months')).toBe((31 + 28) * 1440);
    });

    it('converts years to minutes from the current date', () => {
      // March 15th 2025 -> March 15th 2026: 365 days
      expect(convertToMinutes(1, 'years')).toBe(365 * 1440);
    });
  });

  it('throws on unsupported units', () => {
    expect(() => convertToMinutes(1, 'decades')).toThrow(
      'Unsupported unit: decades'
    );
    expect(() => convertToMinutes(1, '')).toThrow('Unsupported unit: ');
  });
});
