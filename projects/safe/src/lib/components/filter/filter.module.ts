import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFilterComponent } from './filter.component';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { FilterRowComponent } from './filter-row/filter-row.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
    SafeButtonModule,
  ],
  exports: [SafeFilterComponent],
})
export class SafeFilterModule {}
