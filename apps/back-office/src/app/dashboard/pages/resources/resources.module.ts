import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeSkeletonTableModule, SafeDateModule } from '@oort-front/safe';
import { FilterComponent } from './filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuModule,
  ButtonModule,
  SpinnerModule,
  TableModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  DateModule,
} from '@oort-front/ui';

/**
 * Resources page module.
 */
@NgModule({
  declarations: [ResourcesComponent, FilterComponent],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    SpinnerModule,
    IconModule,
    MenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    PaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    ButtonModule,
    FormWrapperModule,
    TableModule,
    DateModule,
  ],
  exports: [ResourcesComponent],
})
export class ResourcesModule {}
