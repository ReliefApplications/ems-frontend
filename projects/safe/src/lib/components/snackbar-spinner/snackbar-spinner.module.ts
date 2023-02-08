import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';
import { SafeSpinnerModule } from '../ui/spinner/spinner.module';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { SafeIconModule } from '../ui/icon/icon.module';

/**
 * SafeSnackbarSpinnerModule is a class used to manage all the modules and components
 * related to the spinner snackbars.
 */
@NgModule({
  declarations: [SafeSnackbarSpinnerComponent],
  imports: [CommonModule, SafeSpinnerModule, MatSnackBarModule, SafeIconModule],
  exports: [SafeSnackbarSpinnerComponent],
})
export class SafeSnackbarSpinnerModule {}
