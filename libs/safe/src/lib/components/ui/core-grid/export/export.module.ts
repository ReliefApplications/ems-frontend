import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExportComponent } from './export.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RadioModule, TooltipModule, ToggleModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
// @TODO: Remove SafeIconModule and SafeButtonModule imports after ui-icon and ui-button are being used in the app
import { SafeIconModule } from '../../icon/icon.module';
import { SafeButtonModule } from '../../button/button.module';

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
    SafeIconModule,
    SafeButtonModule,
  ],
  exports: [SafeExportComponent],
})
export class SafeExportModule {}
