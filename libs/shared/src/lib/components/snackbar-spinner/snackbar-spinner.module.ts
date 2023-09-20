import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarSpinnerComponent } from './snackbar-spinner.component';
import { IconModule, SpinnerModule } from '@oort-front/ui';

/**
 * SnackbarSpinnerModule is a class used to manage all the modules and components
 * related to the spinner snackbars.
 */
@NgModule({
  declarations: [SnackbarSpinnerComponent],
  imports: [CommonModule, SpinnerModule, IconModule],
  exports: [SnackbarSpinnerComponent],
})
export class SnackbarSpinnerModule {}
