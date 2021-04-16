import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  openSnackBar(message: string, config?: { duration?: number, error?: boolean }): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: (config && config.duration) ? config.duration : 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: (config && config.error) ? 'snack-error' : ''
    });
  }
}
