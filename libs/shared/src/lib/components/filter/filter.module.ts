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
  SpinnerModule,
} from '@oort-front/ui';

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
    SpinnerModule,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
