import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbService {
  private breadCrumbSource = new BehaviorSubject<any>([]);

  public breadCrumb$ = this.breadCrumbSource.asObservable();

  constructor() {}

  public addBreadCrumb(value: any): void {
    this.breadCrumbSource.next(value);
  }

  public clearBreadCrumb(): void {
    this.breadCrumbSource.next([]);
  }
}
