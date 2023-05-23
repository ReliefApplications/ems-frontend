import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { SafeExpandedCommentComponent } from './expanded-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../modal/modal.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ButtonModule, TextareaModule } from '@oort-front/ui';

/** Module for expanded comment component */
@NgModule({
  declarations: [SafeExpandedCommentComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeModalModule,
    MatInputModule,
    MatFormFieldModule,
    TextareaModule,
    ButtonModule,
  ],
  exports: [SafeExpandedCommentComponent],
})
export class SafeExpandedCommentModule {}
