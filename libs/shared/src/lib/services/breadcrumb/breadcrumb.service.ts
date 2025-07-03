import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { Breadcrumb } from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

/**
 * Shared Breadcrumb service.
 * Handle behavior of breadcrumb component, listening to activated route
 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  /** Breadcrumbs */
  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  /** @returns Breadcrumbs as observable */
  public breadcrumbs$ = this.breadcrumbs.asObservable();
  /** Previous root */
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
      .pipe(
        tap((event) => {
          if (event instanceof NavigationStart) {
            this.breadcrumbs.next([]);
          }
        }),
        filter(
          (event) =>
            event instanceof NavigationEnd &&
            (this.previousRoot !== event.urlAfterRedirects ||
              /** If first loaded route contains information for breadcrumbs, emit data */
              !this.previousRoot)
        ),
        tap((event) => {
          this.previousRoot = (event as NavigationEnd).urlAfterRedirects;
        })
      )
      .subscribe(() => {
        const breadcrumbs = this.createBreadcrumbs(this.activateRoute.root);
        this.breadcrumbs.next(breadcrumbs);
      });
  }

  /**
   * Generates breadcrumbs from routing.
   *
   * @param route current route
   * @param uri previous uri
   * @param breadcrumbs list of existing breadcrumbs
   * @returns new breadcrumbs
   */
  private createBreadcrumbs(
    route: ActivatedRoute,
    uri = '',
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
   * @param parentLabel Parent label related to a workflow step needed for building app activity track
   */
  public setBreadcrumb(alias: string, label: string, parentLabel?: string) {
    label = parentLabel ? parentLabel + ' | ' + label : label;
    const breadcrumbs = this.breadcrumbs.getValue();
    const breadcrumbIndex = breadcrumbs.findIndex((x) => x.alias === alias);
    if (breadcrumbIndex !== -1) {
      const shallowCopy = { ...breadcrumbs[breadcrumbIndex] };
      shallowCopy.text = label ? label[0].toUpperCase() + label.slice(1) : '';
      const shallowBreadcrumbs = [...breadcrumbs];
      shallowBreadcrumbs.splice(breadcrumbIndex, 1, shallowCopy);
      this.breadcrumbs.next(shallowBreadcrumbs);
    }
  }
}
