import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBadgeComponent } from './badge.component';
import { IconModule } from '@oort-front/ui';

/**
 * Badge component module.
 */
@NgModule({
  declarations: [SafeBadgeComponent],
  imports: [CommonModule, IconModule],
  exports: [SafeBadgeComponent],
})
export class SafeBadgeModule {}
