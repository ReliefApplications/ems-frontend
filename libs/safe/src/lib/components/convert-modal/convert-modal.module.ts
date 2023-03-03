import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeConvertModalComponent } from './convert-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * SafeConvertModalModule is a class used to manage all the modules and components
 * related to the modals for the configuration of the convertion in grids.
 */
@NgModule({
  declarations: [SafeConvertModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatListModule,
    MatProgressSpinnerModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [SafeConvertModalComponent],
})
export class SafeConvertModalModule {}
