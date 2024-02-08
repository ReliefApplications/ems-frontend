import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Handles navigation from the navbar
 */
@Injectable({
  providedIn: 'root',
})
export class UrlChangeService {
  /** */
  public navUrl: BehaviorSubject<string> = new BehaviorSubject('');
}
