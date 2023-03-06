import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddResourceModalComponent } from './add-resource-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
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
