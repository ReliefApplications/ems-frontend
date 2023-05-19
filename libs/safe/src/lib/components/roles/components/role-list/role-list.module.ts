import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SpinnerModule } from '@oort-front/ui';
import { MenuModule } from '@oort-front/ui';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';
import { SafeRoleListComponent } from './role-list.component';
import { DividerModule } from '@oort-front/ui';
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
    SpinnerModule,
    MatTableModule,
    MenuModule,
    MatIconModule,
    MatSortModule,
    MatAutocompleteModule,
    DividerModule,
    SafeButtonModule,
    TranslateModule,
    SafeSkeletonTableModule,
    AbilityModule,
  ],
  exports: [SafeRoleListComponent],
})
export class SafeRoleListModule {}
