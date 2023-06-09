import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SpinnerModule,
  FormWrapperModule,
  AutocompleteModule,
  IconModule,
} from '@oort-front/ui';

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
    MatAutocompleteModule,
    IconModule,
    SpinnerModule,
    FormWrapperModule,
    AutocompleteModule,
  ],
  exports: [SafeFormsDropdownComponent],
})
export class SafeFormsDropdownModule {}
