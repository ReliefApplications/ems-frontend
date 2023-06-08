import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryComponent } from './record-history.component';
import {
  ExpansionPanelModule,
  MenuModule,
  ButtonModule,
  SelectMenuModule,
  DateModule,
} from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatNativeDateModule } from '@angular/material/core';
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
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MenuModule,
    TranslateModule,
    SafeDateModule,
    IndicatorsModule,
    SafeEmptyModule,
    ButtonModule,
    DateModule,
    SelectMenuModule,
    ReactiveFormsModule,
  ],
  exports: [SafeRecordHistoryComponent],
})
export class SafeRecordHistoryModule {}
