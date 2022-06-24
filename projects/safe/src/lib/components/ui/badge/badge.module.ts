import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBadgeComponent } from './badge.component';
import { SafeIconModule } from '../icon/icon.module';

/**
 * Badge component module.
 */
@NgModule({
  declarations: [SafeBadgeComponent],
  imports: [CommonModule, SafeIconModule],
  exports: [SafeBadgeComponent],
})
export class SafeBadgeModule {}
