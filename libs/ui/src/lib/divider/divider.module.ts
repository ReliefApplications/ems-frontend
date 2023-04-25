import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerComponent } from './divider.component';

/**
 * UI Divider Module
 */
@NgModule({
  declarations: [DividerComponent],
  imports: [CommonModule],
  exports: [DividerComponent],
})
export class DividerModule {}
