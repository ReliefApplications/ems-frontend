import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Application context service
 * Used to get filter value
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  public filter = new BehaviorSubject<any>(null);
  public filterStructure = new BehaviorSubject<any>(null);
  public filterPosition = new BehaviorSubject<any>(null);

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
}
