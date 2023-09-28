import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandedCommentComponent } from './expanded-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  TextareaModule,
  FormWrapperModule,
  DialogModule,
} from '@oort-front/ui';

/** Module for expanded comment component */
@NgModule({
  declarations: [ExpandedCommentComponent],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TextareaModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [ExpandedCommentComponent],
})
export class ExpandedCommentModule {}
