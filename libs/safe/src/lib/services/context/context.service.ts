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
  /** @returns filter value as observable */
  get filter$() {
    return this.filter.asObservable();
  }
}
