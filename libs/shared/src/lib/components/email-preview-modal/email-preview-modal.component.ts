import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EMAIL_EDITOR_CONFIG } from '../../const/tinymce.const';
import { EditorService } from '../../services/editor/editor.service';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  ChipModule,
  DialogModule,
  ErrorMessageModule,
  FormWrapperModule,
  SpinnerModule,
} from '@oort-front/ui';
import {
  FileRestrictions,
  UploadsModule,
} from '@progress/kendo-angular-upload';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

/** Interface of Email Preview Modal Data */
interface DialogData {
  from: string;
  html: string;
  subject: string;
  to: string[];
  // Provided by service
  onSubmit: any;
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
  standalone: true,
  selector: 'shared-email-preview-modal',
  templateUrl: './email-preview-modal.component.html',
  styleUrls: ['./email-preview-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    UploadsModule,
    EditorModule,
    DialogModule,
    ButtonModule,
    ChipModule,
    ErrorMessageModule,
    SpinnerModule,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class EmailPreviewModalComponent implements OnDestroy {
  /** Reference to emails input */
  @ViewChild('emailsInput') emailsInput!: ElementRef<HTMLInputElement>;
  /** Email form group */ // we want to change that
  public emailForm = this.fb.group({
    from: [{ value: this.data.from, disabled: true }],
    to: [{ value: this.data.to, disabled: false }, Validators.required],
    subject: [this.data.subject, Validators.required],
    html: this.data.html,
    files: [[]],
  });
  /** Separator keys codes for email input  */
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;
  /** Tinymce editor configuration */
  public editor: any = EMAIL_EDITOR_CONFIG;
  /** File restrictions */
  public fileRestrictions: FileRestrictions = {
    maxFileSize: 7 * 1024 * 1024, // should represent 7MB
  };
  /** boolean whether editor loading */
  public editorLoading = true;

  /** Timeout */
  private timeoutListener!: NodeJS.Timeout;

  /** @returns list of emails */
  get emails(): string[] {
    return this.emailForm.get('to')?.value || [];
  }

  /**
   * Get error message of field
   *
   * @returns error message
   */
  get emailsError(): string {
    const control = this.emailForm.get('to');
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
   *
   * @param data injected dialog data
   * @param dialogRef Dialog reference
   * @param fb Angular Form Builder
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    public dialogRef: DialogRef<EmailPreviewModalComponent>,
    private fb: FormBuilder,
    private editorService: EditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnDestroy(): void {
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
  }

  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  addEmail(event: any): void {
    const control = this.emailForm.get('to');
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    // use setTimeout to prevent add input value on focusout
    this.timeoutListener = setTimeout(
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
      this.emailForm.get('to')?.setValue(emails);
      this.emailForm.get('to')?.updateValueAndValidity();
    }
  }

  /**
   * Submit email.
   */
  onSubmit() {
    this.data.onSubmit(this.emailForm.value).then(() => this.dialogRef.close());
  }
}
