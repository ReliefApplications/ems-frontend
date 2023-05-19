import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDatasRoutingModule } from './reference-datas-routing.module';
import { ReferenceDatasComponent } from './reference-datas.component';
import {
  MenuModule,
  FormWrapperModule,
  IconModule,
  UiModule,
} from '@oort-front/ui';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import {
  SafeButtonModule,
  SafeDateModule,
  SafeModalModule,
  SafeSkeletonTableModule,
} from '@oort-front/safe';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { AddReferenceDataComponent } from './add-reference-data/add-reference-data.component';
import { AbilityModule } from '@casl/angular';

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
    MatInputModule,
    AngularFormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    SafeButtonModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeDateModule,
    SafeModalModule,
    AbilityModule,
    FormWrapperModule,
    IconModule,
    UiModule,
  ],
  exports: [ReferenceDatasComponent],
})
export class ReferenceDatasModule {}
