import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SafeButtonModule,
  SafeSkeletonTableModule,
  SafeDateModule,
} from '@safe/builder';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterComponent } from './filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddResourceModule } from '../../../components/add-resource/add-resource.module';

/**
 * Resources page module.
 */
@NgModule({
  declarations: [ResourcesComponent, FilterComponent],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatSortModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    SafeButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
    AddResourceModule,
    SafeSkeletonTableModule,
    SafeDateModule,
  ],
  exports: [ResourcesComponent],
})
export class ResourcesModule {}
