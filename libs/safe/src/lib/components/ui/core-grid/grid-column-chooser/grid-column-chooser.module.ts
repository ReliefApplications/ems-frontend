import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../button/button.module';
import { SafeGridColumnChooserComponent } from './grid-column-chooser.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDividerModule } from '../../divider/divider.module';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';

/**
 * Component to replace the kendo column chooser
 */
@NgModule({
  declarations: [SafeGridColumnChooserComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    FormsModule,
    TranslateModule,
    SafeDividerModule,
    ButtonModule,
    InputsModule,
  ],
  exports: [SafeGridColumnChooserComponent],
})
export class SafeGridColumnChooserModule {}
