import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { RoleFormsComponent } from './role-forms/role-forms.component';
import { SafeRoleFormFiltersComponent } from './role-forms/role-form-filters/role-form-filters.component';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [
    RoleResourcesComponent,
    RoleFormsComponent,
    SafeRoleFormFiltersComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
    SafeDateModule,
    SafeIconModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    SafeQueryBuilderModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
