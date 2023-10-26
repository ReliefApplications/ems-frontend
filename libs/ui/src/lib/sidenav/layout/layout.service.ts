import { Injectable, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Shared layout service.
 * The layout service handles the display of the right sidenav.
 */
@Injectable({
  providedIn: 'root',
})
export class UILayoutService {
  /** Close right sidenav opened when navigating */
  public closeRightSidenav = true;
  /** Current right sidenav */
  private rightSidenav = new BehaviorSubject<any>(null);

  /** @returns Current right sidenav as observable */
  get rightSidenav$(): Observable<any> {
    return this.rightSidenav.asObservable();
  }

  /** Current fixed wrapper actions */
  private fixedWrapperActions = new BehaviorSubject<any>(null);

  /** @returns Current fixed wrapper actions as observable */
  get fixedWrapperActions$(): Observable<any> {
    return this.fixedWrapperActions.asObservable();
  }

  /**
   * Shared layout service.
   * The layout service handles the display of the right sidenav.
   *
   * @param router Angular router
   */
  constructor(private router: Router) {
    // If the router detects a change, we close the sidenav
    this.router.events.subscribe(() => {
      if (this.closeRightSidenav) {
        this.rightSidenav.next(null);
      }
    });
  }

  /**
   * Stores the container used as sidenav.
   *
   * @param container Sidenav container.
   */
  setRightSidenav(container: any): void {
    this.rightSidenav.next(container);
  }

  /**
   * Stores the container used as fixed wrapper actions.
   *
   * @param container Fixed wrapper actions container.
   */
  setFixedWrapperActions(container: TemplateRef<any> | null): void {
    this.fixedWrapperActions.next(container);
  }
}
