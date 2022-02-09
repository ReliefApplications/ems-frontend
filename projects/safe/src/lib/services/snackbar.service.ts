import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

/** Default snackbar definition */
const DEFAULT_SNACKBAR = {
  error: false,
  duration: 5000,
  action: 'Dismiss',
};

/** Snackbar interface */
interface SnackBar {
  duration?: number;
  error?: boolean;
  action?: string;
}

/**
 * Shared snackbar service.
 * Snackbar is a brief notification that appears for a short time as a popup.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeSnackBarService {
  /**
   * Shared snackbar service.
   * Snackbar is a brief notification that appears for a short time as a popup.
   *
   * @param snackBar Material snackbar service
   */
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Creates a snackbar message on top of the layout.
   *
   * @param message text message to display.
   * @param config additional configuration of the message ( duration / color / error ).
   * @returns snackbar message reference.
   */
  openSnackBar(
    message: string,
    config?: SnackBar
  ): MatSnackBarRef<TextOnlySnackBar> {
    config = { ...DEFAULT_SNACKBAR, ...config };
    const snackBar = this.snackBar.open(message, config.action, {
      duration: config.duration ? config.duration : undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: config && config.error ? 'snack-error' : '',
    });
    return snackBar;
  }
}
