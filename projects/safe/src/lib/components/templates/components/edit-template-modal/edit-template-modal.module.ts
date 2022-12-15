import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { EditTemplateModalComponent } from './edit-template-modal.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SafePlaceholderModule } from '../../../../pipes/placeholder/placeholder.module';

/**
 * Modal to select email template.
 */
@NgModule({
  declarations: [EditTemplateModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    EditorModule,
    SafePlaceholderModule,
  ],
  exports: [EditTemplateModalComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class EditTemplateModalModule {}
