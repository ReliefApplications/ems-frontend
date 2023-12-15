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
import {
  StepperActivateEvent,
  StepperComponent,
} from '@progress/kendo-angular-layout';
import { EmailService } from '../../email.service';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application/application.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

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
      },
      {
        label: 'Dataset',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
      },
      {
        label: 'Distribution List',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
      },
      {
        label: 'Schedule Alert',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
      },
      {
        label: 'Layout',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
      },
      {
        label: 'Preview',
        isValid: this.isStepValid,
        validate: this.shouldValidate,
      },
    ];
    this.emailService.disableSaveAndProceed.subscribe((res: boolean) => {
      this.disableActionButton = res;
    });
    emailService.stepperDisable.subscribe((res: any) => {
      this.steps.forEach((step: any, index: number) => {
        if (index > res.id && !res.isValid) {
          step['disabled'] = true;
        } else {
          step['disabled'] = false;
        }
      });
      this.disableActionButton = !res.isValid;
      this.currentStep = res.id;
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
    if (this.currentStep === 0) {
      if (
        this.emailService.datasetsForm.controls['name'].valid &&
        this.emailService.datasetsForm.controls['notificationType'].valid
      ) {
        this.currentStep += 1;
      } else {
        this.emailService.datasetsForm.controls['name'].markAsTouched();
        this.emailService.datasetsForm.controls[
          'notificationType'
        ].markAsTouched();
      }
    } else {
      if (this.currentStep === 1) {
        this.emailService.datasetSave.emit(true);
      }
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
   *
   * submission
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
        this.applicationService.application$.subscribe((res: any) => {
          this.emailService.datasetsForm
            .get('applicationId')
            ?.setValue(res?.id);
          // For email notification edit operation.
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
                //window.location.reload();
                resolve();
              }, reject);
          }
        }, reject);
      } else {
        resolve();
      }
    });
  }

  /**
   *
   * submission
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
            //window.location.reload();
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
   *
   */
  navigateToListScreen() {
    this.navigateToEms.emit();
  }

  /**
   *
   * @param ev
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onStepActivate(ev: StepperActivateEvent): void {
    this.emailService.isLinear =
      this.emailService.isEdit || this.emailService.isPreview
        ? false
        : this.emailService.isLinear;
    if (this.disableActionButton) {
      this.steps[ev.index].disabled = true;
    }
    // if (ev.index === 4 || ev.index === 5) {
    //   this.isLinear = false;
    // } else {
    //   this.isLinear = true;
    // }
  }

  ngOnDestroy(): void {
    this.disableSub.unsubscribe();
  }
}
