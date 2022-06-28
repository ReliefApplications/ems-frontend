import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeConvertModalComponent } from './convert-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

/**
 * SafeConvertModalModule is a class used to manage all the modules and components
 * related to the modals for the configuration of the convertion in grids.
 */
@NgModule({
  declarations: [SafeConvertModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatListModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  exports: [SafeConvertModalComponent],
})
export class SafeConvertModalModule {}
