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
  IconModule,
  RadioModule,
  SelectMenuModule,
  SelectOptionModule,
  SpinnerModule,
  TabsModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { RecordSelectionTabComponent } from './record-selection-tab/record-selection-tab.component';
import { CoreGridModule } from '../../ui/core-grid/core-grid.module';
import { EditorModule } from '../editor/editor.module';
import {
  ReferenceDataSelectComponent,
  ResourceSelectComponent,
} from '../../controls/public-api';

/**
 * Module for the EditorSetting component
 */
@NgModule({
  declarations: [EditorSettingsComponent, RecordSelectionTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TinyMceEditorModule,
    TranslateModule,
    DisplaySettingsComponent,
    CoreGridModule,
    EditorModule,
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
    ResourceSelectComponent,
    ReferenceDataSelectComponent,
    SpinnerModule,
  ],
  exports: [EditorSettingsComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class EditorSettingsModule {}
