import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExportComponent } from './export.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../modal/modal.module';
import {
  RadioModule,
  TooltipModule,
  ToggleModule,
  ButtonModule,
} from '@oort-front/ui';

/** Module for the export component */
@NgModule({
  declarations: [SafeExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    TooltipModule,
    ToggleModule,
    TranslateModule,
    SafeModalModule,
    RadioModule,
    ButtonModule,
  ],
  exports: [SafeExportComponent],
})
export class SafeExportModule {}
