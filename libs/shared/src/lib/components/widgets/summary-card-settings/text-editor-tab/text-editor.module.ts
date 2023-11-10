import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { TextEditorTabComponent } from './text-editor-tab.component';
import { AlertModule, IconModule, DialogModule, GraphQLSelectModule, ButtonModule } from '@oort-front/ui';

/** Text editor tab Module for summary cards edition */
@NgModule({
  declarations: [TextEditorTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    IconModule,
    DialogModule,
    GraphQLSelectModule,
    ButtonModule,
  ],
  exports: [TextEditorTabComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TextEditorTabModule {}
