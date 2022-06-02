import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryComponent } from './record-history.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

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
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatMenuModule,
    SafeButtonModule,
    TranslateModule,
  ],
  exports: [SafeRecordHistoryComponent],
})
export class SafeRecordHistoryModule {}
