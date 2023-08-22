import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';
import { IconModule, SpinnerModule } from '@oort-front/ui';

/**
 * SafeSnackbarSpinnerModule is a class used to manage all the modules and components
 * related to the spinner snackbars.
 */
@NgModule({
  declarations: [SafeSnackbarSpinnerComponent],
  imports: [CommonModule, SpinnerModule, IconModule],
  exports: [SafeSnackbarSpinnerComponent],
})
export class SafeSnackbarSpinnerModule {}
