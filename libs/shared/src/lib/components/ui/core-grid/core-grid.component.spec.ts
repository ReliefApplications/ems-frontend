import { CoreGridComponent } from './core-grid.component';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { EMPTY } from 'rxjs';

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

  it('should disable every record action for a draft layout', () => {
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

  it('should allow details while other draft-layout actions are disabled', () => {
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
});
