import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmailTemplateComponent } from './email-template.component';
import { EditorModule } from '@progress/kendo-angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Email template editor component.
 * Implements Control Value Accessor interface, in order to act as a reactive form control.
 */
@NgModule({
  declarations: [SafeEmailTemplateComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  exports: [SafeEmailTemplateComponent],
})
export class SafeEmailTemplateModule {}
