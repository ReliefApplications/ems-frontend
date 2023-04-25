import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  public filter = new BehaviorSubject<any>(null);
  get filter$() {
    return this.filter.asObservable();
  }
}
