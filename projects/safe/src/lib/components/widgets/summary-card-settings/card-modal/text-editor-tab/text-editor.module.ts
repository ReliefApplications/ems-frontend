import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SafeTextEditorTabComponent } from './text-editor-tab.component';

/** Data Source Module */
@NgModule({
  declarations: [SafeTextEditorTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [SafeTextEditorTabComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeTextEditorTabModule {}
