import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** The preview service for apps */
@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  /**
   * The role id
   */
  private roleId = new BehaviorSubject<string>('');

  /**
   * Set role which will be used to load the application preview
   *
   * @param id The id of the new value of role
   */
  setRole(id: string): void {
    this.roleId.next(id);
  }

  /**
   * Return the roleId as an Observable.
   *
   * @returns An observable of the role id
   */
  get roleId$(): Observable<string> {
    return this.roleId.asObservable();
  }
}
