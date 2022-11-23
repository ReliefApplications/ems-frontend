import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../ui/modal/modal.module';
import { EmailTemplateModalComponent } from './email-template-modal.component';

/**
 * Modal to select email template.
 */
@NgModule({
  declarations: [EmailTemplateModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [EmailTemplateModalComponent],
})
export class EmailTemplateModalModule {}
