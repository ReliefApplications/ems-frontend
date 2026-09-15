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

  it('should keep layout filters out of the user filter state', () => {
    const layoutFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [{ field: 'status', operator: 'eq', value: 'active' }],
    };
    component.defaultLayout = { filter: layoutFilter };
    component.settings = {};

    component.configureGrid();

    expect(component.filter).toEqual({ logic: 'and', filters: [] });
    expect(component.queryFilter).toEqual({
      logic: 'and',
      filters: [
        {
          logic: 'and',
          filters: [layoutFilter, { logic: 'and', filters: [] }],
        },
        { logic: 'and', filters: [] },
      ],
    });
  });

  it('should expose layout filters when editing an admin layout', () => {
    const layoutFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [{ field: 'status', operator: 'eq', value: 'active' }],
    };
    component.defaultLayout = { filter: layoutFilter };
    component.layoutEditable = true;
    component.settings = {};

    component.configureGrid();

    expect(component.filter).toEqual(layoutFilter);
  });

  it('should clear user filters, keep layout filters, and return to page one', () => {
    const layoutFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [{ field: 'status', operator: 'eq', value: 'active' }],
    };
    const pageChangeSpy = jest
      .spyOn(component, 'onPageChange')
      .mockImplementation();
    component.defaultLayout = { filter: layoutFilter };
    component.settings = {};
    component.configureGrid();
    component.skip = 20;
    component.filter = {
      logic: 'and',
      filters: [{ field: 'name', operator: 'contains', value: 'test' }],
    };

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
          filters: [layoutFilter, { logic: 'and', filters: [] }],
        },
        { logic: 'and', filters: [] },
      ],
    });
  });
});
