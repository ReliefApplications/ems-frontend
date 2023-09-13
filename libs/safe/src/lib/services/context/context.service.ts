import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SafeApplicationService } from '../application/application.service';
import { Application } from '../../models/application.model';
import localForage from 'localforage';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { cloneDeep } from '@apollo/client/utilities';
import { isNil, isEmpty, get } from 'lodash';

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

  public filter = new BehaviorSubject<Record<string, any>>({});
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

  public isFilterEnabled = new BehaviorSubject<boolean>(false);

  /** @returns  isFilterEnable value as observable */
  get isFilterEnabled$() {
    return this.isFilterEnabled.asObservable();
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
    if (!this.isFilterEnabled.getValue() && 'filters' in filter) {
      filter.filters = [];
      return filter;
    }

    const regex = /(?<={{filter\.)(.*?)(?=}})/gim;
    const availableFilterFields = this.filter.getValue();

    if ('field' in filter && filter.field) {
      // If it's a filter descriptor, replace value
      const filterName = filter.value?.match(regex)?.[0];
      if (filterName) {
        filter.value = get(availableFilterFields, filterName);
      }
    } else if ('filters' in filter && filter.filters) {
      // If it's a composite filter, replace values in filters
      filter.filters = filter.filters
        .map((f) => this.injectDashboardFilterValues(f))
        .filter((f) => {
          // Filter out fields that are not in the available filter field
          // Meaning, their values are still using the {{filter.}} syntax
          if ('value' in f) {
            return !isNil(f.value) && !isEmpty(f.value);
            // const filterName = f.value?.match(regex)?.[0];
            // return !(filterName && !availableFilterFields[filterName]);
          } else return true;
          // return true;
        });
    }
    return filter;
  }
}
