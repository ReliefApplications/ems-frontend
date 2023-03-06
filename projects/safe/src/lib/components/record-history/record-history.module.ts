import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryComponent } from './record-history.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../pipes/date/date.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeIconModule } from '../ui/icon/icon.module';
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
    SafeIconModule,
    TranslateModule,
    SafeDateModule,
    MatSelectModule,
    IndicatorsModule,
    SafeEmptyModule,
  ],
  exports: [SafeRecordHistoryComponent],
})
export class SafeRecordHistoryModule {}
