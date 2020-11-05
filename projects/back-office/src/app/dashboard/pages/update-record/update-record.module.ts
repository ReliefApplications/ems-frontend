import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { WhoFormModule } from 'who-shared';


@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    UpdateRecordRoutingModule,
    WhoFormModule
  ],
  exports: [UpdateRecordComponent]
})
export class UpdateRecordModule { }
