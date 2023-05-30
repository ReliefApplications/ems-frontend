import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatLegacyChipInputEvent as MatChipInputEvent,
  MAT_LEGACY_CHIPS_DEFAULT_OPTIONS as MAT_CHIPS_DEFAULT_OPTIONS,
} from '@angular/material/legacy-chips';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import get from 'lodash/get';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

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
    SafeModalModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatChipsModule,
  ],
  selector: 'safe-edit-distribution-list-modal',
  templateUrl: './edit-distribution-list-modal.component.html',
  styleUrls: ['./edit-distribution-list-modal.component.scss'],
  providers: [{ provide: MAT_CHIPS_DEFAULT_OPTIONS, useFactory: codesFactory }],
})
export class EditDistributionListModalComponent implements OnInit {
  // === REACTIVE FORM ===
  public form: FormGroup = new FormGroup({});
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
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditDistributionListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
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
  addEmail(event: MatChipInputEvent | any): void {
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
            this.form.get('emails')?.setValue(emails);
            this.form.get('emails')?.updateValueAndValidity();
            // Reset the input value
            if (input) {
              input.value = '';
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
    const emails = [...this.emails];
    const index = emails.indexOf(email);
    if (index >= 0) {
      emails.splice(index, 1);
      this.form.get('emails')?.setValue(emails);
      this.form.get('emails')?.updateValueAndValidity();
    }
  }

  /**
   * Get error message of field
   *
   * @param formControlName field name
   * @returns error message
   */
  public errorMessage(formControlName: string): string {
    switch (formControlName) {
      case 'name': {
        const control = this.form.get('name');
        if (control?.hasError('required')) {
          return 'components.distributionLists.errors.name.required';
        }
        return '';
      }
      case 'emails': {
        const control = this.form.get('emails');
        if (control?.hasError('required')) {
          return 'components.distributionLists.errors.emails.required';
        }
        if (control?.hasError('pattern')) {
          return 'components.distributionLists.errors.emails.pattern';
        }
        return '';
      }
      default: {
        return '';
      }
    }
  }
}
