import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceDropdownComponent } from './resource-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GraphQLSelectModule } from '@oort-front/ui';

/**
 * ResourceDropdownModule is a class used to manage all the modules and components
 * related to the dropdowns for resource selection.
 */
@NgModule({
  declarations: [ResourceDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GraphQLSelectModule,
  ],
  exports: [ResourceDropdownComponent],
})
export class ResourceDropdownModule {}
