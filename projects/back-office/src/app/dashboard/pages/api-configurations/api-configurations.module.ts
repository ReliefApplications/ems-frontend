import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigurationsRoutingModule } from './api-configurations-routing.module';
import { ApiConfigurationsComponent } from './api-configurations.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeButtonModule } from '@safe/builder';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ApiConfigurationsComponent, AddApiConfigurationComponent],
  imports: [
    CommonModule,
    ApiConfigurationsRoutingModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AngularFormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    SafeButtonModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslateModule,
  ],
  exports: [ApiConfigurationsComponent],
})
export class ApiConfigurationsModule {}
