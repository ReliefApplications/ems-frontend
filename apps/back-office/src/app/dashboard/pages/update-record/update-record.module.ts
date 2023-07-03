import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { SafeFormModule } from '@oort-front/safe';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Update record module. */
@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    TranslateModule,
    UpdateRecordRoutingModule,
    SafeFormModule,
    IconModule,
  ],
  exports: [UpdateRecordComponent],
})
export class UpdateRecordModule {}
