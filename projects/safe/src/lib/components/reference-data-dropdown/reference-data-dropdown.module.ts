import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeReferenceDataDropdownComponent } from './reference-data-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
