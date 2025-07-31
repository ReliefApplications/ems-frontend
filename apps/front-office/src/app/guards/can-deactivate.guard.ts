import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/** Model for deactivation authorisation */
export interface CanComponentDeactivate {
  canDeactivate: () =>
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree;
}

/** Injectable for checking deactivation */
@Injectable()
export class CanDeactivateGuard {
  /**
   * Check if the component can deactivate
   *
   * @param component The component to check
   * @returns A boolean indicating if the component can deactivate
   */
  canDeactivate(component: CanComponentDeactivate): any {
    if (component) {
      return component.canDeactivate ? component.canDeactivate() : true;
    } else {
      return true;
    }
  }
}
