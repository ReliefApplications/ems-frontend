import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { SpinnerModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeSkeletonTableModule, SafeDateModule } from '@oort-front/safe';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { FilterComponent } from './filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule, ButtonModule } from '@oort-front/ui';

/**
 * Resources page module.
 */
@NgModule({
  declarations: [ResourcesComponent, FilterComponent],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    SpinnerModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MenuModule,
    MatSortModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    ButtonModule,
    FormWrapperModule,
    IconModule,
  ],
  exports: [ResourcesComponent],
})
export class ResourcesModule {}
