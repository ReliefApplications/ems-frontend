import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPullJobModalComponent } from './edit-pull-job-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeGraphQLSelectModule,
  SafeModalModule,
  SafeReadableCronModule,
} from '@oort-front/safe';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

/**
 * Edit pull job module.
 */
@NgModule({
  declarations: [EditPullJobModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeModalModule,
    SafeGraphQLSelectModule,
    SafeReadableCronModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatChipsModule,
  ],
  exports: [EditPullJobModalComponent],
})
export class EditPullJobModalModule {}
