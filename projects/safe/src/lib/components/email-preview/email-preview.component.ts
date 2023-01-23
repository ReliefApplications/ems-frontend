import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMAIL_EDITOR_CONFIG } from '../../const/tinymce.const';
import { SafeEditorService } from '../../services/editor/editor.service';

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
  public form!: UntypedFormGroup;

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  /**
   * Preview Email component.
   * Modal in read-only mode.
   *
   * @param data injected dialog data
   * @param dialogRef Dialog reference
   * @param formBuilder Angular Form Builder
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SafeEmailPreviewComponent>,
    private formBuilder: UntypedFormBuilder,
    private editorService: SafeEditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /** Create the form from the dialog data, putting all fields as read-only */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      from: [{ value: this.data.from, disabled: true }],
      to: [{ value: this.data.to, disabled: true }],
      subject: [{ value: this.data.subject, disabled: true }],
      html: this.data.html,
      files: [[]],
    });
  }
}
