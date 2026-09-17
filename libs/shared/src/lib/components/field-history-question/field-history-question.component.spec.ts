import { Subject } from 'rxjs';
import { FieldHistoryQuestionComponent } from './field-history-question.component';

describe('FieldHistoryQuestionComponent', () => {
  it('loads once on expansion and invalidates the cache on refresh', () => {
    const refresh$ = new Subject<string | undefined>();
    const component = new FieldHistoryQuestionComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.refresh$ = refresh$;
    component.ngOnInit();
    const historyRefreshSpy = jest.fn();
    component.historyRefresh$.subscribe(historyRefreshSpy);

    component.onExpanded();
    expect(component.historyLoaded).toBe(true);

    component.onCollapsed();
    component.onExpanded();
    expect(component.historyLoaded).toBe(true);

    refresh$.next('record-id');
    expect(component.historyLoaded).toBe(true);
    expect(historyRefreshSpy).toHaveBeenCalledTimes(1);

    component.onCollapsed();
    refresh$.next('record-id');
    expect(component.historyLoaded).toBe(false);
    component.onExpanded();
    expect(component.historyLoaded).toBe(true);
    expect(historyRefreshSpy).toHaveBeenCalledTimes(1);

    component.ngOnDestroy();
  });

  it('does not load history in a neutral state', () => {
    const component = new FieldHistoryQuestionComponent();
    component.recordId = 'record-id';
    component.field = 'status';
    component.neutral = true;

    component.onExpanded();

    expect(component.historyLoaded).toBe(false);
  });

  it('activates a new-record widget after the record is saved', () => {
    const refresh$ = new Subject<string | undefined>();
    const component = new FieldHistoryQuestionComponent();
    component.field = 'status';
    component.neutral = true;
    component.refresh$ = refresh$;
    component.ngOnInit();

    refresh$.next('new-record-id');
    component.onExpanded();

    expect(component.recordId).toBe('new-record-id');
    expect(component.neutral).toBe(false);
    expect(component.historyLoaded).toBe(true);
  });
});
