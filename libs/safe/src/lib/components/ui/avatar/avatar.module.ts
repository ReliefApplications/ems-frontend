import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAvatarComponent } from './avatar.component';
import { UiModule } from '@oort-front/ui';

/**
 * Avatar component module.
 */
@NgModule({
  declarations: [SafeAvatarComponent],
  imports: [CommonModule, UiModule],
  exports: [SafeAvatarComponent],
})
export class SafeAvatarModule {}
