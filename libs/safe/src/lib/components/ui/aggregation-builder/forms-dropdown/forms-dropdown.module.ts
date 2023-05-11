import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeIconModule } from '../../icon/icon.module';
import { SpinnerModule } from '@oort-front/ui';

/**
 * SafeRecordSummaryModule is the module related to the selection of forms by a dropdown menu.
 */
@NgModule({
  declarations: [SafeFormsDropdownComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    SafeIconModule,
    SpinnerModule,
  ],
  exports: [SafeFormsDropdownComponent],
})
export class SafeFormsDropdownModule {}
