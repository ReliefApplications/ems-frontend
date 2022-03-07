import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';
import { SafeSpinnerModule } from '../ui/spinner/spinner.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SafeIconModule } from '../ui/icon/icon.module';

@NgModule({
  declarations: [SafeSnackbarSpinnerComponent],
  imports: [CommonModule, SafeSpinnerModule, MatSnackBarModule, SafeIconModule],
  exports: [SafeSnackbarSpinnerComponent],
})
export class SafeSnackbarSpinnerModule {}
