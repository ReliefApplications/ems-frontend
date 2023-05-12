import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryComponent } from './record-history.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../pipes/date/date.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeEmptyModule } from '../ui/empty/empty.module';

/**
 * SafeRecordHistoryModule is a class used to manage all the modules and components
 * related to the history of records.
 */
@NgModule({
  declarations: [SafeRecordHistoryComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatMenuModule,
    SafeButtonModule,
    TranslateModule,
    SafeDateModule,
    MatSelectModule,
    IndicatorsModule,
    SafeEmptyModule,
  ],
  exports: [SafeRecordHistoryComponent],
})
export class SafeRecordHistoryModule {}
