import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorSettingsComponent } from './editor-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';

/**
 * Module for the safeEditorSetting component
 */
@NgModule({
  declarations: [SafeEditorSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    EditorModule,
    TranslateModule,
    MatTabsModule,
    SafeIconModule,
    MatTooltipModule,
    DisplaySettingsComponent,
  ],
  exports: [SafeEditorSettingsComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeEditorSettingsModule {}
