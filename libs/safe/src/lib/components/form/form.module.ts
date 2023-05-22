import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFormComponent } from './form.component';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeButtonModule } from '../ui/button/button.module';
import { IconModule } from '@oort-front/ui';

/**
 * SafeFormModule is a class used to manage all the modules and components
 * related to the form display.
 */
@NgModule({
  declarations: [SafeFormComponent],
  imports: [
    CommonModule,
    TabsModule,
    SafeButtonModule,
    IconModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
  ],
  exports: [SafeFormComponent],
})
export class SafeFormModule {}
