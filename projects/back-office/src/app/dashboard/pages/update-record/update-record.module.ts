import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { WhoFormModule, WhoPreviousButtonModule } from '@who-ems/builder';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    UpdateRecordRoutingModule,
    WhoFormModule,
    MatIconModule,
    MatButtonModule,
    WhoPreviousButtonModule
  ],
  exports: [UpdateRecordComponent]
})
export class UpdateRecordModule { }
