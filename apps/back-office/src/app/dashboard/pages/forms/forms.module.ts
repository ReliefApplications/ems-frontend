import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { SafeSkeletonTableModule, SafeDateModule } from '@oort-front/safe';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
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
  SelectOptionModule,
  FormWrapperModule
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
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MenuModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    DividerModule,
    MatPaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    AbilityModule,
    ButtonModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    SelectOptionModule,
  ],
  exports: [FormsComponent],
})
export class FormsModule {}
