import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {
  SafeAccessModule,
  SafeButtonModule,
  SafeApplicationsSummaryModule,
  SafeSkeletonTableModule,
  SafeDateModule,
  SafeGraphQLSelectModule,
  SafeModalModule,
  SafeDividerModule,
} from '@oort-front/safe';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { FilterComponent } from './components/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
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
    SafeAccessModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SafeButtonModule,
    MatButtonModule,
    MatPaginatorModule,
    SafeApplicationsSummaryModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
    SafeDividerModule,
    AbilityModule,
  ],
  exports: [ApplicationsComponent],
})
export class ApplicationsModule {}
