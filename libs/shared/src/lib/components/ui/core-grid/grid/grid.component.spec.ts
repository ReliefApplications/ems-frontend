import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;

  beforeEach(() => {
    component = new GridComponent(
      undefined as never,
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
      {} as never
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide clear filters when no user filter is active', () => {
    expect(component.hasActiveFilters).toBe(false);
  });

  it('should show clear filters when a user filter is active', () => {
    component.filter = {
      logic: 'and',
      filters: [{ field: 'name', operator: 'contains', value: 'test' }],
    };

    expect(component.hasActiveFilters).toBe(true);
  });

  it('should hide clear filters when filtering is disabled', () => {
    component.filterable = false;
    component.filter = {
      logic: 'and',
      filters: [{ field: 'name', operator: 'contains', value: 'test' }],
    };

    expect(component.hasActiveFilters).toBe(false);
  });

  it('should clear all user filters in one change', () => {
    const filterChangeSpy = jest.spyOn(component.filterChange, 'emit');
    component.filter = {
      logic: 'and',
      filters: [
        { field: 'name', operator: 'contains', value: 'test' },
        { field: 'status', operator: 'eq', value: 'active' },
      ],
    };

    component.clearFilters();

    expect(component.filter).toEqual({ logic: 'and', filters: [] });
    expect(filterChangeSpy).toHaveBeenCalledWith({ logic: 'and', filters: [] });
    expect(component.hasActiveFilters).toBe(false);
  });
});
