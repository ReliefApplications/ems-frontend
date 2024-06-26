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
import { ApplicationService } from '../../../../services/application/application.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, first, takeUntil } from 'rxjs';
import { LayoutComponent } from '../../steps/layout/layout.component';
import { SelectDistributionComponent } from '../../steps/select-distribution/select-distribution.component';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { SnackbarSpinnerComponent } from '../../../snackbar-spinner/snackbar-spinner.component';

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 1000;

/**
 * Email template to create distribution list
 */
@Component({
  selector: 'ems-template',
  templateUrl: './ems-template.component.html',
  styleUrls: ['./ems-template.component.scss'],
})
export class EmsTemplateComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Reference to email layout. */
  @ViewChild(LayoutComponent) layout!: LayoutComponent;
  /** Reference to selector of distribution list. */
  @ViewChild(SelectDistributionComponent)
  distribution!: SelectDistributionComponent;
  /** Reference to stepper */
  @ViewChild('stepper', { static: true })
  public stepper: StepperComponent | undefined;
  /** RETRIEVES NEW EMAIL NOTIFICATION */
  public addEmailnotification = this.emailService.addEmailNotification;
  /** CURRENT STEP */
  @Input() currentStep = 0;
  /** NAVIGATE TO MAIN EMAIL LIST SCREEN */
  @Output() navigateToEms: EventEmitter<any> = new EventEmitter();
  /** DISABLE ACTION BUTTON */
  public disableActionButton = false;
  /** Email Subject Subscription */
  private disableSub!: Subscription;
  /** Disable draft subscription */
  private disableDraft!: Subscription;
  /** Disable Save As Draft BUTTON */
  public disableSaveAsDraft = false;
  /** is submitted*/
  private submitted = false;
  /** Steps for stepper component */
  public steps: any[];
  /** LAYOUT PAGE VALIDATION */
  setLayoutValidation = false;

  /** DUMMY FORM */
  public form = new FormGroup({
    accountDetails: new FormGroup({
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      avatar: new FormControl(null),
    }),
  });

  /**
   * Step Valid checker
   *
   * @param index step index
   * @returns true if step is valid
   */
  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid;
  };

  /**
   * Checks if form should be validated
   *
   * @returns true if form should be validated
   */
  private shouldValidate = (): boolean => {
    return this.submitted === true;
  };

  /**
   * initializing Email Service
   *
   * @param emailService helper functions
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   * @param translate Angular Translate service
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
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
        if (disable) {
          this.disableAllNextSteps(this.currentStep);
        } else if (
          !disable &&
          this.emailService.isEdit &&
          this.currentStep === 4
        ) {
          this.steps[5].disabled = false;
        }
      }
    );
    this.disableDraft = this.emailService.disableSaveAsDraft.subscribe(
      (disable) => {
        this.disableSaveAsDraft = disable;
      }
    );
    if (
      this.emailService.draftStepper !== null &&
      this.emailService.draftStepper !== undefined
    ) {
      this.disableAllNextSteps(this.emailService.draftStepper);
    }
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
      if (this.emailService.datasetsForm.controls['name'].valid) {
        this.currentStep += 1;
        this.steps[1].disabled = false;
      } else {
        this.emailService.datasetsForm.controls['name'].markAsTouched();
        this.emailService.datasetsForm.controls[
          'notificationType'
        ].markAsTouched();
        this.disableAllNextSteps(0);
      }
    } else if (this.currentStep === 1) {
      if (this.emailService.datasetsForm.controls['name'].valid) {
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
      if (
        !(this.emailService.allLayoutdata.headerLogo instanceof File) &&
        this.emailService.allLayoutdata.headerLogo
      ) {
        this.emailService.allLayoutdata.headerLogo =
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.headerLogo,
            'image.png',
            'image/png'
          );
      }
      if (
        !(this.emailService.allLayoutdata.bannerImage instanceof File) &&
        this.emailService.allLayoutdata.bannerImage
      ) {
        this.emailService.allLayoutdata.bannerImage =
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.bannerImage,
            'image.png',
            'image/png'
          );
      }
      if (
        !(this.emailService.allLayoutdata.footerLogo instanceof File) &&
        this.emailService.allLayoutdata.footerLogo
      ) {
        this.emailService.allLayoutdata.footerLogo =
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.footerLogo,
            'image.png',
            'image/png'
          );
      }
      this.layout.getColors();
      this.emailService.allLayoutdata.txtSubject =
        this.layout.layoutForm.get('subjectInput')?.value;
      this.emailService.allLayoutdata.bodyHtml =
        this.layout.layoutForm.get('body')?.value;
      this.emailService.allLayoutdata.headerHtml =
        this.layout.layoutForm.get('header')?.value;
      this.emailService
        .patchEmailLayout()
        .then(() => {
          this.currentStep += 1;
          this.steps[5].disabled = false;
        })
        .catch((err) => {
          throw new Error(err);
        });
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
      // Save email
      await this.saveAndSend();
      const emailData = {
        // Your email data here
      };

      // Create a snackbar to indicate email is processing
      const snackBarRef = this.snackBar.openComponentSnackBar(
        SnackbarSpinnerComponent,
        {
          duration: 0,
          data: {
            message: this.translate.instant(
              'common.notifications.email.processing'
            ),
            loading: true,
          },
        }
      );
      const snackBarSpinner = snackBarRef.instance.nestedComponent;

      // Send email
      this.emailService
        .sendEmail(
          this.emailService.configId,
          emailData,
          this.emailService.sendSeparateEmail()
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.emailService.isEdit = false;
            this.emailService.editId = '';
            snackBarSpinner.instance.message = this.translate.instant(
              'pages.application.settings.emailSent'
            );
            snackBarSpinner.instance.loading = false;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            this.emailService.datasetsForm.reset();
            this.navigateToEms.emit();
          },
          error: (err) => {
            console.error('Error sending email:', err);
            snackBarSpinner.instance.message = this.translate.instant(
              'pages.application.settings.emailFailMsg'
            );
            snackBarSpinner.instance.loading = false;
            snackBarSpinner.instance.error = true;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            this.emailService.datasetsForm.reset();
            this.navigateToEms.emit();
          },
        });
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
  async saveAndSend(): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (Object.keys(this.emailService.datasetsForm.value).length) {
        this.emailService.datasetsForm?.value?.datasets?.forEach(
          (data: any) => {
            delete data.cacheData;
          }
        );
        // await this.emailService.patchEmailLayout();
        const queryData = this.emailService.datasetsForm.value;
        queryData.notificationType =
          this.emailService.datasetsForm.controls.notificationType.value;
        this.applicationService.application$.subscribe((res: any) => {
          this.emailService.datasetsForm
            .get('applicationId')
            ?.setValue(res?.id);
          queryData.applicationId = res?.id;
          queryData.emailDistributionList =
            this.emailService.emailDistributionList;
        });
        queryData.isDraft = false;
        //For email notification edit operation.
        if (this.emailService.isEdit) {
          if (
            this.emailService.allLayoutdata.headerLogo &&
            !queryData.emailLayout.header.headerLogo
          ) {
            queryData.emailLayout.header.headerLogo =
              this.emailService.allLayoutdata.headerLogo;
          }
          if (
            this.emailService.allLayoutdata.footerLogo &&
            !queryData.emailLayout.footer.footerLogo
          ) {
            queryData.emailLayout.footer.footerLogo =
              this.emailService.allLayoutdata.footerLogo;
          }
          if (
            this.emailService.allLayoutdata.footerLogo &&
            !queryData.emailLayout.banner.bannerImage
          ) {
            queryData.emailLayout.banner.bannerImage =
              this.emailService.allLayoutdata.bannerImage;
          }

          await this.emailService
            .getDataSetToSkipOptions(queryData)
            .then((manipulatedDataWithoutOptions) => {
              this.emailService
                .editEmailNotification(
                  this.emailService.editId,
                  manipulatedDataWithoutOptions
                )
                .subscribe({
                  next: ({ errors, data }: any) => {
                    if (errors) {
                      this.snackBar.openSnackBar(
                        this.translate.instant(
                          'common.notifications.objectNotUpdated',
                          {
                            type: this.translate.instant(
                              'common.email.notification.one'
                            ),
                            error: errors ? errors[0].message : '',
                          }
                        ),
                        { error: true }
                      );
                    } else {
                      if (data) {
                        this.emailService.configId =
                          data.editAndGetEmailNotification?.id;
                        resolve();
                      }
                    }
                  },
                  error: (err: any) => {
                    this.snackBar.openSnackBar(err.message, { error: true });
                  },
                });
            });
        } else {
          // For email notification create operation.
          await this.emailService
            .getDataSetToSkipOptions(queryData)
            .then((manipulatedDataWithoutOptions) => {
              this.emailService
                .addEmailNotification(manipulatedDataWithoutOptions)
                .subscribe({
                  next: ({ errors, data }) => {
                    if (errors) {
                      this.snackBar.openSnackBar(
                        this.translate.instant(
                          'common.notifications.objectNotCreated',
                          {
                            type: this.translate
                              .instant('common.email.notification.one')
                              .toLowerCase(),
                            error: errors ? errors[0].message : '',
                          }
                        ),
                        { error: true }
                      );
                    } else {
                      if (data) {
                        this.emailService.configId =
                          data.addEmailNotification?.id;
                        resolve();
                      }
                    }
                  },
                  error: (err) => {
                    this.snackBar.openSnackBar(err.message, { error: true });
                  },
                });
            });
        }
      } else {
        resolve();
      }
    });
  }

  /**
   * Save as Draft function
   */
  async saveDraft() {
    try {
      // convert base64 to file
      if (this.currentStep === 4) {
        if (
          !(this.emailService.allLayoutdata.headerLogo instanceof File) &&
          this.emailService.allLayoutdata.headerLogo
        ) {
          this.emailService.allLayoutdata.headerLogo =
            this.emailService.convertBase64ToFile(
              this.emailService.allLayoutdata.headerLogo,
              'image.png',
              'image/png'
            );
        }
        if (
          !(this.emailService.allLayoutdata.bannerImage instanceof File) &&
          this.emailService.allLayoutdata.bannerImage
        ) {
          this.emailService.allLayoutdata.bannerImage =
            this.emailService.convertBase64ToFile(
              this.emailService.allLayoutdata.bannerImage,
              'image.png',
              'image/png'
            );
        }
        if (
          !(this.emailService.allLayoutdata.footerLogo instanceof File) &&
          this.emailService.allLayoutdata.footerLogo
        ) {
          this.emailService.allLayoutdata.footerLogo =
            this.emailService.convertBase64ToFile(
              this.emailService.allLayoutdata.footerLogo,
              'image.png',
              'image/png'
            );
        }
        // patch layout data
        this.layout.getColors();
        this.emailService.allLayoutdata.txtSubject =
          this.layout.layoutForm.get('subjectInput')?.value;
        this.emailService.allLayoutdata.bodyHtml =
          this.layout.layoutForm.get('body')?.value;
        this.emailService.allLayoutdata.headerHtml =
          this.layout.layoutForm.get('header')?.value;
        await this.emailService.patchEmailLayout();
      }
      // eslint-disable-next-line no-empty
    } catch (error: any) {}
    if (this.currentStep === 2) {
      this.emailService.emailDistributionList =
        this.distribution.emailDistributionList;
      this.emailService.toEmailFilter = this.distribution.toEmailFilter;
      this.emailService.ccEmailFilter = this.distribution.ccEmailFilter;
      this.emailService.bccEmailFilter = this.distribution.bccEmailFilter;
    }
    this.emailService.datasetsForm?.value?.datasets?.forEach((data: any) => {
      delete data.cacheData;
    });
    const queryData = this.emailService.datasetsForm.value;
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      queryData.applicationId = res?.id;
      queryData.emailDistributionList = this.emailService.emailDistributionList;
    });
    queryData.isDraft = true;
    queryData.draftStepper = this.currentStep;
    queryData.notificationType =
      this.emailService.datasetsForm.controls.notificationType.value;
    if (this.emailService.isEdit) {
      if (
        this.emailService.allLayoutdata.headerLogo &&
        !queryData.emailLayout.header.headerLogo
      ) {
        queryData.emailLayout.header.headerLogo =
          this.emailService.allLayoutdata.headerLogo;
      }
      if (
        this.emailService.allLayoutdata.footerLogo &&
        !queryData.emailLayout.footer.footerLogo
      ) {
        queryData.emailLayout.footer.footerLogo =
          this.emailService.allLayoutdata.footerLogo;
      }
      if (
        this.emailService.allLayoutdata.footerLogo &&
        !queryData.emailLayout.banner.bannerImage
      ) {
        queryData.emailLayout.banner.bannerImage =
          this.emailService.allLayoutdata.bannerImage;
      }
      await this.emailService
        .getDataSetToSkipOptions(queryData)
        .then((manipulatedDataWithoutOptions) => {
          this.emailService
            .editEmailNotification(
              this.emailService.editId,
              manipulatedDataWithoutOptions
            )
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
        });
    } else {
      await this.emailService
        .getDataSetToSkipOptions(queryData)
        .then((manipulatedDataWithoutOptions) => {
          this.emailService
            .addEmailNotification(manipulatedDataWithoutOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
              this.emailService.configId = res.data.addEmailNotification.id;

              this.snackBar.openSnackBar(
                this.translate.instant(
                  'pages.application.settings.emailCreated'
                )
              );
              this.navigateToEms.emit();
            });
        });
    }
  }

  /**
   * Submission
   */
  async submit() {
    // await this.emailService.patchEmailLayout();
    if (Object.keys(this.emailService.datasetsForm.value).length) {
      this.emailService.datasetsForm?.value?.datasets?.forEach((data: any) => {
        delete data.cacheData;
      });
      const queryData = this.emailService.datasetsForm.value;
      queryData.notificationType =
        this.emailService.datasetsForm.controls.notificationType.value;
      this.applicationService.application$.subscribe((res: any) => {
        this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
        queryData.applicationId = res?.id;
        queryData.emailDistributionList =
          this.emailService.emailDistributionList;
      });
      queryData.isDraft = false;
      // For email notification edit operation.
      if (this.emailService.isEdit) {
        if (
          this.emailService.allLayoutdata.headerLogo &&
          !queryData.emailLayout.header.headerLogo
        ) {
          queryData.emailLayout.header.headerLogo =
            this.emailService.allLayoutdata.headerLogo;
        }
        if (
          this.emailService.allLayoutdata.footerLogo &&
          !queryData.emailLayout.footer.footerLogo
        ) {
          queryData.emailLayout.footer.footerLogo =
            this.emailService.allLayoutdata.footerLogo;
        }
        if (
          this.emailService.allLayoutdata.footerLogo &&
          !queryData.emailLayout.banner.bannerImage
        ) {
          queryData.emailLayout.banner.bannerImage =
            this.emailService.allLayoutdata.bannerImage;
        }
        await this.emailService
          .getDataSetToSkipOptions(queryData)
          .then((manipulatedDataWithoutOptions) => {
            this.emailService
              .editEmailNotification(
                this.emailService.editId,
                manipulatedDataWithoutOptions
              )
              .subscribe({
                next: ({ errors, data }: any) => {
                  if (errors) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectNotUpdated',
                        {
                          type: this.translate.instant(
                            'common.email.notification.one'
                          ),
                          error: errors ? errors[0].message : '',
                        }
                      ),
                      { error: true }
                    );
                  } else {
                    if (data) {
                      this.emailService.isEdit = false;
                      this.emailService.editId = '';
                      this.emailService.configId =
                        data.editAndGetEmailNotification.id;
                      this.snackBar.openSnackBar(
                        this.translate.instant(
                          'pages.application.settings.emailEdited'
                        )
                      );
                      this.emailService.datasetsForm.reset();
                      this.navigateToEms.emit();
                    }
                  }
                },
                error: (err: any) => {
                  this.snackBar.openSnackBar(err.message, { error: true });
                },
              });
          });
      } else {
        // For email notification create operation.

        await this.emailService
          .getDataSetToSkipOptions(queryData)
          .then((manipulatedDataWithoutOptions) => {
            this.emailService
              .addEmailNotification(manipulatedDataWithoutOptions)
              .subscribe({
                next: ({ errors, data }) => {
                  if (errors) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectNotCreated',
                        {
                          type: this.translate
                            .instant('common.email.notification.one')
                            .toLowerCase(),
                          error: errors ? errors[0].message : '',
                        }
                      ),
                      { error: true }
                    );
                  } else {
                    if (data) {
                      this.emailService.configId = data.addEmailNotification.id;

                      this.snackBar.openSnackBar(
                        this.translate.instant(
                          'pages.application.settings.emailCreated'
                        )
                      );
                      this.emailService.datasetsForm.reset();
                      this.navigateToEms.emit();
                    }
                  }
                },
                error: (err) => {
                  this.snackBar.openSnackBar(err.message, { error: true });
                },
              });
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

  override ngOnDestroy(): void {
    this.disableSub.unsubscribe();
    this.disableDraft.unsubscribe();
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
