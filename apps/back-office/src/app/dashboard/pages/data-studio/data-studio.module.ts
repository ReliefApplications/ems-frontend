import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStudioComponent } from '../data-studio/data-studio.component';
import {
  ButtonModule,
  CheckboxModule,
  DateModule as UiDateModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  SelectMenuModule,
  SelectOptionModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  ExpansionPanelModule,
  GraphQLSelectModule,
  RadioModule,
  ToggleModule,
} from '@oort-front/ui';
import {
  ListFilterComponent,
  SkeletonTableModule,
  DateModule,
} from '@oort-front/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataStudioRoutingModule } from './data-studio-routing.module';
import { DataGenerationFieldsComponent } from './data-generation-fields/data-generation-fields.component';
import { SurveyModule } from 'survey-angular-ui';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

/** Data studio module */
@NgModule({
  declarations: [DataStudioComponent, DataGenerationFieldsComponent],
  imports: [
    CommonModule,
    TooltipModule,
    PaginatorModule,
    TranslateModule,
    UiDateModule,
    SkeletonTableModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    ButtonModule,
    TableModule,
    DateModule,
    ListFilterComponent,
    DataStudioRoutingModule,
    SelectOptionModule,
    TabsModule,
    CheckboxModule,
    ExpansionPanelModule,
    GraphQLSelectModule,
    RadioModule,
    ToggleModule,
    SurveyModule,
    DateModule,
    InputsModule,
    DateInputsModule,
  ],
})
export class DataStudioModule {}
