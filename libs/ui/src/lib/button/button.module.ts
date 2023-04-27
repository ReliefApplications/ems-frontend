import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { ButtonGroupDirective } from './button-group.directive';

/**
 * UI Button Module
 */
@NgModule({
  declarations: [ButtonComponent, ButtonGroupDirective],
  imports: [CommonModule, IconModule, SpinnerModule],
  exports: [ButtonComponent, ButtonGroupDirective],
})
export class ButtonModule {}
