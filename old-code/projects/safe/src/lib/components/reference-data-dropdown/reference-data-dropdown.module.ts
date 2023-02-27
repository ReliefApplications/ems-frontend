import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeReferenceDataDropdownComponent } from './reference-data-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Reference data dropdown module.
 */
@NgModule({
  declarations: [SafeReferenceDataDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
  ],
  exports: [SafeReferenceDataDropdownComponent],
})
export class SafeReferenceDataDropdownModule {}
