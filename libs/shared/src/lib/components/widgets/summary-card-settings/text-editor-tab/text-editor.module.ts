import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { TextEditorTabComponent } from './text-editor-tab.component';
import { AlertModule, IconModule, SpinnerModule } from '@oort-front/ui';
import { LocalizedEditorComponent } from '../../../controls/public-api';

/** Text editor tab Module for summary cards edition */
@NgModule({
  declarations: [TextEditorTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    IconModule,
    SpinnerModule,
    LocalizedEditorComponent,
  ],
  exports: [TextEditorTabComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TextEditorTabModule {}
