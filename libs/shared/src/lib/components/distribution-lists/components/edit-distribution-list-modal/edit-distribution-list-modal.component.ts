import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import get from 'lodash/get';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ChipModule,
  DialogModule,
  ErrorMessageModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';
import * as EmailValidator from 'email-validator';

/** Model for the data input */
interface DialogData {
  name?: string;
  emails?: string[];
}

/** Key codes of separators */
const SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

/**
 * Function that create a function which returns an object with the separator keys
 *
 * @returns A function which returns an object with the separator keys
 */
export function codesFactory(): () => {
  separatorKeyCodes: number[];
} {
  const codes = () => ({ separatorKeyCodes: SEPARATOR_KEYS_CODE });
  return codes;
}

/**
 * Modal to edit distribution list
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    ChipModule,
    FormWrapperModule,
    ErrorMessageModule,
  ],
  selector: 'shared-edit-distribution-list-modal',
  templateUrl: './edit-distribution-list-modal.component.html',
  styleUrls: ['./edit-distribution-list-modal.component.scss'],
})
export class EditDistributionListModalComponent implements OnDestroy {
  // === REACTIVE FORM ===
  /** Form */
  public form = this.fb.group({
    name: [get(this.data, 'name', null), Validators.required],
    emails: [get(this.data, 'emails', []), Validators.required],
    cc: [get(this.data, 'emails', []), Validators.required],
    bcc: [get(this.data, 'emails', []), Validators.required],
    to: [get(this.data, 'emails', []), Validators.required],
  });
  /** Separator keys codes */
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;
  /** Error emails */
  errorEmails = new BehaviorSubject<boolean>(false);
  /** Error emails messages */
  errorEmailMessages = new BehaviorSubject<string>('');

  /** Timeout */
  private timeoutListener!: NodeJS.Timeout;

  /** @returns list of emails */
  get emails(): string[] {
    return this.form.get('emails')?.value || [];
  }

  /**
   * Get error message of field
   *
   * @returns error message
   */
  get emailsError(): string {
    const control = this.form.get('emails');
    if (control?.hasError('required')) {
      return 'components.distributionLists.errors.emails.required';
    }
    if (control?.hasError('pattern')) {
      return 'components.distributionLists.errors.emails.pattern';
    }
    return '';
  }

  /** Emails input */
  @ViewChild('emailsInput') emailsInput!: ElementRef<HTMLInputElement>;

  /**
   * Component for edition of distribution list
   *
   * @param fb Angular form builder service
   * @param dialogRef Dialog ref of the component
   * @param data Data input of the modal
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditDistributionListModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  addEmail(event: string | any): void {
    const control = this.form.get('emails');
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
          if (EmailValidator.validate(value.trim())) {
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
    const emails = [...this.emails].filter(
      (emailData) => emailData.toLowerCase() !== email.toLowerCase()
    );
    this.form.get('emails')?.setValue(emails);
  }

  ngOnDestroy(): void {
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
  }
}
