import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableTextComponent } from './editable-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, FormWrapperModule, TooltipModule } from '@oort-front/ui';

/**
 * Module of editable text
 */
@NgModule({
  declarations: [EditableTextComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
  ],
  exports: [EditableTextComponent],
})
export class EditableTextModule {}
