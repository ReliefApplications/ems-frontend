import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, pairwise } from 'rxjs';
import { ApplicationService } from '../application/application.service';
import { Application } from '../../models/application.model';
import localForage from 'localforage';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { cloneDeep } from '@apollo/client/utilities';
import { isNil, isEmpty, get, isEqual, isObject } from 'lodash';
import { DashboardService } from '../dashboard/dashboard.service';

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

  /** To update/keep the current filter */
  public filter = new BehaviorSubject<Record<string, any>>({});
  /** To update/keep the current filter structure  */
  public filterStructure = new BehaviorSubject<any>(null);
  /** To update/keep the current filter position  */
  public filterPosition = new BehaviorSubject<any>(null);
  /** The current application id */
  private currentApplicationId: string | null = null;
  /** The description of the current application */
  private currentApplicationDescription: string | null = null;

  /** @returns filter value as observable */
  get filter$() {
    return this.filter.asObservable().pipe(
      pairwise(),
      // We only emit a filter value if filter value changes and we send back the actual(curr) value
      filter(
        ([prev, curr]: [Record<string, any>, Record<string, any>]) =>
          !isEqual(prev, curr)
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([prev, curr]: [Record<string, any>, Record<string, any>]) => curr)
    );
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

  /** Used to update the state of whether the filter is enabled */
  public isFilterEnabled = new BehaviorSubject<boolean>(false);

  /** @returns  isFilterEnable value as observable */
  get isFilterEnabled$() {
    return this.isFilterEnabled.asObservable();
  }

  /** @returns current question values from the filter */
  get availableFilterFieldsValue(): Record<string, any> {
    return this.filter.getValue();
  }

  /**
   * Application context service
   *
   * @param applicationService Shared application service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private applicationService: ApplicationService,
    private dashboardService: DashboardService
  ) {
    this.applicationService.application$.subscribe(
      (application: Application | null) => {
        if (application) {
          if (this.currentApplicationId !== application.id) {
            this.currentApplicationId = application.id || null;
            this.currentApplicationDescription =
              application.description ?? null;
            this.filter.next({});
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
          this.filter.next({});
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
   * @param f filter to inject context into
   * @returns filter with values from dashboard filter
   */
  public injectDashboardFilterValues<
    T extends CompositeFilterDescriptor | FilterDescriptor
  >(f: T): T {
    const filter = cloneDeep(f);
    if (
      !this.isFilterEnabled.getValue() &&
      'filters' in filter &&
      // Filtering by context record happens even if filter is disabled
      !this.dashboardService.templateRecord
    ) {
      filter.filters = [];
      return filter;
    }

    const regex = /(?<={{filter\.)(.*?)(?=}})/gim;

    if ('field' in filter && filter.field) {
      // If it's a filter descriptor, replace value ( if string )
      if (filter.value && typeof filter.value === 'string') {
        const filterName = filter.value?.match(regex)?.[0];
        if (filterName) {
          filter.value = get(this.availableFilterFieldsValue, filterName);
        } else if (filter.value === '{{application.description}}') {
          filter.value = this.currentApplicationDescription;
        } else if (filter.value === '{{application.id}}') {
          filter.value = this.currentApplicationId;
        } else if (filter.value === '{{context.record}}') {
          filter.value = this.dashboardService.templateRecord;
        }
      }
    } else if ('filters' in filter && filter.filters) {
      // If it's a composite filter, replace values in filters
      filter.filters = filter.filters
        .map((f) => this.injectDashboardFilterValues(f))
        .filter((f) => {
          // Filter out fields that are not in the available filter field
          // Meaning, their values are still using the {{filter.}} syntax
          if ('value' in f && !f.field?.toString().startsWith('__FILTER__.')) {
            return isObject(f.value)
              ? !isNil(f.value) && !isEmpty(f.value)
              : !isNil(f.value);
          } else {
            return true;
          }
          // return true;
        });
    }
    return filter;
  }

  /**
   * Get the 'at' argument value from the filter field selected
   *
   * @param atField filter field that should be used as 'at' param
   * @returns 'at' value
   */
  public atArgumentValue(atField: string): Date | undefined {
    if (this.isFilterEnabled.getValue()) {
      const regex = /(?<={{filter\.)(.*?)(?=}})/gim;
      const atFilterName = atField.match(regex)?.[0] ?? '';
      if (get(this.availableFilterFieldsValue, atFilterName)) {
        return new Date(get(this.availableFilterFieldsValue, atFilterName));
      }
    }
    return undefined;
  }
}
