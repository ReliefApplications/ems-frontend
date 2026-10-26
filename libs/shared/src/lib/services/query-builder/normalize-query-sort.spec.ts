import { normalizeQuerySort } from './query-builder.service';

describe('normalizeQuerySort', () => {
  it('returns an empty array for null/undefined', () => {
    expect(normalizeQuerySort(null)).toEqual([]);
    expect(normalizeQuerySort(undefined)).toEqual([]);
  });

  it('normalizes the legacy single {field, order} object', () => {
    expect(normalizeQuerySort({ field: 'lastname', order: 'desc' })).toEqual([
      { field: 'lastname', order: 'desc' },
    ]);
  });

  it('defaults order to asc when omitted on the legacy shape', () => {
    expect(normalizeQuerySort({ field: 'lastname' })).toEqual([
      { field: 'lastname', order: 'asc' },
    ]);
  });

  it('returns an empty array for a legacy object with no field', () => {
    expect(normalizeQuerySort({ order: 'asc' })).toEqual([]);
  });

  it('passes through an already-ordered array, filling in default order', () => {
    expect(
      normalizeQuerySort([
        { field: 'priority_flag', order: 'asc' },
        { field: 'lastUpdatedDate' },
        { field: 'lastname', order: 'desc' },
      ])
    ).toEqual([
      { field: 'priority_flag', order: 'asc' },
      { field: 'lastUpdatedDate', order: 'asc' },
      { field: 'lastname', order: 'desc' },
    ]);
  });

  it('filters out array entries without a field', () => {
    expect(
      normalizeQuerySort([{ field: 'priority_flag' }, { order: 'asc' }, {}])
    ).toEqual([{ field: 'priority_flag', order: 'asc' }]);
  });
});
