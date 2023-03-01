import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuplicateApplicationModalComponent } from './duplicate-application-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '@oort-front/safe';

/**
 * Duplicate Application module.
 */
@NgModule({
  declarations: [DuplicateApplicationModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [DuplicateApplicationModalComponent],
})
export class DuplicateApplicationModalModule {}
