import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { ChipListDirective } from './chip-list.directive';
import { IconModule } from '../icon/icon.module';

/**
 * UI Chip Module
 */
@NgModule({
  declarations: [ChipComponent, ChipListDirective],
  imports: [CommonModule, IconModule],
  exports: [ChipComponent, ChipListDirective],
})
export class ChipModule {}
