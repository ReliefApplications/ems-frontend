import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';
import { TranslateModule } from '@ngx-translate/core';
import { DateModule } from '../../../pipes/date/date.module';
import { SkeletonTableModule } from '../../../components/skeleton/skeleton-table/skeleton-table.module';
import {
  TooltipModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
  DateModule as UiDateModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { FilterComponent } from '../role-resources-filter/role-resources-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { ResourceFieldsComponent } from './resource-fields/resource-fields.component';
import { RoleResourceFiltersComponent } from './resource-access-filters/resource-access-filters.component';
import { FilterModule } from '../../filter/filter.module';
import { ListFilterComponent } from '../../list-filter/list-filter.component';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [
    RoleResourcesComponent,
    FilterComponent,
    ResourceFieldsComponent,
    RoleResourceFiltersComponent,
  ],
  imports: [
    CommonModule,
    TooltipModule,
    PaginatorModule,
    TranslateModule,
    UiDateModule,
    SkeletonTableModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    FormWrapperModule,
    IconModule,
    FilterModule,
    SelectMenuModule,
    ButtonModule,
    TableModule,
    DateModule,
    ListFilterComponent,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
