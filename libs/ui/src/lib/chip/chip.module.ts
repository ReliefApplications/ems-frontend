import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { ChipListDirective } from './chip-list.directive';
import { ChipInputDirective } from './chip-input.directive';
import { IconModule } from '../icon/icon.module';

/**
 * UI Chip Module
 */
@NgModule({
  declarations: [ChipComponent, ChipListDirective, ChipInputDirective],
  imports: [CommonModule, IconModule],
  exports: [ChipComponent, ChipListDirective, ChipInputDirective],
})
export class ChipModule {}
