import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EmailService } from '../../email.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * First step of email notification editor.
 * - edition of name
 * - edition of type ( phase 2 )
 */
@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss'],
})
export class CreateNotificationComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  public formGroup: FormGroup = this.emailService.datasetsForm;
  /** Notification types for email service. */
  public notificationTypes: string[] = this.emailService.notificationTypes;
  /** Event emitter for navigating to list screen. */
  @Output() navigateToListScreen: EventEmitter<any> = new EventEmitter();

  /**
   * Checks if name input is empty.
   *
   * @returns if true if input is empty.
   */
  get isEmpty(): boolean {
    return (
      !this.formGroup.controls['name'].value ||
      this.formGroup.controls['name'].value.trim() === ''
    );
  }

  /**
   * Check if name is duplicated
   *
   * @returns is the notification name duplicated
   */
  get isNameDuplicate(): boolean {
    const enteredName = this.formGroup.controls['name'].value
      .trim()
      .toLowerCase();
    return this.emailService.emailNotificationNames.includes(enteredName);
  }

  /**
   * First step of email notification editor.
   * - edition of name
   * - edition of type ( phase 2 )
   *
   * @param emailService Email helper service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   */
  constructor(
    public emailService: EmailService,
    public snackBar: SnackbarService,
    public translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    // Subscribe to changes on notification name
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onNameChange();
        this.checkIfInvalid();
      });
    if (this.emailService.notificationTypes.length > 0) {
      this.formGroup.controls['notificationType'].setValue(
        this.emailService.notificationTypes[0]
      );
      this.emailService.datasetsForm.controls['notificationType'].setValue(
        this.emailService.notificationTypes[0]
      );
      (
        this.emailService.datasetsForm.get('notificationType') as FormControl
      ).disable();
    }
    this.checkIfInvalid();
  }

  /**
   * Check if control is invalid.
   *
   */
  private checkIfInvalid() {
    const isInvalid = this.isNameDuplicate || this.isEmpty;
    if (isInvalid) {
      this.emailService.disableSaveAndProceed.next(true);
      this.emailService.stepperDisable.next({ id: 0, isValid: false });
    } else {
      this.emailService.disableSaveAndProceed.next(false);
      this.emailService.stepperDisable.next({ id: 0, isValid: true });
    }
  }

  /**
   * Logic to apply whenever value of name field changes.
   * Sends alert if name is duplicate or invalid.
   */
  private onNameChange() {
    if (this.isNameDuplicate) {
      // Set new control error so form control is marked as invalid
      this.formGroup.get('name')?.setErrors({ duplicated: true });
      this.snackBar.openSnackBar(
        this.translate.instant('components.email.distributionList.duplicate'),
        { error: true }
      );
    }
    if (this.isEmpty && this.formGroup.controls['name'].touched) {
      this.snackBar.openSnackBar(
        this.translate.instant('components.email.notification.validTitle'),
        { error: true }
      );
    }
  }

  /**
   * Deprecated?
   * Toggles the state of `isExisting` property in the `EmailService`.
   */
  // toggle() {
  //   this.emailService.setDatasetForm();
  //   this.emailService.isExisting = !this.emailService.isExisting;
  //   this.navigateToListScreen.emit();
  // }
}
