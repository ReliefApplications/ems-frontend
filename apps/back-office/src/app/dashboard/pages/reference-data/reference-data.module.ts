import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { SafeAccessModule } from '@oort-front/safe';
import { GraphQLSelectModule, IconModule, SpinnerModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  TooltipModule,
  ButtonModule as UiButtonModule,
  SelectMenuModule,
  TextareaModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

/**
 * Reference Data page module.
 */
@NgModule({
  declarations: [ReferenceDataComponent],
  imports: [
    CommonModule,
    ReferenceDataRoutingModule,
    SafeAccessModule,
    SpinnerModule,
    ReactiveFormsModule,
    TranslateModule,
    IconModule,
    GridModule,
    TooltipModule,
    GraphQLSelectModule,
    ButtonModule,
    TextareaModule,
    UiButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    MonacoEditorModule,
    FormsModule,
  ],
})
export class ReferenceDataModule {}
