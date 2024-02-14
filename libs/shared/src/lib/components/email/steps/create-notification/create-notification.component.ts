import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmailService } from '../../email.service';

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
   */
  constructor(public emailService: EmailService) {}

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
}
