import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private roleId = new BehaviorSubject<string>('');

  constructor() {}

  /** Set role which will be used to load the application preview */
  setRole(id: string): void {
    this.roleId.next(id);
  }

  /** Return the roleId as an Observable. */
  get roleId$(): Observable<string> {
    return this.roleId.asObservable();
  }
}
