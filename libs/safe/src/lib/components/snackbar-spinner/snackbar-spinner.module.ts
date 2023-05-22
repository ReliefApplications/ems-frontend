import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';
import { SpinnerModule } from '@oort-front/ui';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { IconModule } from '@oort-front/ui';

/**
 * SafeSnackbarSpinnerModule is a class used to manage all the modules and components
 * related to the spinner snackbars.
 */
@NgModule({
  declarations: [SafeSnackbarSpinnerComponent],
  imports: [CommonModule, SpinnerModule, MatSnackBarModule, IconModule],
  exports: [SafeSnackbarSpinnerComponent],
})
export class SafeSnackbarSpinnerModule {}
