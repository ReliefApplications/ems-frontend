import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridComponent } from './grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeChooseRecordModalModule } from '../../choose-record-modal/choose-record-modal.module';
import { SafeGridCoreModule } from '../../ui/grid-core/grid-core.module';

@NgModule({
  declarations: [
    SafeGridComponent
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
    SafeGridCoreModule
  ],
  exports: [SafeGridComponent]
})
export class SafeGridModule { }
