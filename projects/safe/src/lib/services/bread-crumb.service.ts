import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { NumberPipe } from '@progress/kendo-angular-intl';

export interface Breadcrumb {
  name: string;
  route: string;
  queryParams?: any;
}

interface LayoutNames {
  name: string;
  route: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbService {
  private breadCrumbSource = new BehaviorSubject<Breadcrumb[]>([]);
  public breadCrumb$ = this.breadCrumbSource.asObservable();
  private oldRoute = '';
  private layoutNames: LayoutNames[] = [];

  constructor(private router: Router) {
    router.events.subscribe((val: any) => {
      if (
        val instanceof NavigationEnd &&
        this.oldRoute !== val.urlAfterRedirects
      ) {
        this.oldRoute = val.urlAfterRedirects;
        this.setItems(this.oldRoute);
      }
    });
  }

  public addItem(value: any): void {
    this.breadCrumbSource.next([...this.breadCrumbSource.value, value]);
  }

  public changeItem(value: any, id: number): void {
    const temp = this.breadCrumbSource.value;
    const item = temp[id];

    if (value.name) {
      item.name = value.name;
    }
    if (value.route) {
      item.route = value.route;
    }
    if (value.queryParams) {
      item.queryParams = value.queryParams;
    }

    this.breadCrumbSource.next(temp);
  }

  public changeLast(value: any): void {
    this.changeItem(value, this.getLength() - 1);
  }

  public getLength(): number {
    return this.breadCrumbSource.value.length;
  }

  public clearItem(id: number): void {
    const temp = [];

    for (let i = 0; i < id; i++) {
      temp.push(this.breadCrumbSource.value[i]);
    }

    this.breadCrumbSource.next(temp);
  }

  public clearItems(): void {
    this.breadCrumbSource.next([]);
  }

  private setItems(fullRoute: string): void {
    const paths = fullRoute.split('/');
    paths.shift();
    let route = '';
    let name = '';
    let layoutName: LayoutNames | undefined;
    let j = 0;

    for (let i = 0; paths[i]; i++, j++) {
      name = paths[i];
      if (
        paths[i] === 'settings' ||
        (paths[i + 1] && /\d/.test(paths[i + 1]) && paths[i] !== 'resources')
      ) {
        route += '/' + paths[i] + '/' + paths[++i];
      } else {
        route += '/' + paths[i];
      }
      if (
        !this.breadCrumbSource.value[j] ||
        route !== this.breadCrumbSource.value[j].route
      ) {
        if (this.breadCrumbSource.value[j]) {
          this.clearItem(j);
        }
        layoutName = this.layoutNames.find((val) => route === val.route);
        this.addItem({
          name: layoutName ? layoutName.name : name,
          route,
        });
      }
    }
    if (this.breadCrumbSource.value[j]) {
      this.clearItem(j);
    }
  }

  public setLayoutValues(names: LayoutNames[]): void {
    this.layoutNames = names;
    const temp = this.breadCrumbSource.value;
    let layoutName: LayoutNames | undefined;

    for (let i = 0; temp[i]; i++) {
      layoutName = this.layoutNames.find((val) => temp[i].route === val.route);
      if (layoutName) {
        this.changeItem(
          {
            name: layoutName.name,
          },
          i
        );
      }
    }
  }
}
