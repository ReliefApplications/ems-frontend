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
  /** Current filter drawer state */
  private isFilterDrawerOpenSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  /** Observable for filter drawer state */
  public isFilterDrawerOpen$ = this.isFilterDrawerOpenSubject.asObservable();
  /* Filter drawer settings */
  private drawerObjSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  /** Observable for filter drawer settings */
  public drawerObj$ = this.drawerObjSubject.asObservable();

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

  /**
   * Toggles the filter drawer state and emits the updated state to its subscribers.
   */
  toggleFilterDrawer() {
    const currentState = this.isFilterDrawerOpenSubject.getValue();
    this.isFilterDrawerOpenSubject.next(!currentState);
  }

  /**
   * Toggles the filter drawer state and emits the updated state to its subscribers.
   *
   * @param drawerObj drawer settings object
   */
  setDrawerObj(drawerObj: any) {
    console.log(drawerObj);
    this.drawerObjSubject.next(drawerObj);
  }
}
