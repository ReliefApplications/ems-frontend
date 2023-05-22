import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditableTextComponent } from './editable-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ButtonModule } from '@oort-front/ui';

/**
 * Module of editable text
 */
@NgModule({
  declarations: [SafeEditableTextComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    ButtonModule,
  ],
  exports: [SafeEditableTextComponent],
})
export class SafeEditableTextModule {}
