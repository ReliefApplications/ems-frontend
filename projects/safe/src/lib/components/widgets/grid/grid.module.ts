import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridWidgetComponent } from './grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeChooseRecordModalModule } from '../../choose-record-modal/choose-record-modal.module';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';

@NgModule({
  declarations: [
    SafeGridWidgetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeFormModalModule,
    MatButtonModule,
    MatIconModule,
    SafeChooseRecordModalModule,
    MatTooltipModule,
    SafeCoreGridModule
  ],
  exports: [SafeGridWidgetComponent]
})
export class SafeGridWidgetModule { }
