import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
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
    IconModule,
    SpinnerModule,
    FormWrapperModule,
    AutocompleteModule,
  ],
  exports: [SafeFormsDropdownComponent],
})
export class SafeFormsDropdownModule {}
