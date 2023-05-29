import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {
  MatLegacyChipInputEvent as MatChipInputEvent,
  MAT_LEGACY_CHIPS_DEFAULT_OPTIONS as MAT_CHIPS_DEFAULT_OPTIONS,
} from '@angular/material/legacy-chips';
import { EMAIL_EDITOR_CONFIG } from '../../const/tinymce.const';
import { SafeEditorService } from '../../services/editor/editor.service';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';

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
 * Function that create a function which returns an object with the separator keys
 *
 * @returns A function which returns an object with the separator keys
 */
export function codesFactory(): () => any {
  const codes = () => ({ separatorKeyCodes: SEPARATOR_KEYS_CODE });
  return codes;
}

/**
 * Preview Email component.
 * Modal in read-only mode.
 */
@Component({
  selector: 'safe-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss'],
  providers: [{ provide: MAT_CHIPS_DEFAULT_OPTIONS, useFactory: codesFactory }],
})
export class SafeEmailPreviewComponent implements OnInit {
  /** mail is put in a form to use read-only inputs */ // we want to change that
  public form!: UntypedFormGroup;

  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  @ViewChild('emailsInput') emailsInput?: ElementRef<HTMLInputElement>;

  /** @returns list of emails */
  get emails(): string[] {
    return this.form.get('to')?.value || [];
  }

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
      to: [{ value: this.data.to, disabled: false }, Validators.required],
      subject: this.data.subject,
      html: this.data.html,
      files: [[]],
    });
  }
  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  addEmail(event: any): void {
    // MatChipInputEvent deprecated, but it used to be MatChipInputEvent | any
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const input =
          event.type === 'focusout'
            ? this.emailsInput?.nativeElement
            : event.input;
        const value =
          event.type === 'focusout'
            ? this.emailsInput?.nativeElement.value
            : event.value;

        // Add the mail
        const emails = [...this.emails];
        if ((value || '').trim()) {
          if (EMAIL_REGEX.test(value.trim())) {
            emails.push(value.trim());
            this.form.get('to')?.setValue(emails);
            this.form.get('to')?.updateValueAndValidity();
            // Reset the input value
            if (input) {
              input.value = '';
            }
          } else {
            this.form.get('to')?.setErrors({ pattern: true });
          }
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

  /**
   * Get error message of field
   *
   * @returns error message
   */
  public errorMessage(): string {
    const control = this.form.get('to');
    if (control?.hasError('required')) {
      return 'components.distributionLists.errors.emails.required';
    }
    if (control?.hasError('pattern')) {
      return 'components.distributionLists.errors.emails.pattern';
    }
    return '';
  }
}
