import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconComponent } from './icon.component';
import { UiModule } from '@oort-front/ui';

/** Module for icon component */
@NgModule({
  declarations: [SafeIconComponent],
  imports: [CommonModule, UiModule],
  exports: [SafeIconComponent],
})
export class SafeIconModule {}
