import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from '@oort-front/ui';

/**
 * Shared Breadcrumb service.
 * Handle behavior of breadcrumb component, listening to activated route
 */
@Injectable({
  providedIn: 'root',
})
export class SafeBreadcrumbService {
  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$ = this.breadcrumbs.asObservable();
  private previousRoot: any;

  /**
   * Shared Breadcrumb service.
   * Handle behavior of breadcrumb component, listening to activated route
   *
   * @param activateRoute Angular activated route
   * @param router Angular router
   */
  constructor(private activateRoute: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.previousRoot !== this.activateRoute.root.children) {
          this.breadcrumbs.next(
            this.createBreadcrumbs(this.activateRoute.root)
          );
          this.previousRoot = this.activateRoute.root.children;
        }
      });
  }

  /**
   * Generates breadcrumbs from routing.
   *
   * @param route current route
   * @param uri previous uri
   * @param breadcrumbs list of existing breadcrumbs
   * @returns new bredcrumbs
   */
  private createBreadcrumbs(
    route: ActivatedRoute,
    uri: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): any {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const previousUri = uri;
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        uri += `/${routeURL}`;
      }
      const breadcrumb = child.snapshot.data?.breadcrumb;
      if (!(breadcrumb === null || breadcrumb === undefined)) {
        if (!breadcrumb.skip && uri !== previousUri) {
          if (
            this.breadcrumbs.value[breadcrumbs.length] &&
            this.breadcrumbs.value[breadcrumbs.length].uri === uri
          ) {
            breadcrumbs.push(this.breadcrumbs.value[breadcrumbs.length]);
          } else {
            breadcrumbs.push({ ...breadcrumb, ...{ uri } });
          }
        }
      }
      return this.createBreadcrumbs(child, uri, breadcrumbs);
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
      breadcrumb.text = label ? label[0].toUpperCase() + label.slice(1) : '';
      this.breadcrumbs.next(breadcrumbs);
    }
  }
}
