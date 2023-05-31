import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDatasRoutingModule } from './reference-datas-routing.module';
import { ReferenceDatasComponent } from './reference-datas.component';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SafeDateModule, SafeSkeletonTableModule } from '@oort-front/safe';
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

/**
 * List of reference data page module
 */
@NgModule({
  declarations: [ReferenceDatasComponent, AddReferenceDataComponent],
  imports: [
    CommonModule,
    MenuModule,
    ReferenceDatasRoutingModule,
    AngularFormsModule,
    ReactiveFormsModule,
    IconModule,
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
