import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditAggregationModalComponent } from './edit-aggregation-modal.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { SafeAggregationBuilderModule } from '../../ui/aggregation-builder/aggregation-builder.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

/**
 * Modal to edit aggregation settings.
 */
@NgModule({
  declarations: [SafeEditAggregationModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SafeModalModule,
    SafeAggregationBuilderModule,
  ],
  exports: [SafeEditAggregationModalComponent],
})
export class SafeEditAggregationModalModule {}
