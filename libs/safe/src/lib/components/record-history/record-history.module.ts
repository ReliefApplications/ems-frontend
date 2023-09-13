import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryComponent } from './record-history.component';
import {
  ExpansionPanelModule,
  MenuModule,
  ButtonModule,
  SelectMenuModule,
  DateModule,
  FormWrapperModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../pipes/date/date.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * SafeRecordHistoryModule is a class used to manage all the modules and components
 * related to the history of records.
 */
@NgModule({
  declarations: [SafeRecordHistoryComponent],
  imports: [
    CommonModule,
    ExpansionPanelModule,
    MenuModule,
    TranslateModule,
    SafeDateModule,
    IndicatorsModule,
    SafeEmptyModule,
    ButtonModule,
    DateModule,
    SelectMenuModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TooltipModule,
  ],
  exports: [SafeRecordHistoryComponent],
})
export class SafeRecordHistoryModule {}
