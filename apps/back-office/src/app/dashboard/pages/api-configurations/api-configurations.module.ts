import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationsRoutingModule } from './api-configurations-routing.module';
import { ApiConfigurationsComponent } from './api-configurations.component';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import { IconModule, TooltipModule } from '@oort-front/ui';
import {
  ListFilterComponent,
  SkeletonTableModule,
  StatusOptionsComponent,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  ButtonModule,
  MenuModule,
  SpinnerModule,
  SelectMenuModule,
  TableModule,
  DialogModule,
  FormWrapperModule,
  PaginatorModule,
  ErrorMessageModule,
} from '@oort-front/ui';
import { FilterComponent } from './filter/filter.component';

/**
 * API configurations page module.
 */
@NgModule({
  declarations: [ApiConfigurationsComponent, AddApiConfigurationComponent],
  imports: [
    CommonModule,
    ApiConfigurationsRoutingModule,
    SpinnerModule,
    MenuModule,
    StatusOptionsComponent,
    FormWrapperModule,
    AngularFormsModule,
    ReactiveFormsModule,
    DialogModule,
    IconModule,
    PaginatorModule,
    TranslateModule,
    SkeletonTableModule,
    AbilityModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ErrorMessageModule,
    TableModule,
    TooltipModule,
    ListFilterComponent,
    FilterComponent,
  ],
  exports: [ApiConfigurationsComponent],
})
export class ApiConfigurationsModule {}
