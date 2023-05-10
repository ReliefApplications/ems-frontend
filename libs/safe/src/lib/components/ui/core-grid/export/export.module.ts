import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExportComponent } from './export.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule } from '@angular/forms';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../modal/modal.module';
import { RadioModule } from '@oort-front/ui';

/** Module for the export component */
@NgModule({
  declarations: [SafeExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    TranslateModule,
    SafeModalModule,
    RadioModule,
  ],
  exports: [SafeExportComponent],
})
export class SafeExportModule {}
