import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExportComponent } from './export.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  RadioModule,
  TooltipModule,
  ToggleModule,
  ButtonModule,
  IconModule,
} from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

/** Module for the export component */
@NgModule({
  declarations: [SafeExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    TooltipModule,
    ToggleModule,
    TranslateModule,
    RadioModule,
    IconModule,
    ButtonModule,
  ],
  exports: [SafeExportComponent],
})
export class SafeExportModule {}
