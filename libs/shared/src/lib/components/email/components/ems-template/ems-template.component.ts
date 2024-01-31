import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { EmailService } from '../../email.service';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application/application.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, first } from 'rxjs';

/**
 * Email template to create distribution list
 */
@Component({
  selector: 'ems-template',
  templateUrl: './ems-template.component.html',
  styleUrls: ['./ems-template.component.scss'],
})
export class EmsTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true })
  public stepper: StepperComponent | undefined;
  public addEmailnotification = this.emailService.addEmailNotification;

  @Input() currentStep = 0;
  @Output() navigateToEms: EventEmitter<any> = new EventEmitter();
  public disableActionButton = false;
  /** Email Subject Subscription */
  private disableSub!: Subscription;

  private submitted = false;

  public steps: any[];
  setLayoutValidation = false;

  public form = new FormGroup({
    accountDetails: new FormGroup({
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      avatar: new FormControl(null),
    }),
  });

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid;
  };

  private shouldValidate = (): boolean => {
    return this.submitted === true;
  };

  /**
   * initializing Email Service
   *
   * @param emailService helper functions
   * @param router
   * @param applicationService
   * @param snackBar
   * @param translate
   */
  constructor(
    public emailService: EmailService,
    private router: Router,
    public applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    this.steps = [
      {
        label: 'Notification/Alert',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
        disabled: false,
      },
      {
        label: 'Dataset',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
        disabled: false,
      },
      {
        label: 'Distribution List',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
        disabled: false,
      },
      {
        label: 'Schedule Alert',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
        disabled: false,
      },
      {
        label: 'Layout',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
        disabled: false,
      },
      {
        label: 'Preview',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
        disabled: false,
      },
    ];
    if (this.emailService.isEdit) {
      this.steps = this.steps.map((step: any) => {
        step.disabled = false;
        return step;
      });
    } else {
      this.disableAllNextSteps(0);
    }
    this.emailService.disableSaveAndProceed.subscribe((res: boolean) => {
      this.disableActionButton = res;
    });
    this.emailService.disableFormSteps
      .pipe(first())
      .subscribe((res: { stepperIndex: number; disableAction: boolean }) => {
        if (res.disableAction) {
          this.disableAllNextSteps(res?.stepperIndex);
        }
      });
    this.emailService.datasetsForm.controls['name'].valueChanges.subscribe(
      (value: string) => {
        if (value === '') {
          this.disableAllNextSteps(this.currentStep);
        }
      }
    );
    this.emailService.enableAllSteps.pipe(first()).subscribe((res: boolean) => {
      if (res) {
        this.steps = this.steps.map((step: any) => {
          step.disabled = false;
          return step;
        });
      }
    });
  }

  ngOnInit(): void {
    this.disableSub = this.emailService.disableSaveAndProceed.subscribe(
      (disable) => {
        this.disableActionButton = disable;
      }
    );
  }

  /**
   * Getter for the current form group.
   *
   * @returns The current form group.
   */
  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  /**
   * Moves to the specified step.
   *
   * @param step The step to move to.
   */
  moveTo(step: any) {
    this.currentStep = step;
  }

  /**
   * Increments the current step by one.
   */
  public next(): void {
    this.setLayoutValidation = false;
    this.emailService.isLinear = false;
    if (this.currentStep === 0) {
      if (
        this.emailService.datasetsForm.controls['name'].valid &&
        this.emailService.datasetsForm.controls['notificationType'].valid
      ) {
        this.currentStep += 1;
        this.steps[1].disabled = false;
      } else {
        this.emailService.datasetsForm.controls['name'].markAsTouched();
        this.emailService.datasetsForm.controls[
          'notificationType'
        ].markAsTouched();
      }
    } else if (this.currentStep === 1) {
      if (
        this.emailService.datasetsForm.controls['name'].valid &&
        this.emailService.datasetsForm.controls['notificationType'].valid
      ) {
        this.currentStep += 1;
        this.steps[2].disabled = false;
      } else {
        this.emailService.datasetsForm.controls['name'].markAsTouched();
        this.emailService.datasetsForm.controls[
          'notificationType'
        ].markAsTouched();
        this.disableAllNextSteps(1);
      }
      this.emailService.datasetSave.emit(true);
      /* in future we will be modifying all the below else ifs */
    } else if (this.currentStep === 2) {
      this.currentStep += 1;
      this.steps[3].disabled = false;
    } else if (this.currentStep === 3) {
      this.currentStep += 1;
      this.steps[4].disabled = false;
    } else if (this.currentStep === 4) {
      this.currentStep += 1;
      this.steps[5].disabled = false;
    } else {
      this.currentStep += 1;
    }
  }

  /**
   * Decrements the current step by one.
   */
  public prev(): void {
    this.currentStep -= 1;
  }

  /**
   * Sending emails
   */
  public async send(): Promise<void> {
    try {
      await this.saveAndSend();
      const emailData = {
        // Your email data here
      };

      this.emailService
        .sendEmail(this.emailService.configId, emailData)
        .subscribe(
          (response) => {
            console.log('Email sent successfully:', response);
            this.emailService.isEdit = false;
            this.emailService.editId = '';
            this.snackBar.openSnackBar(
              this.translate.instant('pages.application.settings.emailSent')
            );
            this.emailService.datasetsForm.reset();
            this.navigateToEms.emit();
          },
          (error) => {
            console.error('Error sending email:', error);
            this.snackBar.openSnackBar(
              this.translate.instant('pages.application.settings.emailFailMsg'),
              { error: true }
            );
            this.emailService.datasetsForm.reset();
            this.navigateToEms.emit();
          }
        );
    } catch (error) {
      console.error('Error in saveAndSend:', error);
    }
  }

  /**
   * This function returns the form group at the specified index.
   *
   * @param index The index of the form group.
   * @returns {FormGroup} The form group at the specified index.
   */
  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

  /**
   * Submission for sending and saving emails
   */
  saveAndSend(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (Object.keys(this.emailService.datasetsForm.value).length) {
        this.emailService.datasetsForm?.value?.dataSets?.forEach(
          (data: any) => {
            delete data.cacheData;
          }
        );
        const queryData = this.emailService.datasetsForm.value;
        this.applicationService.application$.subscribe((res: any) => {
          this.emailService.datasetsForm
            .get('applicationId')
            ?.setValue(res?.id);
          queryData.applicationId = res?.id;
          queryData.recipients = this.emailService.recipients;
        });
        //For email notification edit operation.
        if (this.emailService.isEdit) {
          this.emailService
            .editEmailNotification(this.emailService.editId, queryData)
            .subscribe((res) => {
              this.emailService.configId =
                res.data?.editAndGetEmailNotification?.id;
              resolve();
            }, reject);
        } else {
          // For email notification create operation.
          this.emailService
            .addEmailNotification(queryData)
            .subscribe((res: any) => {
              this.emailService.configId = res.data?.addEmailNotification?.id;
              resolve();
            }, reject);
        }
      } else {
        resolve();
      }
    });
  }

  /**
   * Submission
   */
  submit() {
    if (Object.keys(this.emailService.datasetsForm.value).length) {
      this.emailService.datasetsForm?.value?.datasets?.forEach((data: any) => {
        delete data.cacheData;
      });
      const queryData = this.emailService.datasetsForm.value;
      this.applicationService.application$.subscribe((res: any) => {
        this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
        queryData.applicationId = res?.id;
        queryData.recipients = this.emailService.recipients;
      });
      // For email notification edit operation.
      if (this.emailService.isEdit) {
        this.emailService
          .editEmailNotification(this.emailService.editId, queryData)
          .subscribe((res: any) => {
            this.emailService.isEdit = false;
            this.emailService.editId = '';
            this.emailService.configId =
              res.data.editAndGetEmailNotification.id;
            this.snackBar.openSnackBar(
              this.translate.instant('pages.application.settings.emailEdited')
            );
            this.emailService.datasetsForm.reset();
            this.navigateToEms.emit();
          });
      } else {
        // For email notification create operation.
        this.emailService
          .addEmailNotification(queryData)
          .subscribe((res: any) => {
            this.emailService.configId = res.data.addEmailNotification.id;

            this.snackBar.openSnackBar(
              this.translate.instant('pages.application.settings.emailCreated')
            );
            this.emailService.datasetsForm.reset();
            this.navigateToEms.emit();
          });
      }
    }
  }

  /**
   * Navigates to list screen.
   */
  navigateToListScreen() {
    this.navigateToEms.emit();
  }

  ngOnDestroy(): void {
    this.disableSub.unsubscribe();
  }

  /**
   * Disables all next steps from the specified stepper index.
   *
   * @param stepperIndex - current stepper index
   */
  disableAllNextSteps(stepperIndex: number): void {
    this.steps = this.steps.map((step, index) => {
      if (index > stepperIndex) {
        step.disabled = true;
      }
      return step;
    });
  }
}
