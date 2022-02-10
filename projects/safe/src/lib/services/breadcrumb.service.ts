import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

/** Interface of breadcrumb */
export interface Breadcrumb {
  alias?: string;
  url: string;
  name: string;
  queryParams?: any;
}

/**
 * Shared Breadcrumb service.
 * Breacrumbs are links put on top of pages, for internal navigation.
 */
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

  /**
   * Generates breadcrumbs from routing.
   *
   * @param route current route
   * @param url previous url
   * @param breadcrumbs list of existing breadcrumbs
   * @returns new bredcrumbs
   */
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
            breadcrumbs.push(this.breadcrumbs.value[breadcrumbs.length]);
          } else {
            breadcrumbs.push({ ...breadcrumb, ...{ url } });
          }
        }
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  /**
   * Edits a breadcrumb, if a placeholder was set for it.
   *
   * @param alias alias ( id ) of the breadcrumb.
   * @param label label to apply
   */
  public setBreadcrumb(alias: string, label: string) {
    const breadcrumbs = this.breadcrumbs.getValue();
    const breadcrumb = breadcrumbs.find((x) => x.alias === alias);
    if (breadcrumb) {
      breadcrumb.name = label[0].toUpperCase() + label.slice(1);
      this.breadcrumbs.next(breadcrumbs);
    }
  }
}
