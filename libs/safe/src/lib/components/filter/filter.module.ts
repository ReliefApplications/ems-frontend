import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFilterComponent } from './filter.component';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { FilterRowComponent } from './filter-row/filter-row.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ButtonModule,
  SelectMenuModule,
  SelectOptionModule,
  FormWrapperModule,
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
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    ButtonModule,
    SelectMenuModule,
    SelectOptionModule,
    FormWrapperModule,
  ],
  exports: [SafeFilterComponent],
})
export class SafeFilterModule {}
