import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridColumnChooserComponent } from './grid-column-chooser.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DividerModule } from '@oort-front/ui';

/**
 * Component to replace the kendo column chooser
 */
@NgModule({
  declarations: [SafeGridColumnChooserComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    TranslateModule,
    DividerModule,
    ButtonModule,
    InputsModule,
  ],
  exports: [SafeGridColumnChooserComponent],
})
export class SafeGridColumnChooserModule {}
