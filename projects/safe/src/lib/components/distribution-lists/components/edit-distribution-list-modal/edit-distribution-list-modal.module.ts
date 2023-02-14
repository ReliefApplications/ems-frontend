import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDistributionListModalComponent } from './edit-distribution-list-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

/**
 * Modal to edit distribution list.
 */
@NgModule({
  declarations: [EditDistributionListModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatChipsModule,
  ],
  exports: [EditDistributionListModalComponent],
})
export class EditDistributionListModalModule {}
