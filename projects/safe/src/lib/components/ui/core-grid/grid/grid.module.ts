import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridComponent } from './grid.component';
import { SafeGridRowActionsModule } from '../row-actions/row-actions.module';
import { SafeGridToolbarModule } from '../toolbar/toolbar.module';

@NgModule({
  declarations: [
    SafeGridComponent
  ],
  imports: [
    CommonModule,
    // === ROW ===
    SafeGridRowActionsModule,
    // === TOOLBAR ===
    SafeGridToolbarModule
  ],
  exports: [
    SafeGridComponent
  ]
})
export class SafeGridModule { }
