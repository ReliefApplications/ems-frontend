import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of, Subject, throwError } from 'rxjs';
import { FieldHistoryQuestionComponent } from './field-history-question.component';

/** Number of history entries fetched per page, mirrors the record history constant */
const HISTORY_PAGE_SIZE = 20;

describe('FieldHistoryQuestionComponent', () => {
  let apolloQueryMock: jest.Mock;

  /**
   * Creates a component with mocked dependencies.
   *
   * @returns Field history question component
   */
  const createComponent = () =>
    new FieldHistoryQuestionComponent(
      { query: apolloQueryMock } as unknown as Apollo,
      { currentLang: 'en' } as TranslateService
    );

  /**
   * Builds a history entry changing the given field.
   *
   * @param field Changed field
   * @returns History entry
   */
  const historyEntry = (field: string) => ({
    createdAt: new Date(),
    createdBy: 'tester',
    changes: [
      { type: 'modify', field, displayName: field, old: '1', new: '2' },
    ],
  });

  beforeEach(() => {
    apolloQueryMock = jest
      .fn()
      .mockReturnValue(of({ data: { recordHistory: [] } }));
  });

  it('queries only the selected field, once per expansion cycle', () => {
    const refresh$ = new Subject<string | undefined>();
    const component = createComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.refresh$ = refresh$;
    component.ngOnInit();

    expect(apolloQueryMock).not.toHaveBeenCalled();

    component.onExpanded();
    expect(component.historyLoaded).toBe(true);
    expect(apolloQueryMock).toHaveBeenCalledTimes(1);
    expect(apolloQueryMock.mock.calls[0][0].variables).toEqual(
      expect.objectContaining({
        id: 'record-id',
        fields: ['status'],
        first: HISTORY_PAGE_SIZE,
        skip: 0,
      })
    );
    expect(apolloQueryMock.mock.calls[0][0].fetchPolicy).toBe('no-cache');

    component.onCollapsed();
    component.onExpanded();
    expect(apolloQueryMock).toHaveBeenCalledTimes(1);

    // Saving while expanded reloads the history
    refresh$.next('record-id');
    expect(apolloQueryMock).toHaveBeenCalledTimes(2);

    // Saving while collapsed only invalidates it until the next expansion
    component.onCollapsed();
    refresh$.next('record-id');
    expect(component.historyLoaded).toBe(false);
    expect(apolloQueryMock).toHaveBeenCalledTimes(2);
    component.onExpanded();
    expect(apolloQueryMock).toHaveBeenCalledTimes(3);

    component.ngOnDestroy();
  });

  it('keeps only the changes of the selected field', () => {
    apolloQueryMock.mockReturnValue(
      of({
        data: {
          recordHistory: [
            {
              ...historyEntry('status'),
              changes: [
                ...historyEntry('status').changes,
                ...historyEntry('other').changes,
              ],
            },
            historyEntry('other'),
          ],
        },
      })
    );
    const component = createComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.ngOnInit();

    component.onExpanded();

    expect(component.loading).toBe(false);
    expect(component.history.length).toBe(1);
    expect(component.history[0].changes.map((x) => x.field)).toEqual([
      'status',
    ]);
    expect(component.hasMoreHistory).toBe(false);
  });

  it('reloads the history when the selected field changes', () => {
    const component = createComponent();
    component.recordId = 'record-id';
    component.ngOnInit();
    component.onExpanded();
    expect(apolloQueryMock).not.toHaveBeenCalled();

    component.setField('status');
    component.setField('priority');

    expect(apolloQueryMock).toHaveBeenCalledTimes(2);
    expect(apolloQueryMock.mock.calls[1][0].variables.fields).toEqual([
      'priority',
    ]);
  });

  it('does not load history in a neutral state', () => {
    const component = createComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.neutral = true;
    component.ngOnInit();

    component.onExpanded();

    expect(component.historyLoaded).toBe(false);
    expect(apolloQueryMock).not.toHaveBeenCalled();
  });

  it('activates a new-record widget after the record is saved', () => {
    const refresh$ = new Subject<string | undefined>();
    const component = createComponent();
    component.field = 'status';
    component.neutral = true;
    component.refresh$ = refresh$;
    component.ngOnInit();

    refresh$.next('new-record-id');
    component.onExpanded();

    expect(component.recordId).toBe('new-record-id');
    expect(component.neutral).toBe(false);
    expect(component.historyLoaded).toBe(true);
    expect(apolloQueryMock.mock.calls[0][0].variables.id).toBe('new-record-id');
  });

  it('keeps a request failure inside the widget', () => {
    apolloQueryMock.mockReturnValue(throwError(() => new Error('Unavailable')));
    const component = createComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.ngOnInit();

    component.onExpanded();

    expect(component.loading).toBe(false);
    expect(component.loadError).toBe(true);
  });

  it('preserves loaded history when the next page fails', () => {
    apolloQueryMock.mockReturnValueOnce(
      of({
        data: {
          recordHistory: Array.from({ length: HISTORY_PAGE_SIZE }, () =>
            historyEntry('status')
          ),
        },
      })
    );
    const component = createComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.ngOnInit();
    component.onExpanded();
    expect(component.hasMoreHistory).toBe(true);

    apolloQueryMock.mockReturnValueOnce(
      throwError(() => new Error('Unavailable'))
    );
    component.loadMoreHistory();

    expect(component.history.length).toBe(HISTORY_PAGE_SIZE);
    expect(component.loadError).toBe(false);
    expect(component.loadingMore).toBe(false);

    // The failed page is requested again
    component.loadMoreHistory();
    expect(apolloQueryMock.mock.calls[2][0].variables.skip).toBe(
      HISTORY_PAGE_SIZE
    );
  });
});
