import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { SafeSkeletonTableModule } from '../../../components/skeleton/skeleton-table/skeleton-table.module';
import {
  TooltipModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { FilterComponent } from '../role-resources-filter/role-resources-filter.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { ResourceFieldsComponent } from './resource-fields/resource-fields.component';
import { SafeRoleResourceFiltersComponent } from './resource-access-filters/resource-access-filters.component';
import { SafeFilterModule } from '../../filter/filter.module';

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
    TooltipModule,
    PaginatorModule,
    TranslateModule,
    SafeDateModule,
    SafeIconModule,
    SafeSkeletonTableModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    SpinnerModule,
    FormWrapperModule,
    IconModule,
    SafeFilterModule,
    SelectMenuModule,
    ButtonModule,
    TableModule,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
