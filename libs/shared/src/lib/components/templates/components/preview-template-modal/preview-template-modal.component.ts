import { CommonModule } from '@angular/common';
import { EmailModule } from '../../../email/email.module';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ButtonModule,
  DialogModule,
  DividerModule,
  SnackbarService,
  TableModule,
} from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { EmailService } from '../../../email/email.service';
import { TranslateService } from '@ngx-translate/core';
import { isNil } from 'lodash';

/**
 * Preview template modal.
 * Triggered by grid widgets when sending emails.
 */
@Component({
  standalone: true,
  imports: [
    EmailModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    LayoutModule,
    DividerModule,
  ],
  selector: 'shared-preview-template-modal',
  templateUrl: './preview-template-modal.component.html',
  styleUrls: ['./preview-template-modal.component.scss'],
})
export class PreviewTemplateModalComponent implements OnInit {
  /** Current step */
  public currentStep = 1;
  /** Should disable action button */
  public disableActionButton = false;
  /** Available steps, for kendo stepper */
  public steps = [
    {
      label: 'Layout',
      //   isValid: this.isStepValid,
      //   validate: this.shouldValidate,
      disabled: false,
    },
    {
      label: 'Preview',
      //   isValid: this.isStepValid,
      //   validate: this.shouldValidate,
      disabled: false,
    },
  ];

