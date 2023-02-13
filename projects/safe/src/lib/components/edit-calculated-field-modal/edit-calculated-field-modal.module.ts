import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditCalculatedFieldModalComponent } from './edit-calculated-field-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SafeModalModule } from '../ui/modal/modal.module';
import { MatSelectModule } from '@angular/material/select';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

/**
 * Modal to edit Calculated field settings.
 */
@NgModule({
  declarations: [SafeEditCalculatedFieldModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SafeModalModule,
    EditorModule,
  ],
  exports: [SafeEditCalculatedFieldModalComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeEditCalculatedFieldModalModule {}
