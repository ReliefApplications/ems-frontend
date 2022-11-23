import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeExpandedCommentComponent } from './expanded-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../modal/modal.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  ],
  exports: [SafeExpandedCommentComponent],
})
export class SafeExpandedCommentModule {}
