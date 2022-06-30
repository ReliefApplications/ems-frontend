import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeCoreGridComponent } from './core-grid.component';
import { SafeGridModule } from './grid/grid.module';

/**
 * Core grid component module.
 */
@NgModule({
  declarations: [SafeCoreGridComponent],
  imports: [CommonModule, SafeGridModule],
  exports: [SafeCoreGridComponent],
})
export class SafeCoreGridModule {}
