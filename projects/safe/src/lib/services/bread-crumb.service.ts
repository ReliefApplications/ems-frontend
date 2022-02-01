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

  public changeLast(value: any): void {
    const temp = this.breadCrumbSource.value;
    const lastElement = temp[temp.length - 1];

    if (value.name) {
      lastElement.name = value.name;
    }
    if (value.route) {
      lastElement.route = value.route;
    }
    if (value.queryParams) {
      lastElement.queryParams = value.queryParams;
    }

    this.breadCrumbSource.next(temp);
  }

  public clearBreadCrumb(): void {
    this.breadCrumbSource.next([]);
  }
}
