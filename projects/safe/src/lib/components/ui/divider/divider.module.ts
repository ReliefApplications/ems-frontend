import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDividerComponent } from './divider.component';
import { MatDividerModule } from '@angular/material/divider';

/**
 * Divider module.
 */
@NgModule({
  declarations: [SafeDividerComponent],
  imports: [CommonModule, MatDividerModule],
  exports: [SafeDividerComponent],
})
export class SafeDividerModule {}
