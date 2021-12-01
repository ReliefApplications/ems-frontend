import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SafeLayoutService {

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-denylist, id-match
  private _rightSidenav = new BehaviorSubject<any>(null);

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this._rightSidenav.next(null);
    });
  }

  setRightSidenav(container: any): void {
    this._rightSidenav.next(container);
  }

  get rightSidenav(): Observable<any> {
    return this._rightSidenav.asObservable();
  }
}
