import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmailPreviewComponent } from './email-preview.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * Preview Email Component Module.
 */
@NgModule({
  declarations: [SafeEmailPreviewComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    UploadsModule,
    EditorModule,
    SafeModalModule,
  ],
  exports: [SafeEmailPreviewComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeEmailPreviewModule {}
