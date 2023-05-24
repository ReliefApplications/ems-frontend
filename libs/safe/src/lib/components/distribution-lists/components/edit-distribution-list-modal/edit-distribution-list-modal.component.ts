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

import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

import get from 'lodash/get';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
// @TODO: Remove SafeIconModule import after ui-icon is being used in the app
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { ButtonModule, ChipModule, DialogModule } from '@oort-front/ui';

/** Model for the data input */
interface DialogData {
  name?: string;
  emails?: string[];
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
 * Modal to edit distribution list
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    SafeIconModule,
    ChipModule,
  ],
  selector: 'safe-edit-distribution-list-modal',
  templateUrl: './edit-distribution-list-modal.component.html',
  styleUrls: ['./edit-distribution-list-modal.component.scss'],
})
export class EditDistributionListModalComponent implements OnInit {
  // === REACTIVE FORM ===
  public form: UntypedFormGroup = new UntypedFormGroup({});
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  /** @returns list of emails */
  get emails(): string[] {
    return this.form.get('emails')?.value || [];
  }

  @ViewChild('emailsInput') emailsInput?: ElementRef<HTMLInputElement>;

  /**
   * Component for edition of distribution list
   *
   * @param formBuilder Angular form builder service
   * @param dialogRef Material dialog ref of the component
   * @param data Data input of the modal
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<EditDistributionListModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [get(this.data, 'name', null), Validators.required],
      emails: [get(this.data, 'emails', []), Validators.required],
    });
  }

  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  addEmail(event: string | any): void {
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        // const input =
        //   event.type === 'focusout'
        //     ? this.emailsInput?.nativeElement
        //     : event.input;
        const value =
          event.type === 'focusout'
            ? this.emailsInput?.nativeElement.value
            : event;

        // Add the mail
        if ((value || '').trim()) {
          if (EMAIL_REGEX.test(value.trim())) {
            const emails = [...this.emails];
            emails.push(value.trim());
            this.form.get('emails')?.setValue(emails);
            this.form.get('emails')?.updateValueAndValidity();
            // Reset the input value
            if (this.emailsInput?.nativeElement) {
              this.emailsInput.nativeElement.value = '';
            }
          } else {
            this.form.get('emails')?.setErrors({ pattern: true });
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
    const emails = [...this.emails].filter(
      (emailData) => emailData.toLowerCase() !== email.toLowerCase()
    );
    this.form.get('emails')?.setValue(emails);
  }
}
