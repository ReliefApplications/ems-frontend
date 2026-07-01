import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableTextComponent } from './editable-text.component';
import { EditableLocalizedTextComponent } from './editable-localized-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, FormWrapperModule, TooltipModule } from '@oort-front/ui';
import { LocalizedInputComponent } from '../controls/public-api';

/**
 * Module of editable text
 */
@NgModule({
  declarations: [EditableTextComponent, EditableLocalizedTextComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    LocalizedInputComponent,
  ],
  exports: [EditableTextComponent, EditableLocalizedTextComponent],
})
export class EditableTextModule {}
