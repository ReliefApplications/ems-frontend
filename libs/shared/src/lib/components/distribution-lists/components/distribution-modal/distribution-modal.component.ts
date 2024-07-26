import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import get from 'lodash/get';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  ChipModule,
  DialogModule,
  ErrorMessageModule,
  FormWrapperModule,
  SnackbarService,
} from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';
import { EmailService } from '../../../email/email.service';
import { DownloadService } from '../../../../services/download/download.service';
import { ApplicationService } from '../../../../services/application/application.service';

/** Model for the data input */
interface DialogData {
  name?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  distributionListNames: string[];
  isEdit?: boolean;
  id?: string;
  distributionListData: any;
  applicationId?: string;
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
  selector: 'shared-distribution-modal',
  templateUrl: './distribution-modal.component.html',
  styleUrls: ['./distribution-modal.component.scss'],
})
export class DistributionModalComponent implements OnInit {
  // === REACTIVE FORM ===
  /** Form */
  public form = this.fb.group({
    name: [get(this.data, 'name', null), [Validators.required]],
    to: [get(this.data, 'to', []), Validators.required],
    cc: [get(this.data, 'cc', [])],
    bcc: [get(this.data, 'bcc', [])],
  });
  /** separatorKeysCodes */
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;
  /** errorEmails */
  errorEmails = new BehaviorSubject<boolean>(false);
  /** Application ID. */
  public applicationId = '';
  /** Meesage for errorEmail */
  errorEmailMessages = new BehaviorSubject<string>('');
  /** Reference to file upload element. */
  @ViewChild('fileUpload', { static: true }) fileElement:
    | ElementRef
    | undefined;

  /** checking that DistributionList Name is Duplicate or not */
  public isDistributionListNameDuplicate = false;

  /** @returns list of emails */
  get emails(): string[] {
    return this.form.get('to')?.value || [];
  }

  /**
   * Retrieves an array of CC values from the form.
   *
   * @returns {string[]} An array containing the CC values.
   */
  get cc(): string[] {
    return this.form.get('cc')?.value || [];
  }

