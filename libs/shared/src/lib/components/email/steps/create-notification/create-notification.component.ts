import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmailService } from '../../email.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';

/**
 * create notification page component.
 */
@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss'],
})
export class CreateNotificationComponent implements OnInit {
  /** Form group for data set. */
  public dataSetFormGroup: FormGroup | any = this.emailService.datasetsForm;

  /** Notification types for email service. */
  public notificationTypes: string[] = this.emailService.notificationTypes;

  /** Event emitter for navigating to list screen. */
  @Output() navigateToListScreen: EventEmitter<any> = new EventEmitter();

  /**
   * initializing Email Service
   *
   * @param emailService helper functions
   * @param snackBar snackbar helper function
   * @param translate translate helper function
   */
  constructor(
    public emailService: EmailService,
    public snackBar: SnackbarService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.emailService.notificationTypes.length > 0) {
      this.dataSetFormGroup.controls['notificationType'].setValue(
        this.emailService.notificationTypes[0]
      );
      this.emailService.datasetsForm.controls['notificationType'].setValue(
        this.emailService.notificationTypes[0]
      );
    }
    this.triggerDuplicateChecker();
  }

  /**
   * Name validation.
   *
   * @returns if the name is duplicate.
   */
  isNameDuplicate(): boolean {
    const enteredName = this.dataSetFormGroup.controls['name'].value
      .trim()
      .toLowerCase();
    return this.emailService.emailNotificationNames.includes(enteredName);
  }

  /**
   * Duplicate Checking.
   *
   */
  triggerDuplicateChecker() {
    const flag = this.isNameDuplicate();
    if (flag) {
      this.emailService.disableSaveAndProceed.next(true);
      this.emailService.stepperDisable.next({ id: 0, isValid: false });
    } else {
      this.emailService.disableSaveAndProceed.next(false);
      this.emailService.stepperDisable.next({ id: 0, isValid: true });
    }
  }

  /**
   * Toggles the state of `isExisting` property in the `EmailService`.
   */
  toggle() {
    this.emailService.setDatasetForm();
    this.emailService.isExisting = !this.emailService.isExisting;
    this.navigateToListScreen.emit();
  }

  /**
   * Sends alert if name is duplicate or invalid.
   */
  nameAlert() {
    if (this.isNameDuplicate()) {
      this.snackBar.openSnackBar(
        this.translate.instant('components.email.distributionList.duplicate'),
        { error: true }
      );
    }
    if (
      !this.dataSetFormGroup.controls['name'].valid &&
      this.dataSetFormGroup.controls['name'].touched
    ) {
      this.snackBar.openSnackBar(
        this.translate.instant('components.email.notification.validTitle'),
        { error: true }
      );
    }
  }
}
