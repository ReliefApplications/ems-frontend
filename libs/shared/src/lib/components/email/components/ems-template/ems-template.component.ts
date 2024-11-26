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
import { Subscription, first, firstValueFrom, takeUntil } from 'rxjs';
import { LayoutComponent } from '../../steps/layout/layout.component';
import { SelectDistributionComponent } from '../../steps/select-distribution/select-distribution.component';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { SnackbarSpinnerComponent } from '../../../snackbar-spinner/snackbar-spinner.component';
import { cloneDeep } from 'lodash';

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 700;

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
  /** PREVIEW TRIGGERED state   */
  public previewTriggered = false;

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
      if (this.currentStep > 3 && !this.disableActionButton) {
        this.steps = this.steps.map((step: any) => {
          step.disabled = false;
          return step;
        });
      }
    });
    this.emailService.disableFormSteps
      .pipe(first())
      .subscribe(({ stepperIndex, disableAction }) => {
        if (disableAction) {
          this.disableAllNextSteps(stepperIndex);
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
        } else if (this.emailService.isEdit && this.currentStep === 4) {
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
  public async next(): Promise<void> {
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
        try {
          this.emailService.loading = true;
          const { valid, badData } =
            await this.emailService.checkDatasetsValid();
          this.emailService.loading = false;
          if (valid) {
            this.currentStep += 1;
            this.steps[2].disabled = false;
          } else {
            this.emailService.disableSaveAndProceed.next(true);
            if (badData.length > 0) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'components.email.error.invalidDataset',
                  {
                    badDatasets:
                      badData.length > 1 ? badData.join(', ') : badData[0],
                  }
                ),
                { error: true }
              );
            }
          }
        } catch (error) {
          console.error('Error validating datasets:', error);
        }
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
      const toValid = await this.emailService.checkDLToValid();
      if (toValid) {
        this.currentStep += 1;
        this.steps[3].disabled = false;
      } else {
        this.emailService.disableSaveAndProceed.next(true);
      }
    } else if (this.currentStep === 3) {
      this.currentStep += 1;
      this.steps[4].disabled = false;
    } else if (this.currentStep === 4) {
      this.showPreview();
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
          {},
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
   * Manipulates the payload by modifying options of fields based on fetched dataset.
   *
   * @param emailData - The payload to be manipulated with limited options.
   * @returns A Promise that resolves with the modified emailData.
   */
  async getDataSetToSkipOptions(emailData: any) {
    await Promise.all(
      emailData.datasets.map(async (dataset: any) => {
        const tempQuery = cloneDeep(dataset.query);
        if (!(dataset.resource || dataset.reference)) {
          Object.assign(dataset, {
            resource: tempQuery.resource,
            query: {
              name: tempQuery.name,
              filter: tempQuery.filter,
              fields: tempQuery.fields,
            },
            blockType: tempQuery.blockType,
            textStyle: tempQuery.textStyle,
            tableStyle: tempQuery.tableStyle,
            pageSize: tempQuery.pageSize,
            individualEmail: tempQuery.isIndividualEmail ?? false,
            sendAsAttachment: tempQuery.sendAsAttachment ?? false,
          });
        }
      })
    );
    const isAllSendSeparate = emailData.datasets?.every(
      (dataset: any) => dataset.individualEmail
    );
    //Check if DL id exist or all the dataset are to be send separate
    if (emailData?.emailDistributionList?.id && !isAllSendSeparate) {
      //Common service payload rebuild
      const objData: any = cloneDeep(emailData);
      objData.emailDistributionList.to.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList.to.commonServiceFilter.filter
        )?.commonServiceFilter;

      objData.emailDistributionList.cc.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList.cc.commonServiceFilter.filter
        )?.commonServiceFilter;

      objData.emailDistributionList.bcc.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList.bcc.commonServiceFilter.filter
        )?.commonServiceFilter;

      const dlList: any = objData.emailDistributionList;
      emailData.emailDistributionList = objData.emailDistributionList.id;
      if (
        emailData.emailDistributionList ||
        emailData.emailDistributionList?.id
      ) {
        await firstValueFrom(
          this.emailService.editDistributionList(dlList, dlList.id)
        );
      }
    } else if (
      ((emailData.emailDistributionList?.to?.resource ||
        emailData.emailDistributionList?.to?.reference) &&
        emailData.emailDistributionList?.to?.query?.fields?.length) ||
      emailData.emailDistributionList?.to?.inputEmails?.length ||
      emailData.emailDistributionList?.to?.commonServiceFilter?.filter?.filters
        ?.length > 0
    ) {
      //Common service payload rebuild
      const objData: any = cloneDeep(emailData);
      objData.emailDistributionList.to.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList.to.commonServiceFilter.filter
        )?.commonServiceFilter;

      objData.emailDistributionList.cc.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList.cc.commonServiceFilter.filter
        )?.commonServiceFilter;

      objData.emailDistributionList.bcc.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList.bcc.commonServiceFilter.filter
        )?.commonServiceFilter;

      const distributionList = await firstValueFrom(
        this.emailService.addDistributionList(
          objData.emailDistributionList,
          emailData.applicationId
        )
      );
      if (distributionList?.data?.addEmailDistributionList?.id) {
        emailData.emailDistributionList =
          distributionList?.data?.addEmailDistributionList?.id;
        this.emailService.datasetsForm
          ?.get('emailDistributionList')
          ?.get('id')
          ?.setValue(distributionList?.data?.addEmailDistributionList?.id);
      } else if (distributionList.errors) {
        this.snackBar.openSnackBar(
          distributionList?.errors ? distributionList?.errors[0]?.message : '',
          { error: true }
        );
        throw new Error(distributionList?.errors[0].message);
      }
    } else {
      emailData.emailDistributionList = null;
    }
    const emailLayout = await this.addEditCustomTemplate(emailData);
    if (emailLayout?.id) {
      emailData.emailLayout = emailLayout.id;
      const emailLayoutControl =
        this.emailService.datasetsForm?.get('emailLayout');
      //Storing Custom Template in Dataset
      if (emailLayoutControl) {
        emailLayoutControl.setValue({
          ...(emailLayoutControl.value || {}),
          id: emailLayout.id,
        });
      }
    } else {
      this.snackBar.openSnackBar(emailLayout?.errors || '', { error: true });
      throw new Error(emailLayout?.errors);
    }
    const { To, Bcc, Cc } = emailData.emailDistributionList || {};
    if (To || Bcc || Cc) {
      delete emailData.emailDistributionList?.To;
      delete emailData.emailDistributionList?.Bcc;
      delete emailData.emailDistributionList?.Cc;
    }
    return emailData;
  }

  /**
   * Adds or edits a custom email template depending on whether an ID is present.
   * Updates the form with the template ID upon success, or throws an error if the request fails.
   *
   * @param emailData - The email data containing email layout and other information.
   * @returns A promise that resolves to an object with either the template ID or errors.
   */
  private async addEditCustomTemplate(emailData: any) {
    let emailLayout;
    if (emailData?.emailLayout?.id) {
      emailLayout = await firstValueFrom(
        this.emailService.editCustomTemplate(
          {
            ...emailData?.emailLayout,
            applicationId: emailData.applicationId,
            name: emailData?.name,
            isFromEmailNotification: true,
          },
          emailData?.emailLayout?.id
        )
      );
    } else {
      emailLayout = await firstValueFrom(
        this.emailService.addCustomTemplate({
          ...emailData?.emailLayout,
          applicationId: emailData.applicationId,
          name: emailData?.name,
          isFromEmailNotification: true,
        })
      );
    }
    const id =
      emailLayout?.data?.addCustomTemplate?.id ||
      emailLayout?.data?.editCustomTemplate?.id;
    if (id) {
      return { id };
    } else if (emailLayout.errors) {
      return { errors: emailLayout?.errors[0]?.message };
    }
    return null;
  }

  /**
   * Submission for sending and saving emails
   */
  saveAndSend(): Promise<void> {
    return new Promise((resolve) => {
      if (Object.keys(this.emailService.datasetsForm.getRawValue()).length) {
        this.emailService.datasetsForm?.value?.datasets?.forEach(
          (data: any) => {
            delete data.cacheData;
          }
        );
        const queryData = this.emailService.datasetsForm.getRawValue();
        queryData.notificationType =
          this.emailService.datasetsForm.controls.notificationType.value;
        this.applicationService.application$.subscribe((res: any) => {
          this.emailService.datasetsForm
            .get('applicationId')
            ?.setValue(res?.id);
          queryData.applicationId = res?.id;
        });
        queryData.isDraft = false;
        if (queryData.restrictSubscription === true) {
          queryData.subscriptionList = [];
        }
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

          this.getDataSetToSkipOptions(queryData).then(
            (manipulatedDataWithoutOptions) => {
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
                          data.editEmailNotification?.id;
                        resolve();
                      }
                    }
                  },
                  error: (err: any) => {
                    this.snackBar.openSnackBar(err.message, { error: true });
                  },
                });
            }
          );
        } else {
          if (this.previewTriggered) {
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

            this.getDataSetToSkipOptions(queryData).then(
              (manipulatedDataWithoutOptions) => {
                this.emailService
                  .editEmailNotification(
                    this.emailService.configId as string,
                    manipulatedDataWithoutOptions
                  )
                  .subscribe({
                    next: ({ errors, data }: any) => {
                      if (errors) {
                        this.snackBar.openSnackBar(
                          this.translate.instant(
                            'common.notifications.objectNotSaved',
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
                            data.editEmailNotification?.id;
                          resolve();
                        }
                      }
                    },
                    error: (err: any) => {
                      this.snackBar.openSnackBar(err.message, { error: true });
                    },
                  });
              }
            );
          } else {
            this.getDataSetToSkipOptions(queryData).then(
              (manipulatedDataWithoutOptions) => {
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
              }
            );
          }
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
    } catch (error: any) {
      console.error(`Error while saving as draft: ${error.message}`);
    }
    if (this.currentStep === 2) {
      //TODO: Implement
    }
    this.emailService.datasetsForm?.value?.datasets?.forEach((data: any) => {
      delete data.cacheData;
    });
    const queryData = this.emailService.datasetsForm.getRawValue();
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      queryData.applicationId = res?.id;
    });
    queryData.isDraft = true;
    queryData.draftStepper = this.currentStep;
    queryData.notificationType =
      this.emailService.datasetsForm.controls.notificationType.value;
    if (queryData.restrictSubscription === true) {
      queryData.subscriptionList = [];
    }
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
      await this.getDataSetToSkipOptions(queryData).then(
        (manipulatedDataWithoutOptions) => {
          this.emailService
            .editEmailNotification(
              this.emailService.editId,
              manipulatedDataWithoutOptions
            )
            .subscribe((res) => {
              this.emailService.isEdit = false;
              this.emailService.editId = '';
              this.emailService.configId = res.data.editEmailNotification.id;
              this.snackBar.openSnackBar(
                this.translate.instant('pages.application.settings.emailEdited')
              );
              this.emailService.datasetsForm.reset();
              this.navigateToEms.emit();
            });
        }
      );
    } else {
      await this.getDataSetToSkipOptions(queryData).then(
        (manipulatedDataWithoutOptions) => {
          this.emailService
            .addEmailNotification(manipulatedDataWithoutOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data }) => {
              this.emailService.configId = data.addEmailNotification.id;

              this.snackBar.openSnackBar(
                this.translate.instant(
                  'pages.application.settings.emailCreated'
                )
              );
              this.navigateToEms.emit();
            });
        }
      );
    }
  }

  /**
   * Submission
   */
  async submit() {
    if (Object.keys(this.emailService.datasetsForm.getRawValue()).length) {
      this.emailService.datasetsForm?.value?.datasets?.forEach((data: any) => {
        delete data.cacheData;
      });

      const queryData = this.emailService.datasetsForm.getRawValue();
      queryData.notificationType =
        this.emailService.datasetsForm.controls.notificationType.value;
      this.applicationService.application$.subscribe((res: any) => {
        this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
        queryData.applicationId = res?.id;
      });
      queryData.isDraft = false;
      if (queryData.restrictSubscription === true) {
        queryData.subscriptionList = [];
      }
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
        await this.getDataSetToSkipOptions(queryData).then(
          (manipulatedDataWithoutOptions) => {
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
                        data.editEmailNotification.id;

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
          }
        );
      } else {
        // For email notification create operation.
        await this.getDataSetToSkipOptions(queryData).then(
          (manipulatedDataWithoutOptions) => {
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
          }
        );
      }
    }
  }

  /**
   * This function returns the formatted data.
   *
   * @param dataSet set of the data
   * @returns grouped form data
   */
  formatPayload(dataSet: any) {
    const groupedDataSet = dataSet.map((data: any) => {
      const fieldData = data.fields;

      const groupedFields = fieldData.reduce((acc: any, field: any) => {
        if (field.name.includes('.')) {
          const fieldDataArr = field.name.split('.');

          if (!acc[fieldDataArr[0]]) {
            acc[fieldDataArr[0]] = {
              name: fieldDataArr[0],
              type: fieldDataArr[1],
              kind: 'OBJECT',
              fields: [],
            };
          }

          const json = {
            name: fieldDataArr[2],
            kind: 'SCALAR',
          };

          if (
            !acc[fieldDataArr[0]].fields.some(
              (field: { name: any; kind: string }) =>
                field.name === json.name && field.kind === json.kind
            )
          ) {
            acc[fieldDataArr[0]].fields.push(json);
          }
        } else {
          acc[field.name] = field;
        }

        return acc;
      }, {});

      return {
        ...data,
        fields: Object.values(groupedFields),
      };
    });

    return groupedDataSet;
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

  /**
   * Get stepper change event
   *
   * @param e stepper change event
   */
  currentStepChange(e: number) {
    if (e === 5) {
      this.showPreview();
    }
  }

  /**
   * Move to Preivew screen with All layout data
   */
  showPreview() {
    this.layout.getColors();
    this.emailService.allLayoutdata.txtSubject =
      this.layout.layoutForm.get('subjectInput')?.value;
    this.emailService.allLayoutdata.bodyHtml =
      this.layout.layoutForm.get('body')?.value;
    this.emailService.allLayoutdata.headerHtml =
      this.layout.layoutForm.get('header')?.value;
    this.currentStep = this.currentStep == 5 ? 4 : this.currentStep;
    if (this.currentStep == 4) {
      this.emailService
        .patchEmailLayout()
        .then(async () => {
          this.currentStep += 1;
          this.steps[5].disabled = false;
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }
}
