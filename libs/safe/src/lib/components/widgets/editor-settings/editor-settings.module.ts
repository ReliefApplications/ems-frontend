import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorSettingsComponent } from './editor-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule } from '@oort-front/ui';

/**
 * Module for the safeEditorSetting component
 */
@NgModule({
  declarations: [SafeEditorSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    EditorModule,
    TranslateModule,
  ],
  exports: [SafeEditorSettingsComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeEditorSettingsModule {}
