import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditDerivedFieldModalComponent } from './edit-derived-field-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { MatSelectModule } from '@angular/material/select';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

/**
 * Modal to edit derived field settings.
 */
@NgModule({
  declarations: [SafeEditDerivedFieldModalComponent],
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
  exports: [SafeEditDerivedFieldModalComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeEditDerivedFieldModalModule {}
