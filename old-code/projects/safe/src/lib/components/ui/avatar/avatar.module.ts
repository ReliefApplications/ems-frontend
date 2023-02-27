import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAvatarComponent } from './avatar.component';
import { SafeIconModule } from '../icon/icon.module';

/**
 * Avatar component module.
 */
@NgModule({
  declarations: [SafeAvatarComponent],
  imports: [CommonModule, SafeIconModule],
  exports: [SafeAvatarComponent],
})
export class SafeAvatarModule {}
