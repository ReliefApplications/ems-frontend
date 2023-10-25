import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationsRoutingModule } from './api-configurations-routing.module';
import { ApiConfigurationsComponent } from './api-configurations.component';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import { SafeSkeletonTableModule } from '@oort-front/safe';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  ButtonModule,
  ChipModule,
  MenuModule,
  SpinnerModule,
  SelectMenuModule,
  TableModule,
  DialogModule,
  FormWrapperModule,
  PaginatorModule,
  ErrorMessageModule,
} from '@oort-front/ui';

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
    ChipModule,
    FormWrapperModule,
    AngularFormsModule,
    ReactiveFormsModule,
    DialogModule,
    IconModule,
    PaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    AbilityModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ErrorMessageModule,
    TableModule,
  ],
  exports: [ApiConfigurationsComponent],
})
export class ApiConfigurationsModule {}
