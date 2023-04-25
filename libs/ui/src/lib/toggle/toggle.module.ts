import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from './toggle.component';
import { IconModule } from '../icon/icon.module';

/**
 * UI Toggle Module
 */
@NgModule({
  declarations: [ToggleComponent],
  imports: [CommonModule, IconModule],
  exports: [ToggleComponent],
})
export class ToggleModule {}
