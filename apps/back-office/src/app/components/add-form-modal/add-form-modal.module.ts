import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFormModalComponent } from './add-form-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeGraphQLSelectModule,
  SafeIconModule,
  SafeModalModule,
} from '@oort-front/safe';

/**
 * Add form module.
 */
@NgModule({
  declarations: [AddFormModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatChipsModule,
    TranslateModule,
    SafeIconModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
  ],
  exports: [AddFormModalComponent],
})
export class AddFormModule {}
