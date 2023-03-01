import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule } from '@ngx-translate/core';
import { SafeErrorsModalComponent } from './errors-modal.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
