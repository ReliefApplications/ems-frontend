import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SafeErrorsModalComponent } from './errors-modal.component';
import { MatTableModule } from '@angular/material/table';
import { SafeModalModule } from '../../modal/modal.module';

/** Module for the safe errors modal component */
@NgModule({
  declarations: [SafeErrorsModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    MatTableModule,
    SafeModalModule,
  ],
  exports: [SafeErrorsModalComponent],
})
export class SafeErrorsModalModule {}
