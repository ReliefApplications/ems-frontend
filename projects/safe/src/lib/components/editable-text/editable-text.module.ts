import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditableTextComponent } from './editable-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatInputModule } from '@angular/material/input';

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
    SafeButtonModule,
  ],
  exports: [SafeEditableTextComponent],
})
export class SafeEditableTextModule {}
