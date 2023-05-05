import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExportComponent } from './export.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule } from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { TooltipModule } from '@oort-front/ui';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../modal/modal.module';

/** Module for the export component */
@NgModule({
  declarations: [SafeExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    TooltipModule,
    MatSlideToggleModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [SafeExportComponent],
})
export class SafeExportModule {}
