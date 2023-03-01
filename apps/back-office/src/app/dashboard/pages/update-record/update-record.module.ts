import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateRecordRoutingModule } from './update-record-routing.module';
import { UpdateRecordComponent } from './update-record.component';
import { SafeFormModule } from '@oort-front/safe';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

/** Update record module. */
@NgModule({
  declarations: [UpdateRecordComponent],
  imports: [
    CommonModule,
    TranslateModule,
    UpdateRecordRoutingModule,
    SafeFormModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [UpdateRecordComponent],
})
export class UpdateRecordModule {}
