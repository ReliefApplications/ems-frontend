import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDatasRoutingModule } from './reference-datas-routing.module';
import { ReferenceDatasComponent } from './reference-datas.component';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SafeDateModule, SafeSkeletonTableModule } from '@oort-front/safe';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule } from '@ngx-translate/core';
import { AddReferenceDataComponent } from './add-reference-data/add-reference-data.component';
import { AbilityModule } from '@casl/angular';
import {
  MenuModule,
  ButtonModule,
  FormWrapperModule,
  IconModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { FilterComponent } from './components/filter/filter.component';

/**
 * List of reference data page module
 */
@NgModule({
  declarations: [
    ReferenceDatasComponent,
    AddReferenceDataComponent,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    MenuModule,
    ReferenceDatasRoutingModule,
    MatSortModule,
    MatFormFieldModule,
    AngularFormsModule,
    ReactiveFormsModule,
    IconModule,
    MatButtonModule,
    PaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    DialogModule,
    AbilityModule,
    ButtonModule,
    FormWrapperModule,
    TableModule,
  ],
  exports: [ReferenceDatasComponent],
})
export class ReferenceDatasModule {}
