import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service used for previewing an application.
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private roleId = new BehaviorSubject<string>('');

  /**
   * Constructor for the previewService.
   */
  constructor() {}

  /**
   * Set role which will be used to load the application preview.
   *
   * @param id String with the user id.
   */
  setRole(id: string): void {
    this.roleId.next(id);
  }

  /**
   * Return the roleId as an Observable.
   *
   * @returns Returns an observable string.
   */
  get roleId$(): Observable<string> {
    return this.roleId.asObservable();
  }
}
