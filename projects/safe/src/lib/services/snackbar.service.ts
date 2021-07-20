import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

const DEFAULT_SNACKBAR = {
  expires: true,
  error: false
};

@Injectable({
  providedIn: 'root'
})
export class SafeSnackBarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  /*  Display a message.
    Text, duration, and color are editable ( color is red if error set as true ).
  */
  openSnackBar(
    message: string,
    config: {
      expires?: boolean,
      duration?: number,
      error?: boolean,
      action?: string
    } = DEFAULT_SNACKBAR): MatSnackBarRef<TextOnlySnackBar> {
    const snackBar = this.snackBar.open(message, config.action ? config.action : 'Dismiss', {
      duration: config.expires ? ((config && config.duration) ? config.duration : 3000) : undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: (config && config.error) ? 'snack-error' : ''
    });
    return snackBar;
  }
}
