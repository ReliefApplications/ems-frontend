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
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';



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
    MatDialogModule,
    MatChipsModule,
    UploadsModule,
    TextFieldModule,
    MatIconModule
  ],
  exports: [SafeEmailPreviewComponent],
})
export class SafeEmailPreviewModule {}
