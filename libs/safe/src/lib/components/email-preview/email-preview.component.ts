import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EMAIL_EDITOR_CONFIG } from '../../const/tinymce.const';
import { SafeEditorService } from '../../services/editor/editor.service';

/** Interface of Email Preview Modal Data */
interface DialogData {
  from: string;
  html: string;
  subject: string;
  to: string[];
}

/** Regex pattern for email */
// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/** Key codes of separators */
const SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

/**
 * Preview Email component.
 * Modal in read-only mode.
 */
@Component({
  selector: 'safe-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss'],
})
export class SafeEmailPreviewComponent {
  /** mail is put in a form to use read-only inputs */ // we want to change that
  public form = this.fb.group({
    from: [{ value: this.data.from, disabled: true }],
    to: [{ value: this.data.to, disabled: false }, Validators.required],
    subject: [this.data.subject, Validators.required],
    html: this.data.html,
    files: [[]],
  });

  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  @ViewChild('emailsInput') emailsInput!: ElementRef<HTMLInputElement>;

  /** @returns list of emails */
  get emails(): string[] {
    return this.form.get('to')?.value || [];
  }

  /**
   * Get error message of field
   *
   * @returns error message
   */
  get emailsError(): string {
    const control = this.form.get('to');
    if (control?.hasError('required')) {
      return 'components.distributionLists.errors.emails.required';
    }
    if (control?.hasError('pattern')) {
      return 'components.distributionLists.errors.emails.pattern';
    }
    return '';
  }

  /**
   * Preview Email component.
   * Modal in read-only mode.
   *
   * @param data injected dialog data
   * @param dialogRef Dialog reference
   * @param fb Angular Form Builder
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    public dialogRef: DialogRef<SafeEmailPreviewComponent>,
    private fb: FormBuilder,
    private editorService: SafeEditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  addEmail(event: any): void {
    const control = this.form.get('to');
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const value: string =
          event.type === 'focusout'
            ? this.emailsInput.nativeElement.value
            : event;

        // Add the mail
        const emails = [...this.emails];
        if ((value || '').trim()) {
          if (EMAIL_REGEX.test(value.trim())) {
            emails.push(value.trim());
            control?.setValue(emails);
            control?.updateValueAndValidity();
            if (event.type === 'focusout') {
              this.emailsInput.nativeElement.value = '';
            }
          } else {
            control?.setErrors({ pattern: true });
          }
        } else {
          // no value
          control?.setErrors({ pattern: false });
          control?.updateValueAndValidity();
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  /**
   * Remove an email from the distribution list
   *
   * @param email The email to remove
   */
  removeEmail(email: string): void {
    const emails = [...this.emails];
    const index = emails.indexOf(email);
    if (index >= 0) {
      emails.splice(index, 1);
      this.form.get('to')?.setValue(emails);
      this.form.get('to')?.updateValueAndValidity();
    }
  }
}
