import { GridColumnConfigurationService } from './grid-column-configuration.service';

describe('GridColumnConfigurationService', () => {
  const key = 'dashboard:widget:layout';
  const storageKey = `oort:grid-column-configuration:${key}`;
  let service: GridColumnConfigurationService;

  beforeEach(() => {
    localStorage.clear();
    service = new GridColumnConfigurationService();
  });

  it('restores saved settings without changing new layout columns', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        savedAt: '2026-01-01T00:00:00.000Z',
        columns: {
          name: { hidden: true, width: 180, order: 1 },
        },
      })
    );
    const fields = [
      { name: 'name', hidden: false, width: 100, order: 0 },
      { name: 'newField', hidden: false, width: 120, order: 1 },
    ];

    service.restore(key, fields);

    expect(fields).toEqual([
      { name: 'name', hidden: true, width: 180, order: 1 },
      { name: 'newField', hidden: false, width: 120, order: 1 },
    ]);
  });

  it('removes a configuration saved before the layout was modified', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        savedAt: '2026-01-01T00:00:00.000Z',
        columns: {
          name: { hidden: true, width: 180, order: 1 },
        },
      })
    );
    const fields = [{ name: 'name', hidden: false, width: 100, order: 0 }];

    service.restore(key, fields, '2026-01-02T00:00:00.000Z');

    expect(fields[0]).toEqual({
      name: 'name',
      hidden: false,
      width: 100,
      order: 0,
    });
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('ignores malformed stored data', () => {
    localStorage.setItem(storageKey, '{invalid json');
    const fields = [{ name: 'name', hidden: false, width: 100, order: 0 }];

    service.restore(key, fields);

    expect(fields[0]).toEqual({
      name: 'name',
      hidden: false,
      width: 100,
      order: 0,
    });
  });

  it('does not unhide a field the user cannot view', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        savedAt: '2026-01-01T00:00:00.000Z',
        columns: {
          name: { hidden: false, width: 180, order: 1 },
        },
      })
    );
    const fields = [
      { name: 'name', hidden: true, width: 100, order: 0, canSee: false },
    ];

    service.restore(key, fields);

    expect(fields[0]).toEqual({
      name: 'name',
      hidden: true,
      width: 180,
      order: 1,
      canSee: false,
    });
  });

  it('saves only user-controlled column settings', () => {
    service.save(key, [
      {
        name: 'name',
        hidden: false,
        width: 160,
        order: 2,
      },
    ]);

    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    expect(stored.columns).toEqual({
      name: { hidden: false, width: 160, order: 2 },
    });
    expect(typeof stored.savedAt).toBe('string');
  });
});
