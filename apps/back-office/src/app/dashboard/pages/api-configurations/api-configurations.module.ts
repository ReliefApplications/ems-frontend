import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationsRoutingModule } from './api-configurations-routing.module';
import { ApiConfigurationsComponent } from './api-configurations.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
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
  MenuModule,
  SpinnerModule,
  SelectMenuModule,
  SelectOptionModule,
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
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
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
    SelectMenuModule,
    SelectOptionModule,
    FormWrapperModule,
  ],
  exports: [ApiConfigurationsComponent],
})
export class ApiConfigurationsModule {}
