import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddResourceComponent } from './add-resource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Modal to add a new resource
 */
@NgModule({
  declarations: [AddResourceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
  ],
  exports: [AddResourceComponent],
})
export class AddResourceModule {}
