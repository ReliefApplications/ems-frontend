import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  name: string;
  route: string;
  queryParams?: any;
}

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbService {
  private breadCrumbSource = new BehaviorSubject<Breadcrumb[]>([]);

  public breadCrumb$ = this.breadCrumbSource.asObservable();

  constructor() {}

  public addBreadCrumb(value: any): void {
    this.breadCrumbSource.next([...this.breadCrumbSource.value, value]);
  }

  public clearBreadCrumb(): void {
    this.breadCrumbSource.next([]);
  }
}
