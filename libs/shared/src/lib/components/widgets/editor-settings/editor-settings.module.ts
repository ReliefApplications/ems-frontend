import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorSettingsComponent } from './editor-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  EditorModule as TinyMceEditorModule,
  TINYMCE_SCRIPT_SRC,
} from '@tinymce/tinymce-angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  CheckboxModule,
  DividerModule,
  FormWrapperModule,
  GraphQLSelectModule,
  IconModule,
  RadioModule,
  SelectMenuModule,
  SelectOptionModule,
  TabsModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { EditorModule } from '../editor/editor.module';
import { AggregationOriginSelectComponent } from '../../aggregation/aggregation-origin-select/aggregation-origin-select.component';
import { DatasourceSelectionTabComponent } from './datasource-selection-tab/datasource-selection-tab.component';

/**
 * Module for the EditorSetting component
 */
@NgModule({
  declarations: [EditorSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TinyMceEditorModule,
    TranslateModule,
    DisplaySettingsComponent,
    EditorModule,
    GraphQLSelectModule,
    SelectMenuModule,
    SelectOptionModule,
    ButtonModule,
    TabsModule,
    TooltipModule,
    IconModule,
    CheckboxModule,
    RadioModule,
    DividerModule,
    ToggleModule,
    AggregationOriginSelectComponent,
    DatasourceSelectionTabComponent,
  ],
  exports: [EditorSettingsComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class EditorSettingsModule {}
