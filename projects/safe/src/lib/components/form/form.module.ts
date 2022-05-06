import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormComponent } from './form.component';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  declarations: [SafeFormComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    DropDownListModule,
    MatTabsModule,
    SafeButtonModule,
    SafeIconModule,
    SafeRecordSummaryModule,
    TranslateModule,
    DateInputModule,
  ],
  exports: [SafeFormComponent],
})
export class SafeFormModule {}
