import { CoreGridComponent } from './core-grid.component';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { EMPTY } from 'rxjs';
import { RecordVisibility } from '../../../models/record-visibility.model';

describe('CoreGridComponent', () => {
  let component: CoreGridComponent;

  beforeEach(() => {
    component = new CoreGridComponent(
      {},
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        filter$: EMPTY,
        injectContext: (filter: CompositeFilterDescriptor) => filter,
      } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable every record action while the layout is not loaded', () => {
    component.settings = {
      template: 'template-id',
      actions: {
        addRecord: true,
        update: true,
        delete: true,
        history: true,
        convert: true,
        export: true,
        import: true,
        showDetails: true,
        navigateToPage: true,
        remove: true,
        inlineEdition: true,
      },
    };
    component.actionsDisabled = true;

    component.configureGrid();

    expect(component.actions).toEqual(
      expect.objectContaining({
        add: false,
        update: false,
        delete: false,
        history: false,
        convert: false,
        export: false,
        import: false,
        showDetails: true,
        navigateToPage: false,
        remove: false,
      })
    );
    expect(component.editable).toBe(false);
  });

  it('should allow details while the other actions are disabled', () => {
    component.actionsDisabled = true;
    const detailsSpy = jest
      .spyOn(component, 'onShowDetails')
      .mockResolvedValue();
    const updateSpy = jest.spyOn(component, 'onUpdate').mockResolvedValue();
    const resetSpy = jest
      .spyOn(component, 'resetDefaultLayout')
      .mockImplementation();

    component.onAction({ action: 'details', items: [{ id: 'draft-id' }] });
    component.onAction({ action: 'update', item: { id: 'draft-id' } });
    component.onAction({ action: 'resetLayout' });

    expect(detailsSpy).toHaveBeenCalledWith([{ id: 'draft-id' }], undefined);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should let drafts be resumed, deleted and exported only', () => {
    component.settings = {
      template: 'template-id',
      recordVisibility: RecordVisibility.ownDrafts,
      actions: {
        addRecord: true,
        update: true,
        delete: true,
        history: true,
        convert: true,
        export: true,
        import: true,
        showDetails: true,
        navigateToPage: true,
        remove: true,
        inlineEdition: true,
      },
    };

    component.configureGrid();

    expect(component.isDraftGrid).toBe(true);
    expect(component.actions).toEqual(
      expect.objectContaining({
        add: false,
        update: true,
        delete: true,
        history: false,
        convert: false,
        export: true,
        import: false,
        showDetails: true,
        navigateToPage: true,
        remove: true,
      })
    );
    expect(component.editable).toBe(false);
  });

  it('should route update and delete of drafts, but not history', () => {
    component.settings = { recordVisibility: RecordVisibility.allDrafts };
    const updateSpy = jest.spyOn(component, 'onUpdate').mockResolvedValue();
    const deleteSpy = jest.spyOn(component, 'onDelete').mockImplementation();
    const historySpy = jest
      .spyOn(component, 'onViewHistory')
      .mockImplementation();

    component.onAction({ action: 'update', item: { id: 'draft-id' } });
    component.onAction({ action: 'delete', item: { id: 'draft-id' } });
    component.onAction({ action: 'history', item: { id: 'draft-id' } });

    expect(updateSpy).toHaveBeenCalledWith([{ id: 'draft-id' }]);
    expect(deleteSpy).toHaveBeenCalledWith([{ id: 'draft-id' }]);
    expect(historySpy).not.toHaveBeenCalled();
  });

  it('should export drafts with the draft visibility of the grid', () => {
    const getRecordsExport = jest.fn();
    const draftGrid = new CoreGridComponent(
      {},
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { getRecordsExport } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { name: 'application' } as never,
      {
        filter$: EMPTY,
        injectContext: (filter: CompositeFilterDescriptor) => filter,
      } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never
    );
    draftGrid.settings = {
      resource: 'resource-id',
      query: { name: 'allDrafts' },
      recordVisibility: RecordVisibility.allDrafts,
    };
    draftGrid.gridData = { data: [{ id: 'draft-id' }], total: 1 };

    draftGrid.onExport({ records: 'all', format: 'xlsx' });

    expect(getRecordsExport).toHaveBeenCalledWith(
      '/download/records',
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        resource: 'resource-id',
        recordVisibility: RecordVisibility.allDrafts,
      })
    );
  });

  it('should load layout filters into the user filter state', () => {
    const layoutFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [{ field: 'status', operator: 'eq', value: 'active' }],
    };
    component.defaultLayout = { filter: layoutFilter };
    component.settings = {};

    component.configureGrid();

    expect(component.filter).toEqual(layoutFilter);
  });

  it('should reset the user filter state when the layout has no filter', () => {
    component.filter = {
      logic: 'and',
      filters: [{ field: 'name', operator: 'contains', value: 'test' }],
    };
    component.defaultLayout = {};
    component.settings = {};

    component.configureGrid();

    expect(component.filter).toEqual({ logic: 'and', filters: [] });
  });

  it('should clear layout and user filters, keep query filters, and return to page one', () => {
    const layoutFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [{ field: 'status', operator: 'eq', value: 'active' }],
    };
    const queryFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [{ field: 'archived', operator: 'eq', value: false }],
    };
    const pageChangeSpy = jest
      .spyOn(component, 'onPageChange')
      .mockImplementation();
    component.defaultLayout = { filter: layoutFilter };
    component.settings = {};
    component.configureGrid();
    component.settings = { query: { filter: queryFilter } };
    component.skip = 20;

    component.onFilterChange({ logic: 'and', filters: [] });

    expect(component.filter).toEqual({ logic: 'and', filters: [] });
    expect(component.skip).toBe(0);
    expect(pageChangeSpy).toHaveBeenCalledWith({
      skip: 0,
      take: component.pageSize,
    });
    expect(component.queryFilter).toEqual({
      logic: 'and',
      filters: [
        {
          logic: 'and',
          filters: [{ logic: 'and', filters: [] }, queryFilter],
        },
        { logic: 'and', filters: [] },
      ],
    });
  });

  describe('onSaveChanges', () => {
    let openSnackBar: jest.Mock;
    let items: any[];

    beforeEach(() => {
      openSnackBar = jest.fn();
      Object.assign(component, {
        snackBar: { openSnackBar },
        translate: { instant: (key: string) => key },
      });
      items = [
        { id: 'saved', incrementalId: 'R1', name: 'a' },
        { id: 'rejected', incrementalId: 'R2', name: 'b' },
        { id: 'invalid', incrementalId: 'R3', name: 'c' },
      ];
      // Private state of the grid
      Object.assign(component, {
        items,
        originalItems: items.map((x) => ({ ...x })),
      });
      component.updatedItems = [
        { id: 'saved', name: 'a2' },
        { id: 'rejected', name: 'b2' },
        { id: 'invalid', name: 'c2' },
      ];
    });

    it('should report the records rejected by the back-end, without failing', async () => {
      jest.spyOn(component, 'promisedChanges').mockReturnValue([
        Promise.resolve({ data: { editRecord: { id: 'saved' } } }),
        // Blocking error ( e.g. uniqueness rule ): no record is returned
        Promise.resolve({
          data: { editRecord: null },
          errors: [{ message: 'A record with the same name already exists.' }],
        }),
        Promise.resolve({
          data: {
            editRecord: {
              id: 'invalid',
              incrementalId: 'R3',
              validationErrors: [{ question: 'name', errors: ['Required'] }],
            },
          },
        }),
      ]);

      const hasError = await component.onSaveChanges();

      expect(hasError).toBe(true);
      const [saved, rejected, invalid] = items;
      expect(saved.saved).toBe(true);
      expect(saved.validationErrors).toBeUndefined();
      expect(rejected.validationErrors).toEqual([
        {
          question: '-',
          errors: ['A record with the same name already exists.'],
        },
      ]);
      expect(invalid.validationErrors).toEqual([
        { question: 'name', errors: ['Required'] },
      ]);
      // Only the records which could not be saved are still pending
      expect(component.updatedItems.map((x) => x.id)).toEqual([
        'rejected',
        'invalid',
      ]);
      expect(openSnackBar).toHaveBeenCalledTimes(1);
    });

    it('should save all the records when there is no error', async () => {
      jest
        .spyOn(component, 'promisedChanges')
        .mockReturnValue(
          ['saved', 'rejected', 'invalid'].map((id) =>
            Promise.resolve({ data: { editRecord: { id } } })
          )
        );

      const hasError = await component.onSaveChanges();

      expect(hasError).toBe(false);
      expect(component.updatedItems).toEqual([]);
      expect(items.every((x) => x.saved)).toBe(true);
      expect(openSnackBar).not.toHaveBeenCalled();
    });
  });
});
