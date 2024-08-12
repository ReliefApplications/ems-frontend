import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmailService } from '../../email.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../services/application/application.service';

/**
 * Used to create custom template
 */
@Component({
  selector: 'ems-custom-template',
  templateUrl: './custom-template.component.html',
  styleUrls: ['./custom-template.component.scss'],
})
export class CustomTemplateComponent implements OnInit {
  /* Used to identify the current step */
  /** Current step of the custom template   */
  public currentStep = 0;
  /** NAVIGATE TO MAIN EMAIL LIST SCREEN */
  @Output() navigateToEms: EventEmitter<any> = new EventEmitter();

  /** Application ID. */
  public applicationId = '';

  /** Stepper form Steps */
  public steps = [
    {
      label: 'Layout',
      disabled: false,
    },
    {
      label: 'Preview',
      disabled: false,
    },
  ];
  /** Custom Layout tile */
  public layoutTitle = '';

  /**
   * Angular Component constructor
   *
   * @param emailService email service
   * @param snackBar snackbar service
   * @param applicationService The service for handling applications.
   * @param translate translate service
   */
  constructor(
    public emailService: EmailService,
    private snackBar: SnackbarService,
    public applicationService: ApplicationService,
    private translate: TranslateService
  ) {
    this.emailService.layoutTitle = '';
    this.emailService.isValidLayoutTitle = true;
    this.emailService.isQuickAction = true;
    this.emailService.disableNextActionBtn = true;
    this.updateStep(true);
  }

  ngOnInit(): void {
    this.applicationService.application$.subscribe((res: any) => {
      this.applicationId = res?.id;
    });
  }

  /**
   * The layout form data
   *
   * @param inputData layout form data
   * @returns manipulated data
   */
  convertTemplateData(inputData: any): any {
    return {
      name: inputData.name,
      subject: inputData?.txtSubject ?? '',
      applicationId: inputData?.applicationId ?? '',
      banner: {
        bannerImage: inputData?.bannerImage ?? null,
        bannerImageStyle: inputData?.bannerImageStyle ?? '',
        containerStyle: inputData?.containerStyle ?? '',
        copyrightStyle: inputData?.copyrightStyle ?? '',
      },
      body: {
        bodyHtml: inputData?.bodyHtml ?? null,
        bodyBackgroundColor: inputData?.bodyBackgroundColor ?? '',
        bodyTextColor: inputData?.bodyTextColor ?? '',
        bodyStyle: inputData?.bodyStyle ?? '',
      },
      footer: {
        footerHtml: inputData?.footerHtml ?? '',
        footerLogo: inputData?.footerLogo ?? null,
        footerBackgroundColor: inputData?.footerBackgroundColor ?? '',
        footerTextColor: inputData?.footerTextColor ?? '',
        footerStyle: inputData?.footerStyle ?? '',
        footerImgStyle: inputData?.footerImgStyle ?? '',
        footerHtmlStyle: inputData?.footerHtmlStyle ?? '',
      },
      header: {
        headerHtml: inputData?.headerHtml ?? '',
        headerLogo: inputData?.headerLogo ?? null,
        headerLogoStyle: inputData?.headerLogoStyle ?? '',
        headerBackgroundColor: inputData?.headerBackgroundColor ?? '',
        headerTextColor: inputData?.headerTextColor ?? '',
        headerHtmlStyle: inputData?.headerHtmlStyle ?? '',
        headerStyle: inputData?.headerStyle ?? '',
      },
    };
  }

  /**
   * Submits the form data to the email service.
   */
  submit() {
    const templateData = this.convertTemplateData({
      ...this.emailService.allLayoutdata,
      applicationId: this.applicationId,
      name: this.emailService.layoutTitle,
    });
    if (this.emailService.isCustomTemplateEdit) {
      this.emailService
        .editCustomTemplate(templateData, this.emailService.customTemplateId)
        .subscribe((res: any) => {
          this.emailService.layoutTitle = '';
          this.emailService.isValidLayoutTitle = true;
          this.emailService.datasetsForm.reset();
          this.navigateToEms.emit({ template: res });
        });
    } else {
      this.emailService.addCustomTemplate(templateData).subscribe(
        (res: any) => {
          this.emailService.layoutTitle = '';
          this.emailService.isValidLayoutTitle = true;
          this.emailService.datasetsForm.reset();
          this.navigateToEms.emit({ template: res });
        },
        (error: any) => {
          console.error('Error sending email:', error);
          this.snackBar.openSnackBar(
            this.translate.instant('pages.application.settings.emailFailMsg'),
            { error: true }
          );
        }
      );
    }
  }

  /**
   *
   * Move to next step
   */
  next() {
    this.currentStep = 1;
    if (this.emailService.disableNextActionBtn) {
      this.updateStep(false);
    }
  }

  /**
   *
   *Change disable true or false for steps
   *
   * @param stepFlag boolean
   */
  updateStep(stepFlag: boolean) {
    this.steps = this.steps.map((step, index) => {
      if (index > this.currentStep) {
        step.disabled = stepFlag;
      }
      return step;
    });
  }

  /** Validate Next button */
  validateNextButton() {
    if (
      !this.emailService.disableNextActionBtn &&
      this.emailService.layoutTitle.trim() === ''
    ) {
      this.emailService.disableNextActionBtn = true;
    } else {
      this.emailService.disableNextActionBtn = true;
      this.emailService.validateCustomTemplate(this.applicationId).subscribe({
        next: (res: any) => {
          if (res?.data?.validateCustomTemplate) {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'common.notifications.email.errors.customTitleExist'
              ),
              {
                error: true,
              }
            );
            this.emailService.disableNextActionBtn = true;
            this.emailService.isValidLayoutTitle = false;
          } else if (
            this.emailService.allLayoutdata.txtSubject.trim() === '' ||
            this.emailService.allLayoutdata.bodyHtml.trim() === ''
          ) {
            this.emailService.disableNextActionBtn = true;
            this.emailService.isValidLayoutTitle = true;
          } else {
            this.emailService.disableNextActionBtn = false;
            this.emailService.isValidLayoutTitle = true;
          }
        },
        error: () => {
          this.emailService.disableNextActionBtn = true;
        },
      });
    }

    if (this.emailService.layoutTitle.trim() === '') {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'common.notifications.email.errors.noCustomTitle'
        ),
        {
          error: true,
        }
      );
    }
  }
}
