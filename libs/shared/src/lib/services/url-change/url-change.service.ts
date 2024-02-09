import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Observes url changes from the navbar
 */
@Injectable({
  providedIn: 'root',
})
export class UrlChangeService {
  /** navigation url fired from the nav bar */
  public navUrl: BehaviorSubject<string> = new BehaviorSubject('');
}
