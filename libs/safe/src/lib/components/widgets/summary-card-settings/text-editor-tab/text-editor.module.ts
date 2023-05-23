import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SafeTextEditorTabComponent } from './text-editor-tab.component';
import { SafeAlertModule } from '../../../ui/alert/alert.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';

/** Text editor tab Module for summary cards edition */
@NgModule({
  declarations: [SafeTextEditorTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    SafeAlertModule,
    SafeIconModule,
  ],
  exports: [SafeTextEditorTabComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeTextEditorTabModule {}
