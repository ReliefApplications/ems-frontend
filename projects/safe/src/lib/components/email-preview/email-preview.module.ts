import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmailPreviewComponent } from './email-preview.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { EditorModule } from '@progress/kendo-angular-editor';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

/**
 * Preview Email Component Module.
 */
@NgModule({
  declarations: [SafeEmailPreviewComponent],
  imports: [
    CKEditorModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatChipsModule,
    UploadsModule,
    EditorModule,
    InputsModule,
    ButtonsModule
  ],
  exports: [SafeEmailPreviewComponent],
})
export class SafeEmailPreviewModule {}
