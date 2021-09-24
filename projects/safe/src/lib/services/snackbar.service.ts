import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

const DEFAULT_SNACKBAR = {
  error: false,
  duration: 5000,
  action: 'Dismiss'
};

interface SnackBar {
  duration?: number;
  error?: boolean;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SafeSnackBarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  /**
   * Creates a snackbar message on top of the layout.
   * @param message text message to display.
   * @param config additional configuration of the message ( duration / color / error ).
   * @returns snackbar message reference.
   */
  openSnackBar(
    message: string,
    config?: SnackBar): MatSnackBarRef<TextOnlySnackBar> {
    config = { ...DEFAULT_SNACKBAR, ...config };
    console.log(config);
    const snackBar = this.snackBar.open(message, config.action, {
      duration: config.duration ? config.duration : undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: (config && config.error) ? 'snack-error' : ''
    });
    return snackBar;
  }
}
