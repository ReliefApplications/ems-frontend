import { Component, EventEmitter, Output } from '@angular/core';
import { EmailService } from '../../email.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';

/**
 * Used to create custom template
 */
@Component({
  selector: 'ems-custom-template',
  templateUrl: './custom-template.component.html',
  styleUrls: ['./custom-template.component.scss'],
})
export class CustomTemplateComponent {
  /* Used to identify the current step */
  /** Current step of the custom template   */
  public currentStep = 0;
  /** Boolean flag to disable the action button upon error state  */
  public disableActionButton = false;
  /** NAVIGATE TO MAIN EMAIL LIST SCREEN */
  @Output() navigateToEms: EventEmitter<any> = new EventEmitter();

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

  /**
   * Angular Component constructor
   *
   * @param emailService email service
   * @param snackBar snackbar service
   * @param translate translate service
   */
  constructor(
    private emailService: EmailService,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {}

  /**
   * The layout form data
   *
   * @param inputData layout form data
   * @returns manipulated data
   */
  convertTemplateData(inputData: any): any {
    return {
      subject: inputData?.txtSubject ?? '',
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
    const templateData = this.convertTemplateData(
      this.emailService.allLayoutdata
    );
    if (this.emailService.isCustomTemplateEdit) {
      this.emailService
        .editCustomTemplate(templateData, this.emailService.customTemplateId)
        .subscribe(() => {
          this.emailService.datasetsForm.reset();
          this.navigateToEms.emit();
        });
    } else {
      this.emailService.addCustomTemplate(templateData).subscribe(
        () => {
          this.emailService.datasetsForm.reset();
          this.navigateToEms.emit();
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
    // console.log('query data', queryData);
  }
}
