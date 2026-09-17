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
