import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataDropdownComponent } from './reference-data-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, ButtonModule, TooltipModule } from '@oort-front/ui';
import { ReferenceDataSelectComponent } from '../../../components/controls/public-api';

/**
 * Reference data dropdown module.
 */
@NgModule({
  declarations: [ReferenceDataDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    ReferenceDataSelectComponent,
    ButtonModule,
    TooltipModule,
  ],
  exports: [ReferenceDataDropdownComponent],
})
export class ReferenceDataDropdownModule {}
