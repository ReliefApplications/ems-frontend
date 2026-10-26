import { searchFilters } from './search-filters';

describe('searchFilters', () => {
  const textField = { name: 'title', type: 'text' };
  const numericField = { name: 'count', type: 'numeric' };
  const booleanField = { name: 'active', type: 'boolean' };
  const dateField = { name: 'start_date', type: 'date' };
  const dropdownField = {
    name: 'status',
    type: 'dropdown',
    choices: [
      { value: 'appr_x1', text: 'Approved' },
      { value: 'pend_x2', text: 'Pending approval' },
      { value: 'rej_x3', text: 'Rejected' },
    ],
  };
  const tagboxField = {
    name: 'locations',
    type: 'tagbox',
    choices: [
      { value: 'gva', text: 'Geneva' },
      { value: 'nbo', text: 'Nairobi' },
    ],
  };

  it('emits a contains rule for text fields', () => {
    expect(searchFilters('abc', [textField])).toEqual([
      { field: 'title', operator: 'contains', value: 'abc' },
    ]);
  });

  it('skips fields listed in skippedFields', () => {
    expect(searchFilters('abc', [textField], ['title'])).toEqual([]);
  });

  it('emits numeric eq rules only for numbers', () => {
    expect(searchFilters('12', [numericField])).toEqual([
      { field: 'count', operator: 'eq', value: 12 },
    ]);
    expect(searchFilters('abc', [numericField])).toEqual([]);
  });

  it('emits boolean eq rules for parseable booleans only', () => {
    expect(searchFilters('true', [booleanField])).toEqual([
      { field: 'active', operator: 'eq', value: true },
    ]);
    expect(searchFilters('notabool', [booleanField])).toEqual([]);
  });

  it('only emits date rules when the search is a complete ISO date', () => {
    expect(searchFilters('hello', [dateField])).toEqual([]);
    // V8 leniently parses these as valid dates; they must not emit rules
    expect(searchFilters('2025-', [dateField])).toEqual([]);
    expect(searchFilters('12', [dateField])).toEqual([]);
    expect(searchFilters('2026-01-01', [dateField])).toEqual([
      { field: 'start_date', operator: 'eq', value: '2026-01-01' },
    ]);
  });

  it('matches choice display texts case-insensitively and emits an in rule', () => {
    const filters = searchFilters('approv', [dropdownField]);
    expect(filters).toContainEqual({
      field: 'status',
      operator: 'contains',
      value: 'approv',
    });
    expect(filters).toContainEqual({
      field: 'status',
      operator: 'in',
      value: ['appr_x1', 'pend_x2'],
    });
  });

  it('emits no in rule when no choice text matches', () => {
    const filters = searchFilters('zzz', [dropdownField]);
    expect(filters.find((f: any) => f.operator === 'in')).toBeUndefined();
  });

  it('reads choices from field.meta.choices as well', () => {
    const field = {
      name: 'status',
      type: 'dropdown',
      meta: { choices: dropdownField.choices },
    };
    const filters = searchFilters('rejected', [field]);
    expect(filters).toContainEqual({
      field: 'status',
      operator: 'in',
      value: ['rej_x3'],
    });
  });

  it('matches multiselect (tagbox) choice texts', () => {
    const filters = searchFilters('nairo', [tagboxField]);
    expect(filters).toEqual([
      { field: 'locations', operator: 'contains', value: ['nairo'] },
      { field: 'locations', operator: 'in', value: ['nbo'] },
    ]);
  });

  it('emits numeric rules for decimal (expression) fields', () => {
    expect(searchFilters('12.5', [{ name: 'total', type: 'decimal' }])).toEqual(
      [{ field: 'total', operator: 'eq', value: 12.5 }]
    );
  });

  it('emits contains rules for editor fields', () => {
    expect(searchFilters('abc', [{ name: 'notes', type: 'editor' }])).toEqual([
      { field: 'notes', operator: 'contains', value: 'abc' },
    ]);
  });

  it('matches users / owner display texts through their choices', () => {
    const usersField = {
      name: 'assignees',
      type: 'users',
      choices: [
        { value: 'u1', text: 'john.doe' },
        { value: 'u2', text: 'jane.smith' },
      ],
    };
    expect(searchFilters('john', [usersField])).toEqual([
      { field: 'assignees', operator: 'in', value: ['u1'] },
    ]);
  });

  it('emits contains rules for file fields', () => {
    expect(searchFilters('report', [{ name: 'docs', type: 'file' }])).toEqual([
      { field: 'docs', operator: 'contains', value: 'report' },
    ]);
  });

  it('emits contains rules for people fields', () => {
    expect(
      searchFilters('doe', [
        { name: 'focal_point', type: 'people-dropdown' },
        { name: 'team_members', type: 'people-tagbox' },
      ])
    ).toEqual([
      { field: 'focal_point', operator: 'contains', value: 'doe' },
      { field: 'team_members', operator: 'contains', value: 'doe' },
    ]);
  });

  it('preserves dotted names of related-resource subfields', () => {
    const field = { name: 'emergency.name', type: 'text' };
    expect(searchFilters('chol', [field])).toEqual([
      { field: 'emergency.name', operator: 'contains', value: 'chol' },
    ]);
  });

  it('only processes duplicated field names once', () => {
    const filters = searchFilters('abc', [textField, { ...textField }]);
    expect(filters).toHaveLength(1);
  });

  it('ignores fields without a name or with unknown types', () => {
    expect(
      searchFilters('abc', [
        null,
        { type: 'text' },
        { name: 'geo', type: 'geospatial' },
      ])
    ).toEqual([]);
  });
});
