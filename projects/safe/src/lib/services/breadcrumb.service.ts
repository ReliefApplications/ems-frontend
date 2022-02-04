import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  alias?: string;
  url: string;
  name: string;
  queryParams?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SafeBreadcrumbService {
  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$ = this.breadcrumbs.asObservable();

  constructor(private activateRoute: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() =>
        this.breadcrumbs.next(this.createBreadcrumbs(this.activateRoute.root))
      );
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): any {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      const breadcrumb = child.snapshot.data?.breadcrumb;
      if (!(breadcrumb === null || breadcrumb === undefined)) {
        if (!breadcrumb.skip) {
          if (
            this.breadcrumbs.value[breadcrumbs.length] &&
            this.breadcrumbs.value[breadcrumbs.length].url === url
          ) {
            console.log(this.breadcrumbs.value[breadcrumbs.length]);
            breadcrumbs.push(this.breadcrumbs.value[breadcrumbs.length]);
          } else {
            console.log({ ...breadcrumb, ...{ url } });
            breadcrumbs.push({ ...breadcrumb, ...{ url } });
          }
        }
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  public setBreadcrumb(alias: string, name: string) {
    const breadcrumbs = this.breadcrumbs.getValue();
    console.log(breadcrumbs);
    const breadcrumb = breadcrumbs.find((x) => x.alias === alias);
    console.log(breadcrumb);
    if (breadcrumb) {
      breadcrumb.name = name[0].toUpperCase() + name.slice(1);
      this.breadcrumbs.next(breadcrumbs);
    }
  }
}
