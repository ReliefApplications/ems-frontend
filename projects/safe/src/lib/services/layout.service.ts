import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SafeLayoutService {

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private rightSidenav = new BehaviorSubject<any>(null);

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.rightSidenav.next(null);
    });
  }

  setRightSidenav(container: any): void {
    this.rightSidenav.next(container);
  }

  get rightSidenav$(): Observable<any> {
    return this.rightSidenav.asObservable();
  }
}
