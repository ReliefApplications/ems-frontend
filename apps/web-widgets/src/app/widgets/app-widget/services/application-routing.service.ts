import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Shared service to manage application builder routing.
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationRoutingService {
  /** @returns angular router events */
  public get events() {
    return this.router.events;
  }

  /** @returns angular router url */
  public get url() {
    return this.router.url;
  }

  /** @returns current store path in the client's session storage */
  public get currentPath() {
    return sessionStorage.getItem('currentPath') ?? '';
  }

  /**
   * Service for application routing service to keep browser url unchanged
   *
   * @param router The Angular Router service
   */
  constructor(public router: Router) {}

  /**
   * Navigate to the given path using navigate from angular router service and the given config keeping same url in the clients browser
   *
   * @param path Path where to navigate
   * @param config Router configuration for the given path
   */
  public navigateAndNormalizeUrl(path: string, config: any = {}): void {
    sessionStorage.setItem('currentPath', path);
    config = {
      skipLocationChange: true,
      ...config,
    };
    this.router.navigate([path], config);
  }

  /**
   * Navigate to the given path using navigateByUrl from angular router service and the given config keeping same url in the clients browser
   *
   * @param path Path where to navigate
   */
  public navigateByUrlAndNormalizeUrl(path: string): void {
    sessionStorage.setItem('currentPath', path);
    this.router.navigateByUrl(path, { skipLocationChange: true });
  }
}
