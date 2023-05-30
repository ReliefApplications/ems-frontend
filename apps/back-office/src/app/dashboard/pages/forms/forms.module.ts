import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { SafeSkeletonTableModule, SafeDateModule } from '@oort-front/safe';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  DividerModule,
  MenuModule,
  ButtonModule,
  IconModule,
  SpinnerModule,
  SelectMenuModule,
  FormWrapperModule,
  TableModule,
  ChipModule,
  DateModule,
  PaginatorModule,
} from '@oort-front/ui';

/** Forms page module */
@NgModule({
  declarations: [FormsComponent, FilterComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    AngularFormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatSortModule,
    MenuModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    DividerModule,
    PaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    AbilityModule,
    ButtonModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    TableModule,
    ChipModule,
    DateModule,
  ],
  exports: [FormsComponent],
})
export class FormsModule {}
