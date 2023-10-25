import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { RadioGroupDirective } from './radio-group.directive';

/**
 * UI Radio module
 */
@NgModule({
  declarations: [RadioComponent, RadioGroupDirective],
  imports: [CommonModule],
  exports: [RadioComponent, RadioGroupDirective],
})
export class RadioModule {}
