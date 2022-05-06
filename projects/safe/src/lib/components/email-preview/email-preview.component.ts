import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import ClassicEditor from '../../../ckeditor';

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

  /** editor for the body of the email */
  public editor = ClassicEditor;

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
      from: [{ value: this.data.from, disabled: true }],
      to: [{ value: this.data.to, disabled: true }],
      subject: [{ value: this.data.subject, disabled: true }],
      html: this.data.html,
      files: [[]],
    });
    this.form.value.html = this.styleTable(
      this.form.value.html,
      'margin: 0.9em auto;border-collapse: collapse;border-spacing: 0;',
      'border:1px solid black; min-width: 2em;padding: 0.8em;'
    );
  }

  /** Handles the modification of the html value of the form when the content of the editor is changed
   *  @param ChangeEvent Event that fires the function
   *
   */
  public onChange({ editor }: ChangeEvent): void {
    this.form.value.html = this.styleTable(
      editor.getData(),
      'margin: 0.9em auto;border-collapse: collapse;border-spacing: 0;',
      'min-width: 2em;padding: 0.4em;'
    );
  }

  /** Changes the basic styling of the tables to fit the global CSS of CKEditor
   *  @param str The string containing the HTML information
   *  @param cssTable The CSS information to add to the table tags
   *  @param cssTable The CSS information to add to the td/th tags
   *
   *  @returns The modified string containing the HTML information
   */
  public styleTable(str: string, cssTable: string, cssTdTh: string): string {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(str, 'text/html');
    const selectionTable = htmlDoc.body.querySelectorAll('table');
    const selectionTdTh = htmlDoc.body.querySelectorAll('td,th');
    if (selectionTable !== null && selectionTdTh !== null) {
      Array.from(selectionTable).map(
        (elt: any) => (elt.style.cssText += cssTable)
      );
      Array.from(selectionTdTh).map(
        (elt: any) => (elt.style.cssText += cssTdTh)
      );
    }
    return htmlDoc.body.innerHTML;
  }
}
