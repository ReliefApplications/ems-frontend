import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** Interface of Email Preview Modal Data */
interface DialogData {
  from: string;
  html: string;
  dataset: string;
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

  public isEditable = false;

  public datasetView: SafeHtml = '';

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
    this.setDatasetView(this.data.dataset);
    this.form = this.formBuilder.group({
      from: [{value: this.data.from, disabled: true }],
      to: [{value: this.data.to, disabled: true }],
      subject: [{value: this.data.subject, disabled: true }],
      files: [[]]
    });
  }

  /**
   * Creates the preview html changing dataset keys to its value
   *
   * @param fields list of fields saved in settings
   */
  private setDatasetView(dataset: string): void {
    this.datasetView = this.sanitizer.bypassSecurityTrustHtml(this.data.html.replace(new RegExp('{dataset}', 'g'), dataset));
  }

  /** Changes edition state and updates the preview when needed */
  public onButtonClick(): void {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.setDatasetView(this.data.dataset);
    }
  }
}
