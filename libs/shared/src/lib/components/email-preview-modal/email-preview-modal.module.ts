import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailPreviewModalComponent } from './email-preview-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import {
  ButtonModule,
  ChipModule,
  DialogModule,
  FormWrapperModule,
  ErrorMessageModule,
} from '@oort-front/ui';

/**
 * Preview Email Component Module.
 */
@NgModule({
  declarations: [EmailPreviewModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    UploadsModule,
    EditorModule,
    DialogModule,
    ButtonModule,
    ChipModule,
    ErrorMessageModule,
  ],
  exports: [EmailPreviewModalComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class EmailPreviewModalModule {}
