import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationsRoutingModule } from './api-configurations-routing.module';
import { ApiConfigurationsComponent } from './api-configurations.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { SafeModalModule, SafeSkeletonTableModule } from '@oort-front/safe';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  ButtonModule,
  ChipModule,
  MenuModule,
  SpinnerModule,
  TableModule,
  FormWrapperModule,
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
    MatFormFieldModule,
    FormWrapperModule,
    MatSelectModule,
    AngularFormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeModalModule,
    AbilityModule,
    ButtonModule,
    TableModule,
  ],
  exports: [ApiConfigurationsComponent],
})
export class ApiConfigurationsModule {}
