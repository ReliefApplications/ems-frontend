import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuplicateApplicationModalComponent } from './duplicate-application-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '@safe/builder';

/**
 * Duplicate Application module.
 */
@NgModule({
  declarations: [DuplicateApplicationModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [DuplicateApplicationModalComponent],
})
export class DuplicateApplicationModalModule {}
