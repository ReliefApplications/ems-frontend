import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { WhoFormModule } from '@who-ems/builder';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    UpdateRecordRoutingModule,
    WhoFormModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [UpdateRecordComponent]
})
export class UpdateRecordModule { }
