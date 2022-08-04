import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSelectLayoutComponent } from './select-layout.component';

/**
 * Select layout module.
 */
@NgModule({
  declarations: [SafeSelectLayoutComponent],
  imports: [CommonModule],
  exports: [SafeSelectLayoutComponent],
})
export class SafeSelectLayoutModule {}
