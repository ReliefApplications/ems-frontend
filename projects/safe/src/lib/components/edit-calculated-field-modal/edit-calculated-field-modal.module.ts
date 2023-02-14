import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditCalculatedFieldModalComponent } from './edit-calculated-field-modal.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeModalModule } from '../ui/modal/modal.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