  /**
   * Preview template modal.
   * Triggered by grid widgets when sending emails.
   *
   * @param data Dialog data.
   * @param emailService Shared email service
   * @param snackBar Shared snackbar service
   * @param translate Angular Translate service
   * @param dialogRef Dialog reference
   */
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    public emailService: EmailService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private dialogRef: DialogRef
  ) {
    this.emailService.disableNextActionBtn = false;
    this.emailService.setDatasetForm();
    this.emailService.isQuickAction = true;
    this.emailService.datasetsForm.get('emailDistributionList')?.reset();
    this.emailService.quickEmailDistributionListQuery = [];
    // Show File upload in step 1 only on clicking the action button from Grid and send email in step 2
    this.emailService.showFileUpload = true;
    this.currentStep = 0;
    this.emailService.allPreviewData = [
      {
        tabIndex: 0,
        tabName: 'Block 1',
        navigateToPage: !isNil(this.data.navigateSettings),
        navigateSettings: this.data.navigateSettings,
        dataQuery: this.data.dataQuery,
      },
    ];
    this.emailService.emailDistributionList = this.data.distributionListInfo;

    this.emailService.datasetsForm.patchValue({
      emailLayout: this.data.emailContent,
    });
    this.emailService.layoutTitle = this.data?.emailContent?.name || '';
    if (this.data.distributionListInfo) {
      this.setDistributionData();
    }

    this.emailService.emailLayout = {
      subject: this.data.emailContent?.subject,
      name: this.data.emailContent?.name,
      header: this.data.emailContent?.header,
      body: this.data.emailContent?.body,
      banner: this.data.emailContent?.banner,
      footer: this.data.emailContent?.footer,
    };

    this.emailService.allLayoutdata = {
      /** IMAGES AND STYLES */
      bannerImage: this.data.emailContent?.banner?.bannerImage,
      bannerImageStyle: this.data.emailContent?.banner?.bannerImageStyle,
      /** CONTAINER STYLE */
      containerStyle: this.data.emailContent?.banner?.containerStyle,
      /** FOOTER COPYRIGHT STYLE */
      copyrightStyle: this.data.emailContent?.banner?.copyrightStyle,
      /** EMAIL SUBJECT */
      txtSubject: this.data.emailContent?.subject,
      /** EMAIL HEADER */
      headerHtml: this.data.emailContent?.header?.headerHtml,
      headerLogo: this.data.emailContent?.header?.headerLogo,
      headerLogoStyle: this.data.emailContent?.header?.headerStyle,
      headerBackgroundColor:
        this.data.emailContent?.header?.headerBackgroundColor,
      headerTextColor: this.data.emailContent?.header?.headerTextColor,
      headerStyle: this.data.emailContent?.header?.headerStyle,
      /** EMAIL BODY */
      bodyHtml: this.data.emailContent?.body?.bodyHtml,
      bodyBackgroundColor: this.data.emailContent?.body?.bodyBackgroundColor,
      bodyTextColor: this.data.emailContent?.body?.bodyTextColor,
      bodyStyle: this.data.emailContent?.body?.bodyStyle,
      /** EMAIL FOOTER */
      footerHtml: this.data.emailContent?.footer?.footerHtml,
      footerLogo: this.data.emailContent?.footer?.footerLogo,
      footerBackgroundColor:
        this.data.emailContent?.footer?.footerBackgroundColor,
      footerTextColor: this.data.emailContent?.footer?.footerTextColor,
      footerStyle: this.data.emailContent?.footer?.footerStyle,
      footerImgStyle: this.data.emailContent?.footer?.footerImgStyle,
      footerHtmlStyle: this.data.emailContent?.footer?.footerHtmlStyle,
    };
  }

  ngOnInit(): void {
    this.dialogRef.closed.subscribe(() => {
      const attachments =
        this.emailService.datasetsForm.get('attachments')?.value;
      if (attachments.files?.length) {
        this.emailService.deleteFile(attachments.files);
      }
    });
  }

  /**
   * Set distribution data in the form
   */
  setDistributionData() {
    const distributionListForm = this.emailService?.datasetsForm?.get(
      'emailDistributionList'
    );
    distributionListForm
      ?.get('name')
      ?.setValue(this.data.distributionListInfo?.name);
    this.emailService.populateEmails(
      this.data.distributionListInfo.to?.inputEmails,
      distributionListForm?.get('to')?.get('inputEmails') as FormArray
    );

    this.emailService.populateEmails(
      this.data.distributionListInfo.cc?.inputEmails,
      distributionListForm?.get('cc')?.get('inputEmails') as FormArray
    );

    this.emailService.populateEmails(
      this.data.distributionListInfo.bcc?.inputEmails,
      distributionListForm?.get('bcc')?.get('inputEmails') as FormArray
    );
  }

  /**
   * Get value of key of record
   *
   * @param item selected row
   * @param keyNm key name
   * @param metaData metadata contaning all key data
   * @returns the value of the key
   */
  getValueOfKey(item: any, keyNm: any, metaData: any) {
    let keyData!: any;
    const relatedMetadata = metaData.filter((x: any) => x.name == keyNm)?.[0];
    const relatedMetadataInTheGivenNode = relatedMetadata?.options?.filter(
      (x: any) => item?.node[keyNm]?.includes(x.value)
    );
    keyData = relatedMetadataInTheGivenNode?.map((y: any) => y.text);
    let notMatchedData: any = '';
    if (Array.isArray(item?.node[keyNm])) {
      //Finding non matched data
      const metaValArr = metaData
        ?.filter((x: any) => x.name == keyNm)?.[0]
        ?.options?.map((x: any) => x.value);
      const gridaDataVal = item?.node[keyNm];
      notMatchedData = gridaDataVal
        ?.map((item: any) => (!metaValArr?.includes(item) ? item : null))
        ?.filter((x: any) => x !== null);
    }
    keyData =
      notMatchedData?.length > 0 && keyData?.length > 0
        ? notMatchedData?.join(',') + ',' + keyData
        : keyData;
    return keyData?.length > 0 ? keyData : item?.node[keyNm];
  }

  /**
   * To send the email from the GRID view
   */
  send() {
    const previewData: any = this.emailService.allPreviewData?.[0];
    const payload: any = this.emailService.datasetsForm.getRawValue();
    if (this.emailService.isQuickAction) {
      if (payload?.datasets.length > 0) {
        previewData.emailDistributionList.to = {
          inputEmails: this.emailService.emailDistributionList.to,
        };

        previewData.emailDistributionList.cc = {
          inputEmails: this.emailService.emailDistributionList.cc,
        };

        previewData.emailDistributionList.bcc = {
          inputEmails: this.emailService.emailDistributionList.bcc,
        };

        payload.datasets[0].name = 'Block 1';
        payload.datasets[0].query.filter = previewData?.dataQuery?.filter
          ? previewData.dataQuery.filter
          : payload.datasets[0].query.filter;
        payload.datasets[0].query.name =
          previewData?.dataQuery?.queryName || '';
        payload.datasets[0].query.fields = previewData?.dataQuery?.fields || [];
        payload.emailDistributionList = previewData.emailDistributionList;
        payload.datasets[0].navigateToPage = previewData?.navigateToPage;
        payload.datasets[0].navigateSettings = previewData?.navigateSettings;
      }
    }
    this.dialogRef.close();
    this.emailService.sendQuickEmail(payload).subscribe(() => {
      this.onClose();
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.emailSent', {
          type: this.translate.instant('common.dashboard.one').toLowerCase(),
          error: '',
        }),
        { error: false }
      );
    });
  }

  /**
   * Method called when closing the dialog.
   */
  onClose() {
    this.emailService.datasetsForm.reset();
  }

  /**
   * Method called when clicking on Next.
   */
  next() {
    if (
      !this.emailService.emailDistributionList ||
      this.emailService.emailDistributionList?.to?.length === 0
    ) {
      this.snackBar.openSnackBar('To is required to proceed!', {
        error: true,
      });
    } else {
      this.currentStep = 1;
    }
  }

  /**
   * Validate Quick action To emails when we cehck from Quick Action grid
   *
   * @returns value for button disable or enable
   */
  validateQuickActionNextBtn() {
    this.steps = this.steps.map((step, index) => {
      if (index > this.currentStep) {
        step.disabled = this.emailService.disableNextActionBtn;
      }
      return step;
    });
    return this.emailService.disableNextActionBtn;
  }
}
