import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AccessModule,
  ApplicationsSummaryModule,
  SkeletonTableModule,
  DateModule as SharedDateModule,
  ListFilterComponent,
  StatusOptionsComponent,
} from '@oort-front/shared';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { FilterComponent } from './components/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  DialogModule,
  GraphQLSelectModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  ButtonModule,
  MenuModule,
  DividerModule,
  SpinnerModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TableModule,
  PaginatorModule,
  DateModule,
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
    SpinnerModule,
    MenuModule,
    IconModule,
    AccessModule,
    PaginatorModule,
    ApplicationsSummaryModule,
    TranslateModule,
    SkeletonTableModule,
    SharedDateModule,
    GraphQLSelectModule,
    DividerModule,
    AbilityModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    TableModule,
    DateModule,
    StatusOptionsComponent,
    TooltipModule,
    ListFilterComponent,
  ],
  exports: [ApplicationsComponent],
})
export class ApplicationsModule {}
