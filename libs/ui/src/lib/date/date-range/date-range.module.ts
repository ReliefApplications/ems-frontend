import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateRangeComponent } from './date-range.component';
import { IconModule } from '../../icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Date range module
 */
@NgModule({
  declarations: [DateRangeComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    IntlModule,
    DateInputsModule,
    LabelModule,
    IconModule,
    TranslateModule,
  ],
  exports: [DateRangeComponent],
})
export class DateRangeModule {}
