import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { FilterRowComponent } from './filter-row/filter-row.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  DateModule,
  TooltipModule,
} from '@oort-front/ui';
import { PeopleDropdownComponent } from '../../survey/components/people-dropdown/people-dropdown.component';

/**
 * Composite Filter module.
 */
@NgModule({
  declarations: [FilterComponent, FilterGroupComponent, FilterRowComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectMenuModule,
    TooltipModule,
    DateModule,
    FormWrapperModule,
    TooltipModule,
    PeopleDropdownComponent,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
