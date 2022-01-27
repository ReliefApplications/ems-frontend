import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridWidgetComponent } from './grid.component';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatButtonModule } from '@angular/material/button';
import { SafeChooseRecordModalModule } from '../../choose-record-modal/choose-record-modal.module';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeBadgeModule } from '../../ui/badge/badge.module';

@NgModule({
  declarations: [SafeGridWidgetComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatButtonModule,
    SafeChooseRecordModalModule,
    SafeCoreGridModule,
    LayoutModule,
    SafeBadgeModule
  ],
  exports: [SafeGridWidgetComponent],
})
export class SafeGridWidgetModule {}
