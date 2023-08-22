import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
/**
 * Interface that describes the structure of the data displayed in the snackbar
 */
export interface SnackBarData {
  loading: boolean;
  error?: boolean;
  message: string;
}

/**
 * Snackbar data token
 */
export const SNACKBAR_DATA = new InjectionToken<BehaviorSubject<SnackBarData>>(
  'Data injected to the snackbar',
  {
    providedIn: 'root',
    factory: () =>
      new BehaviorSubject<SnackBarData>({
        loading: false,
        message: '',
      }),
  }
);
