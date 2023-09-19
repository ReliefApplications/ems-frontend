import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import {
  SkeletonTableModule,
  DateModule as SharedDateModule,
} from '@oort-front/shared';
import {
  FormsModule as AngularFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  DividerModule,
  MenuModule,
  ButtonModule,
  IconModule,
  SpinnerModule,
  SelectMenuModule,
  FormWrapperModule,
  TableModule,
  ChipModule,
  DateModule,
  PaginatorModule,
  TooltipModule,
} from '@oort-front/ui';

/** Forms page module */
@NgModule({
  declarations: [FormsComponent, FilterComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    AngularFormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MenuModule,
    DividerModule,
    PaginatorModule,
    TranslateModule,
    SkeletonTableModule,
    SharedDateModule,
    AbilityModule,
    ButtonModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    TableModule,
    ChipModule,
    DateModule,
    TooltipModule,
  ],
  exports: [FormsComponent],
})
export class FormsModule {}
