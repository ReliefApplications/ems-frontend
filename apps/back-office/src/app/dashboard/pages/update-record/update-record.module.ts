import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { FormModule } from '@oort-front/shared';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Update record module. */
@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    TranslateModule,
    UpdateRecordRoutingModule,
    FormModule,
    IconModule,
  ],
  exports: [UpdateRecordComponent],
})
export class UpdateRecordModule {}
