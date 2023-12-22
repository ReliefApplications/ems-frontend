import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataGridComponent } from './reference-data-grid.component';
import { GridModule } from '../core-grid/grid/grid.module';

/**
 * Reference data grid component module.
 */
@NgModule({
  declarations: [ReferenceDataGridComponent],
  imports: [CommonModule, GridModule],
  exports: [ReferenceDataGridComponent],
})
export class ReferenceDataGridModule {}
