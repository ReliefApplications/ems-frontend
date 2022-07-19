import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Shared layout service.
 * The layout service handles the display of the right sidenav.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeLayoutService {
  /** Current right sidenav */
  private rightSidenav = new BehaviorSubject<any>(null);
  /** @returns Current right sidenav as observable */
  get rightSidenav$(): Observable<any> {
    return this.rightSidenav.asObservable();
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
      this.rightSidenav.next(null);
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
}
