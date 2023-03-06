import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddAggregationModalComponent } from './add-aggregation-modal.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { SafeEditAggregationModalModule } from '../edit-aggregation-modal/edit-aggregation-modal.module';
import { SafeGraphQLSelectModule } from '../../../components/graphql-select/graphql-select.module';
import { ReactiveFormsModule } from '@angular/forms';

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
    SafeButtonModule,
    SafeModalModule,
    SafeEditAggregationModalModule,
    SafeGraphQLSelectModule,
    ReactiveFormsModule,
  ],
  exports: [AddAggregationModalComponent],
})
export class AddAggregationModalModule {}
