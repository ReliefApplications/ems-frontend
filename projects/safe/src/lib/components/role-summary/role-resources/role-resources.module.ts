import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeSkeletonTableModule } from '../../../components/skeleton/skeleton-table/skeleton-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { FilterComponent } from '../role-resources-filter/role-resources-filter.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleResourceAccessComponent } from './role-resource-access/role-resource-access.component';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [
    RoleResourcesComponent,
    FilterComponent,
    RoleResourceAccessComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
    SafeDateModule,
    SafeIconModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
