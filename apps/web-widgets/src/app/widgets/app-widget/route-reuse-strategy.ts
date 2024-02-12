import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

/**
 * Get resolve url, that will be used to compare pages.
 *
 * @param route activated route snapshot
 * @returns url
 */
function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    .join('/');
}

/**
 * Custom route reuse strategy.
 */
export class AppRouteReuseStrategy implements RouteReuseStrategy {
  /** Route store */
  private routeStore = new Map<string, DetachedRouteHandle>();

  /**
   * Should detach the route when navigating
   *
   * @returns always true
   */
  shouldDetach(): boolean {
    return true;
  }

  /**
   * Store the route in the store
   *
   * @param route activated route snapshot
   * @param handle handle
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.routeStore.set(getResolvedUrl(route), handle);
  }

  /**
   * Should the route be attached
   *
   * @param route activated route snapshot
   * @returns true, if found in the store
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.routeStore.get(getResolvedUrl(route));
  }

  /**
   * Retrieve route from the store
   *
   * @param route activated route snapshot
   * @returns route handle, if any
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.routeStore.get(getResolvedUrl(route)) || null;
  }

  /**
   * Should the route be reused
   *
   * @param future next activated route snapshot
   * @param curr current activated route snapshot
   * @returns true if same route
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return getResolvedUrl(future) === getResolvedUrl(curr);
  }
}
