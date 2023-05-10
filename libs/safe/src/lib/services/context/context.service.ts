import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Context service
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  public filter = new BehaviorSubject<any>(null);
  /** @returns Current filter as observable. */
  get filter$() {
    return this.filter.asObservable();
  }
}
