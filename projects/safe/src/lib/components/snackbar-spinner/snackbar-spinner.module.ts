import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';
import { SafeSpinnerModule } from '../ui/spinner/spinner.module';

@NgModule({
  declarations: [SafeSnackbarSpinnerComponent],
  imports: [CommonModule, SafeSpinnerModule],
  exports: [SafeSnackbarSpinnerComponent],
})
export class SafeSnackbarSpinnerModule {}
