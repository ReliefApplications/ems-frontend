import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  DialogModule,
  SelectMenuModule,
  FormWrapperModule,
  ButtonModule,
} from '@oort-front/ui';

/** Interface for the dialog data input */
interface DialogData {
  templates: any[];
}

/** Component for choosing an email template to send an email with */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  selector: 'safe-email-template-modal',
  templateUrl: './email-template-modal.component.html',
  styleUrls: ['./email-template-modal.component.scss'],
})
export class EmailTemplateModalComponent implements OnInit {
  public templates: any[] = [];
  public form = this.fb.group({
    template: [null, Validators.required],
  });

  /**
   * Component for choosing an email template to send an email with
   *
   * @param dialogRef Ref for the opened dialog
   * @param data This is the data that is passed into the modal when it is opened.
   * @param translate Translate service for translations
   * @param fb Form builder service
   */
  constructor(
    public dialogRef: DialogRef<EmailTemplateModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public translate: TranslateService,
    public fb: FormBuilder
  ) {
    this.templates = data.templates;
  }

  ngOnInit(): void {
    if (this.templates.length === 1)
      this.dialogRef.close({ template: this.templates[0] } as any);
  }
}
