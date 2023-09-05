import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';

/**
 * UI Button Module
 */
@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, IconModule, SpinnerModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
