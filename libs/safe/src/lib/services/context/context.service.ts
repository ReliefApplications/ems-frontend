import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  /** Current dashboard filter available questions*/
  public availableFilterFields: {
    [key: string]: any;
  } | null = null;

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
   * @param obj object to inject context into
   * @returns object with dashboard filter injected
   */
  public injectDashboardFilter(obj: any): any {
    const availableFilterFields = this.availableFilterFields;
    if (!availableFilterFields) return obj;
    const regex = /{{filter\.(.*?)}}/g;
    return JSON.parse(
      JSON.stringify(obj).replace(regex, (match) => {
        const field = match.replace('{{filter.', '').replace('}}', '');
        return availableFilterFields[field] || match;
      })
    );
  }
}
