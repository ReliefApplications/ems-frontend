import { EmbeddedViewRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // tslint:disable-next-line: variable-name
  private _rightSidenav = new BehaviorSubject<EmbeddedViewRef<any>>(null);

  constructor() {}

  setRightSidenav(container: EmbeddedViewRef<any>): void {
    this._rightSidenav.next(container);
  }

  get rightSidenav(): Observable<EmbeddedViewRef<any>> {
    return this._rightSidenav.asObservable();
  }
}
