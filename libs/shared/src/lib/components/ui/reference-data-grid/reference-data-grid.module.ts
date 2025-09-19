import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataGridComponent } from './reference-data-grid.component';
import { GridModule } from '../core-grid/grid/grid.module';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Reference data grid component module.
 */
@NgModule({
  declarations: [ReferenceDataGridComponent],
  imports: [CommonModule, GridModule, ButtonModule, TranslateModule],
  exports: [ReferenceDataGridComponent],
})
export class ReferenceDataGridModule {}
