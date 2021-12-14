import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridWidgetComponent } from './grid.component';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatButtonModule } from '@angular/material/button';
import { SafeChooseRecordModalModule } from '../../choose-record-modal/choose-record-modal.module';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';

@NgModule({
  declarations: [
    SafeGridWidgetComponent
  ],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatButtonModule,
    SafeChooseRecordModalModule,
    SafeCoreGridModule
  ],
  exports: [SafeGridWidgetComponent]
})
export class SafeGridWidgetModule { }
