import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddResourceModalComponent } from './add-resource-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '@safe/builder';

/**
 * Modal to add a new resource
 */
@NgModule({
  declarations: [AddResourceModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [AddResourceModalComponent],
})
export class AddResourceModalModule {}
