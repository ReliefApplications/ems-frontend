import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDistributionListModalComponent } from './edit-distribution-list-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MatChipsModule } from '@angular/material/chips';

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
