import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDatasRoutingModule } from './reference-datas-routing.module';
import { ReferenceDatasComponent } from './reference-datas.component';
import { MenuModule } from '@oort-front/ui';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SafeButtonModule,
  SafeDateModule,
  SafeSkeletonTableModule,
} from '@oort-front/safe';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { AddReferenceDataComponent } from './add-reference-data/add-reference-data.component';
import { AbilityModule } from '@casl/angular';
import { DialogModule } from '@oort-front/ui';

/**
 * List of reference data page module
 */
@NgModule({
  declarations: [ReferenceDatasComponent, AddReferenceDataComponent],
  imports: [
    CommonModule,
    MenuModule,
    ReferenceDatasRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    AngularFormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    DialogModule,
    AbilityModule,
  ],
  exports: [ReferenceDatasComponent],
})
export class ReferenceDatasModule {}
