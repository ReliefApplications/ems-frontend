import { Injectable, inject } from '@angular/core';
import { CanDeactivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/** Model for deactivation authorization */
export interface CanComponentDeactivate {
  canDeactivate: () =>
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree;
}

/** Injectable for checking deactivation */
@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard {
  /**
   * Check if the component can deactivate
   *
   * @param component The component to check
   * @returns A boolean indicating if the component can deactivate
   */
  canDeactivate(component: CanComponentDeactivate): any {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

/**
 * Related canDeactivateFn for the current class
 *
 * @param component Component class to check
 * @returns a boolean allowing navigation or cancelling it
 */
export const IsDeactivated: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => inject(CanDeactivateGuard).canDeactivate(component);
