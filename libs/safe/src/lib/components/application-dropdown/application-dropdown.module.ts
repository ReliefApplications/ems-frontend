import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationDropdownComponent } from './application-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule, FormWrapperModule } from '@oort-front/ui';
/**
 * SafeApplicationDropdownModule is a class used to manage all the modules and components
 * related to the dropdown forms where you can select applications.
 */
@NgModule({
  declarations: [SafeApplicationDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [SafeApplicationDropdownComponent],
})
export class SafeApplicationDropdownModule {}
