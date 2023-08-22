import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorSettingsComponent } from './editor-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
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
import { RecordSelectionTabComponent } from './record-selection-tab/record-selection-tab.component';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { SafeEditorModule } from '../editor/editor.module';

/**
 * Module for the safeEditorSetting component
 */
@NgModule({
  declarations: [SafeEditorSettingsComponent, RecordSelectionTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    EditorModule,
    TranslateModule,
    DisplaySettingsComponent,
    SafeCoreGridModule,
    SafeEditorModule,
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
  ],
  exports: [SafeEditorSettingsComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeEditorSettingsModule {}
