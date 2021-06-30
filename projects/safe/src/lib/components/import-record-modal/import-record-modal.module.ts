import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SafeImportRecordModalComponent } from './import-record-modal.component';

@NgModule({
  declarations: [
    SafeImportRecordModalComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    NgxDropzoneModule
  ],
  exports: [
    SafeImportRecordModalComponent
  ]
})
export class SafeImportRecordModalModule { }
