import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { RadioGroupDirective } from './radio-group.directive';

@NgModule({
  declarations: [RadioComponent, RadioGroupDirective],
  imports: [CommonModule],
  exports: [RadioComponent],
})
export class RadioModule {}
