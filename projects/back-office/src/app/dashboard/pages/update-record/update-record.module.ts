import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { SafeFormModule, SafePreviousButtonModule } from '@safe/builder';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** Update record module. */
@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    UpdateRecordRoutingModule,
    SafeFormModule,
    MatIconModule,
    MatButtonModule,
    SafePreviousButtonModule,
  ],
  exports: [UpdateRecordComponent],
})
export class UpdateRecordModule {}
