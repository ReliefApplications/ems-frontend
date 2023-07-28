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
  DateModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { FilterComponent } from '../role-resources-filter/role-resources-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { SafeRoleResourceFiltersComponent } from './resource-access-filters/resource-access-filters.component';
import { ResourceFieldsModule } from './resource-fields/resource-fields.module';
import { SafeFilterModule } from '../../filter/filter.module';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [
    RoleResourcesComponent,
    FilterComponent,
    SafeRoleResourceFiltersComponent,
  ],
  imports: [
    CommonModule,
    TooltipModule,
    PaginatorModule,
    TranslateModule,
    SafeDateModule,
    ResourceFieldsModule,
    SafeSkeletonTableModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    FormWrapperModule,
    IconModule,
    SafeFilterModule,
    SelectMenuModule,
    ButtonModule,
    TableModule,
    DateModule,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
