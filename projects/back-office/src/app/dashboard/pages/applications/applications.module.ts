import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  SafeAccessModule,
  SafeConfirmModalModule,
  SafeButtonModule,
  SafeApplicationsSummaryModule,
  SafeSkeletonTableModule,
  SafeDateModule,
  SafeGraphQLSelectModule,
} from '@safe/builder';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { DuplicateApplicationModule } from '../../../components/duplicate-application/duplicate-application.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterComponent } from './components/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';

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
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    SafeConfirmModalModule,
    SafeAccessModule,
    DuplicateApplicationModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    SafeButtonModule,
    MatButtonModule,
    MatPaginatorModule,
    SafeApplicationsSummaryModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    SafeGraphQLSelectModule
  ],
  exports: [ApplicationsComponent],
})
export class ApplicationsModule {}
