import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAvatarComponent } from './avatar.component';
import { IconModule } from '@oort-front/ui';

/**
 * Avatar component module.
 */
@NgModule({
  declarations: [SafeAvatarComponent],
  imports: [CommonModule, IconModule],
  exports: [SafeAvatarComponent],
})
export class SafeAvatarModule {}
