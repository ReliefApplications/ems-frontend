import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsDocsPropertiesDropdownComponent } from './cs-docs-properties-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * CsDocsPropertiesDropdownComponent is a class used to manage all the modules and components
 * related to the dropdowns for cs doc api properties selection.
 */
@NgModule({
  declarations: [CsDocsPropertiesDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectMenuModule,
    ButtonModule,
    TooltipModule,
    FormWrapperModule,
    SpinnerModule,
  ],
  exports: [CsDocsPropertiesDropdownComponent],
})
export class CsDocsPropertiesDropdownModule {}
