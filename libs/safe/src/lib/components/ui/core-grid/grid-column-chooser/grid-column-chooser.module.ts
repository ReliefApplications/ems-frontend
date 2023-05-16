import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../button/button.module';
import { SafeGridColumnChooserComponent } from './grid-column-chooser.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDividerModule } from '../../divider/divider.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ButtonModule } from '@progress/kendo-angular-buttons';
/**
 * Component to replace the kendo column chooser
 */
@NgModule({
  declarations: [SafeGridColumnChooserComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    MatCheckboxModule,
    FormsModule,
    TranslateModule,
    SafeDividerModule,
    ButtonModule,
    MatTooltipModule,
  ],
  exports: [SafeGridColumnChooserComponent],
})
export class SafeGridColumnChooserModule {}
