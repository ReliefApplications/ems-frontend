import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChooseRecordModalComponent } from './choose-record-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [WhoChooseRecordModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [WhoChooseRecordModalComponent]
})
export class WhoChooseRecordModalModule { }