  /**
   * Retrieves an array of BCC values from the form.
   *
   * @returns {string[]} An array containing the BCC values.
   */
  get bcc(): string[] {
    return this.form.get('bcc')?.value || [];
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

  /** Viewchild for toInput */
  @ViewChild('toInput') toInput!: ElementRef<HTMLInputElement>;
  /** Viewchild for ccInput */
  @ViewChild('ccInput') ccInput!: ElementRef<HTMLInputElement>;
  /** Viewchild for bccInput */
  @ViewChild('bccInput') bccInput!: ElementRef<HTMLInputElement>;

  /**
   * Component for edition of distribution list
   *
   * @param fb Angular form builder service
   * @param applicationService The service for handling applications.
   * @param dialogRef Dialog ref of the component
   * @param data Data input of the modal
   * @param emailService email service
   * @param downloadService Download Service
   * @param snackBar snackbar notification service
   * @param translate translate service
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public emailService: EmailService,
    public downloadService: DownloadService,
    public applicationService: ApplicationService,
    public snackBar: SnackbarService,
    public translate: TranslateService
  ) {
    this.editActionHandler(data);
  }

  ngOnInit(): void {
    this.applicationService.application$.subscribe((res: any) => {
      this.applicationId = res?.id;
    });
  }

  /**
   * Handles the edit action based on dialog data.
   *
   * @param data The dialog data containing information about the edit action.
   */
  editActionHandler(data: any): void {
    if (data?.isEdit) {
      this.form.get('to')?.setValue(data?.distributionListData?.To);
      this.form.get('cc')?.setValue(data?.distributionListData?.Cc);
      this.form.get('bcc')?.setValue(data?.distributionListData?.Bcc);
      this.form
        .get('name')
        ?.setValue(data?.distributionListData?.distributionListName);
    }
  }

  /**
   * Add the inputs emails to the distribution list
   *
   * @param event The event triggered when we exit the input
   */
  addTo(event: string | any): void {
    const control = this.form.get('to');
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const value: string =
          event.type === 'focusout' ? this.toInput.nativeElement.value : event;

        // Add the mail
        const emails = [...this.emails];
        if ((value || '').trim()) {
          if (EMAIL_REGEX.test(value.trim())) {
            emails.push(value.trim());
            const uniqueEmails = Array.from(new Set(emails));
            control?.patchValue(uniqueEmails);
            control?.updateValueAndValidity();
            if (event.type === 'focusout') {
              this.toInput.nativeElement.value = '';
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
   * Adds a CC email address to the form control.
   *
   * @param {string | any} event - The event triggering the addition of the CC email address.
   *                               Can be either a string representing the email address or an event object.
   * @returns {void}
   */
  addCC(event: string | any): void {
    const control = this.form.get('cc');
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const value: string =
          event.type === 'focusout' ? this.ccInput.nativeElement.value : event;

        // Add the mail
        const emails = [...this.cc];
        if ((value || '').trim()) {
          if (EMAIL_REGEX.test(value.trim())) {
            emails.push(value.trim());
            const uniqueEmails = Array.from(new Set(emails));
            control?.patchValue(uniqueEmails);
            control?.updateValueAndValidity();
            if (event.type === 'focusout') {
              this.ccInput.nativeElement.value = '';
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
   * Adds a BCC email address to the form control.
   *
   * @param {string | any} event - The event triggering the addition of the BCC email address.
   *                               Can be either a string representing the email address or an event object.
   * @returns {void}
   */
  addBCC(event: string | any): void {
    const control = this.form.get('bcc');
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const value: string =
          event.type === 'focusout' ? this.bccInput.nativeElement.value : event;

        // Add the mail
        const emails = [...this.bcc];
        if ((value || '').trim()) {
          if (EMAIL_REGEX.test(value.trim())) {
            emails.push(value.trim());
            const uniqueEmails = Array.from(new Set(emails));
            control?.patchValue(uniqueEmails);
            control?.updateValueAndValidity();
            if (event.type === 'focusout') {
              this.bccInput.nativeElement.value = '';
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
   * @param type the type as string
   */
  removeEmail(email: string, type: string): void {
    if (type === 'to') {
      const emails = [...this.emails].filter(
        (emailData) => emailData.toLowerCase() !== email.toLowerCase()
      );
      this.form.get(type)?.setValue(emails);
    }
    if (type === 'cc') {
      const emails = [...this.cc].filter(
        (emailData) => emailData.toLowerCase() !== email.toLowerCase()
      );
      this.form.get(type)?.setValue(emails);
    }
    if (type === 'bcc') {
      const emails = [...this.bcc].filter(
        (emailData) => emailData.toLowerCase() !== email.toLowerCase()
      );
      this.form.get(type)?.setValue(emails);
    }
  }

  /**
   * Add Distribution list
   */
  addOrUpdateDistributionList() {
    const distributionListFormData = {
      distributionListName: this.form.value?.name,
      To: this.form.value?.to,
      Cc: this.form.value.cc,
      Bcc: this.form.value.bcc,
    };
    if (this.data?.isEdit) {
      this.emailService
        .editDistributionList(
          distributionListFormData,
          this.data?.distributionListData?.id
        )
        .subscribe((res: any) => {
          this.dialogRef.close({
            isDistributionListUpdated: this.data?.isEdit,
            dlData: res?.data,
          });
        });
    } else {
      this.emailService
        .addDistributionList(distributionListFormData, this.applicationId)
        .subscribe((res: any) => {
          this.dialogRef.close({
            isDistributionListUpdated: this.data?.isEdit,
            dlData: res?.data,
          });
        });
    }
  }

  /**
   * Validates whether a given name is unique among existing distribution list names.
   *
   * @param existingName The name to be validated.
   * @returns A boolean indicating the result of the validation. `true` if the name is not unique and `false` otherwise.
   */
  uniqueNameValidator(existingName: any): boolean {
    if (
      existingName &&
      this.data?.distributionListNames?.includes(existingName?.value)
    ) {
      this.isDistributionListNameDuplicate = true;
      return true;
    } else {
      this.isDistributionListNameDuplicate = false;
      // this.form.get('name')?.setErrors(null);
      return false;
    }
  }

  /**
   * Import Distribution List
   *
   * @param event file selection Event
   */
  fileSelectionHandler(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.downloadService
        .uploadFile('upload/distributionList', file)
        .subscribe(({ To, Cc, Bcc }) => {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.distributionList.import.loading'
            )
          );

          /* Need to check the existing value and append the new emails without any duplication */
          const toAfterImport = this.form.value?.to?.length
            ? Array.from(new Set([...this.form.value.to, ...To]))
            : [...new Set(To)];

          const ccAfterImport = this.form.value?.cc?.length
            ? Array.from(new Set([...this.form.value.cc, ...Cc]))
            : [...new Set(Cc)];

          const bccAfterImport = this.form.value?.bcc?.length
            ? Array.from(new Set([...this.form.value.bcc, ...Bcc]))
            : [...new Set(Bcc)];

          this.form.get('to')?.setValue(toAfterImport);
          this.form.get('cc')?.setValue(ccAfterImport);
          this.form.get('bcc')?.setValue(bccAfterImport);
          if (this.fileElement) this.fileElement.nativeElement.value = '';
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.distributionList.import.success'
            )
          );
        });
    }
  }

  /**
   * Download Distribution List Template
   */
  downloadDistributionListTemplate(): void {
    this.downloadService.downloadDistributionListTemplate();
  }
}
