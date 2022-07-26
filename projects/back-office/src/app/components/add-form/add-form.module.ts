import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFormComponent } from './add-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '@safe/builder';

/**
 * Add form module.
 */
@NgModule({
  declarations: [AddFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatChipsModule,
    TranslateModule,
    SafeIconModule,
  ],
  exports: [AddFormComponent],
})
export class AddFormModule {}
