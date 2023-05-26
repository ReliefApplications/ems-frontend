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
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { AddReferenceDataComponent } from './add-reference-data/add-reference-data.component';
import { AbilityModule } from '@casl/angular';
import {
  MenuModule,
  ButtonModule,
  FormWrapperModule,
  IconModule,
  TableModule,
} from '@oort-front/ui';
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
    MatSortModule,
    MatFormFieldModule,
    AngularFormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    DialogModule,
    AbilityModule,
    ButtonModule,
    FormWrapperModule,
    IconModule,
    TableModule,
  ],
  exports: [ReferenceDatasComponent],
})
export class ReferenceDatasModule {}
