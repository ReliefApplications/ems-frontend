import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExpandedCommentComponent } from './expanded-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {
  ButtonModule,
  TextareaModule,
  FormWrapperModule,
  DialogModule,
} from '@oort-front/ui';

/** Module for expanded comment component */
@NgModule({
  declarations: [SafeExpandedCommentComponent],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatFormFieldModule,
    TextareaModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [SafeExpandedCommentComponent],
})
export class SafeExpandedCommentModule {}
