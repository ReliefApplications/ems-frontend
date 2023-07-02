import { Injectable } from '@angular/core';
import { differenceBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { SafeApplicationService } from '../application/application.service';
import { Application } from '../../models/application.model';
import localForage from 'localforage';

/**
 * Application context service
 * Used to get filter value
 */
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
  public filterStructure = new BehaviorSubject<any>(null);
  public filterPosition = new BehaviorSubject<any>(null);
  private currentApplicationId?: string | null = null;

  /** @returns filter value as observable */
  get filter$() {
    return this.filter.asObservable();
  }

  /** @returns filterStructure value as observable */
  get filterStructure$() {
    return this.filterStructure.asObservable();
  }

  /** @returns filterPosition value as observable */
  get filterPosition$() {
    return this.filterPosition.asObservable();
  }

  /** @returns key for storing position of filter */
  get positionKey(): string {
    return this.currentApplicationId + ':filterPosition';
  }

  public isFilterEnable = new BehaviorSubject<boolean>(false);

  /** @returns  isFilterEnable value as observable */
  get isFilterEnable$() {
    return this.isFilterEnable.asObservable();
  }

  /**
   * Application context service
   *
   * @param applicationService Shared application service
   */
  constructor(private applicationService: SafeApplicationService) {
    this.applicationService.application$.subscribe(
      (application: Application | null) => {
        if (application) {
          if (this.currentApplicationId !== application.id) {
            this.currentApplicationId = application.id;
            this.filter.next(null);
            this.filterStructure.next(application.contextualFilter);
            localForage.getItem(this.positionKey).then((position) => {
              if (position) {
                this.filterPosition.next(position);
              } else {
                this.filterPosition.next(application.contextualFilterPosition);
              }
            });
          }
        } else {
          this.currentApplicationId = null;
          this.filter.next(null);
          this.filterStructure.next(null);
          this.filterPosition.next(null);
        }
      }
    );
    this.filterPosition$.subscribe((position: any) => {
      if (position && this.currentApplicationId) {
        localForage.setItem(this.positionKey, position);
      }
    });
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
    // Concat the remaining dashboard filters into the original filter array
    filters = filters.concat(dashboardFilters);
    return filters;
  }
}
