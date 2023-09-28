import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationDropdownComponent } from './application-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule, FormWrapperModule } from '@oort-front/ui';
/**
 * ApplicationDropdownModule is a class used to manage all the modules and components
 * related to the dropdown forms where you can select applications.
 */
@NgModule({
  declarations: [ApplicationDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [ApplicationDropdownComponent],
})
export class ApplicationDropdownModule {}
