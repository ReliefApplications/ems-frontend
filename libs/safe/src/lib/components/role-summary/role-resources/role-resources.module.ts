import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TooltipModule, IconModule } from '@oort-front/ui';
import { FilterComponent } from '../role-resources-filter/role-resources-filter.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule, FormWrapperModule } from '@oort-front/ui';
import { ResourceFieldsComponent } from './resource-fields/resource-fields.component';
import { SafeRoleResourceFiltersComponent } from './resource-access-filters/resource-access-filters.component';
import { SafeFilterModule } from '../../filter/filter.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [
    RoleResourcesComponent,
    FilterComponent,
    ResourceFieldsComponent,
    SafeRoleResourceFiltersComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    TooltipModule,
    MatPaginatorModule,
    TranslateModule,
    SafeDateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    SpinnerModule,
    FormWrapperModule,
    IconModule,
    SafeFilterModule,
    MatSelectModule,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
