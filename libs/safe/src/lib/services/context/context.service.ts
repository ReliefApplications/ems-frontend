import { Injectable } from '@angular/core';
import { differenceBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  /** Current dashboard filter available questions*/
  public availableFilterFields: {
    name: string;
    value: string;
  }[] = [];

  public filter = new BehaviorSubject<any>(null);
  get filter$() {
    return this.filter.asObservable();
  }
  public isFilterEnable = new BehaviorSubject<boolean>(false);
  get isFilterEnable$() {
    return this.isFilterEnable.asObservable();
  }

  /**
   * Injects current dashboard filter into an object.
   *
   * @param filters object to inject context into
   * @returns filters with values from dashboard filters
   */
  public injectDashboardFilterValues(filters: any[]): any {
    const regex = /(?<={{filter\.)(.*?)(?=}})/gim;
    const availableFilterFields = this.filter.getValue();
    // No dashboard filters return current ones
    if (!availableFilterFields) {
      return filters;
    }
    let dashboardFilters = filters.filter((filter) =>
      (filter.value as string).startsWith('{{filter.')
    );
    // If given filters does not contain any filter from the dashboard one, return current ones
    if (!dashboardFilters.length) {
      return filters;
    }
    // Get all the remaining filters into the original array
    filters = differenceBy(filters, dashboardFilters, 'field');
    // Replace value for all the dashboard filters
    dashboardFilters.map((dashboardFilter) => {
      const filterName = (dashboardFilter.value as string).match(regex)?.[0];
      if (filterName && availableFilterFields[filterName]) {
        dashboardFilter.value = availableFilterFields[filterName];
      } else {
        dashboardFilter.value = null;
      }
    });
    // Skip all the dashboard filters with no value or not available
    dashboardFilters = dashboardFilters.filter((df) => !!df.value);
    // Concat the remaining dashboard filters into the original filtera array
    filters = filters.concat(dashboardFilters);
    return filters;
  }
}
