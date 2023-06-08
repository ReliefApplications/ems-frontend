import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFilterComponent } from './filter.component';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { FilterRowComponent } from './filter-row/filter-row.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  DateModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Composite Filter module.
 */
@NgModule({
  declarations: [SafeFilterComponent, FilterGroupComponent, FilterRowComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TooltipModule,
    MatDatepickerModule,
    ButtonModule,
    SelectMenuModule,
    DateModule,
    FormWrapperModule,
  ],
  exports: [SafeFilterComponent],
})
export class SafeFilterModule {}
