import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceDropdownComponent } from './resource-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeGraphQLSelectModule } from '../graphql-select/graphql-select.module';

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
    MatSelectModule,
    TranslateModule,
    SafeGraphQLSelectModule,
  ],
  exports: [SafeResourceDropdownComponent],
})
export class SafeResourceDropdownModule {}
