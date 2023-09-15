import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeReferenceDataDropdownComponent } from './reference-data-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, GraphQLSelectModule } from '@oort-front/ui';

/**
 * Reference data dropdown module.
 */
@NgModule({
  declarations: [SafeReferenceDataDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    GraphQLSelectModule,
  ],
  exports: [SafeReferenceDataDropdownComponent],
})
export class SafeReferenceDataDropdownModule {}
