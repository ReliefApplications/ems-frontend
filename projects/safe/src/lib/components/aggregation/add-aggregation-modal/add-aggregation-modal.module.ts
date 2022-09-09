import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddAggregationModalComponent } from './add-aggregation-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeLayoutModule } from '../../layout/layout.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SafeModalModule } from '../../ui/modal/modal.module';

/**
 * Modal to add new aggregation
 */
@NgModule({
  declarations: [AddAggregationModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    SafeLayoutModule,
    SafeButtonModule,
    SafeModalModule,
  ],
  exports: [AddAggregationModalComponent],
})
export class AddAggregationModalModule {}
