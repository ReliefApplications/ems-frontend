import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  SafeAccessModule,
  SafeApplicationsSummaryModule,
  SafeSkeletonTableModule,
  SafeDateModule,
  SafeGraphQLSelectModule,
} from '@oort-front/safe';
import { MatSortModule } from '@angular/material/sort';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FilterComponent } from './components/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { DialogModule } from '@oort-front/ui';
import {
  ButtonModule,
  MenuModule,
  DividerModule,
  SpinnerModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  SelectOptionModule,
  TableModule,
  ChipModule,
  PaginatorModule,
} from '@oort-front/ui';

/**
 * Applications page module.
 */
@NgModule({
  declarations: [ApplicationsComponent, ChoseRoleComponent, FilterComponent],
  imports: [
    CommonModule,
    ApplicationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerModule,
    MatSortModule,
    MenuModule,
    MatIconModule,
    SafeAccessModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    PaginatorModule,
    SafeApplicationsSummaryModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    SafeGraphQLSelectModule,
    DividerModule,
    AbilityModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    SelectOptionModule,
    SelectMenuModule,
    SelectOptionModule,
    TableModule,
    ChipModule,
  ],
  exports: [ApplicationsComponent],
})
export class ApplicationsModule {}
