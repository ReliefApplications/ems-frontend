import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SafeErrorsModalComponent } from './errors-modal.component';

/** Module for the safe errors modal component */
@NgModule({
  declarations: [SafeErrorsModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  exports: [SafeErrorsModalComponent],
})
export class SafeErrorsModalModule {}
