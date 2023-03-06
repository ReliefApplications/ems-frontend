import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import { SafeRoleListComponent } from './role-list.component';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { AbilityModule } from '@casl/angular';

/**
 * BackOfficeRolesModule manages modules and components
 * related to the back-office roles tab
 */
@NgModule({
  declarations: [SafeRoleListComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatSortModule,
    MatAutocompleteModule,
    SafeDividerModule,
    SafeButtonModule,
    TranslateModule,
    SafeSkeletonTableModule,
    AbilityModule,
  ],
  exports: [SafeRoleListComponent],
})
export class SafeRoleListModule {}
