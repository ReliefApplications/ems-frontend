import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSpinnerComponent } from './spinner.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

/**
 * Module declaration for safe-spinner component
 */
@NgModule({
  declarations: [SafeSpinnerComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [SafeSpinnerComponent],
})
export class SafeSpinnerModule {}
