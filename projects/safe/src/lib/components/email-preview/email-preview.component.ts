import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

/** Interface of Email Preview Modal Data */
interface DialogData {
  from: string;
  html: string;
  subject: string;
  to: string[];
}

/**
 * Preview Email component.
 * Modal in read-only mode.
 */
@Component({
  selector: 'safe-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss'],
})
export class SafeEmailPreviewComponent implements OnInit {

  /** mail is put in a form to use read-only inputs */
  public form!: FormGroup;

  /**
   * Preview Email component.
   * Modal in read-only mode.
   *
   * @param data injected dialog data
   * @param dialogRef Dialog reference
   * @param formBuilder Angular Form Builder
   * @param sanitizer Angular DOM sanitizer
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SafeEmailPreviewComponent>,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  /** Create the form from the dialog data, putting all fields as read-only */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      from: [{value: this.data.from, disabled: true }],
      to: [{value: this.data.to, disabled: true }],
      subject: [{value: this.data.subject, disabled: true }],
      html: [{value: this.sanitizer.bypassSecurityTrustHtml(this.data.html), disabled: true }],
    });
  }
}
