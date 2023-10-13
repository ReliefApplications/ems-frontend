import { Component, Inject } from '@angular/core';
import { SnackBarData, SNACKBAR_DATA } from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';

/**
 * Snackbar to indicate progress of an async task.
 * Used for download / upload.
 */
@Component({
  selector: 'shared-snackbar-spinner',
  templateUrl: './snackbar-spinner.component.html',
  styleUrls: ['./snackbar-spinner.component.scss'],
})
export class SnackbarSpinnerComponent {
  /** Message displayed in snackbar */
  public message!: string;
  /** Boolean indicating whether there is an error. */
  public error?: boolean;
  /** Loading indicator */
  public loading = true;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dataToken The data that will be displayed in the snackbar
   */
  constructor(
    @Inject(SNACKBAR_DATA)
    public dataToken: BehaviorSubject<SnackBarData>
  ) {
    const data = this.dataToken.getValue();
    this.message = data.message;
    this.error = data.error;
    this.loading = data.loading;
  }
}
