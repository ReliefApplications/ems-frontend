import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconComponent } from './icon.component';
import { MatIconModule } from '@angular/material/icon';

/**
 * Module declaration for safe-icon component
 */
@NgModule({
  declarations: [SafeIconComponent],
  imports: [CommonModule, MatIconModule],
  exports: [SafeIconComponent],
})
export class SafeIconModule {}
