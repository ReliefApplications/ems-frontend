import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceDropdownComponent } from './resource-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { GraphQLSelectModule } from '@oort-front/ui';

/**
 * SafeResourceDropdownModule is a class used to manage all the modules and components
 * related to the dropdowns for resource selection.
 */
@NgModule({
  declarations: [SafeResourceDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    GraphQLSelectModule,
  ],
  exports: [SafeResourceDropdownComponent],
})
export class SafeResourceDropdownModule {}
