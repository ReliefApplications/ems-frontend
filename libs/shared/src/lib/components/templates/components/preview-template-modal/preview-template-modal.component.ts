import { CommonModule } from '@angular/common';
import { EmailModule } from '../../../email/email.module';
import { Component, Inject } from '@angular/core';
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
export class PreviewTemplateModalComponent {
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

  /** Current environment */
  private environment: any;

  /**
   * Preview template modal.
   * Triggered by grid widgets when sending emails.
   *
   * @param data Dialog data.
   * @param emailService Shared email service
   * @param snackBar Shared snackbar service
   * @param translate Angular Translate service
   * @param dialogRef Dialog reference
   * @param environment platform environment
   */
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private emailService: EmailService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private dialogRef: DialogRef,
    @Inject('environment') environment: any
  ) {
    this.environment = environment;
    this.emailService.isQuickAction = true;
    this.emailService.datasetsForm.get('emailDistributionList')?.reset();
    this.emailService.quickEmailDLQuery = [];
    this.currentStep = !this.data.distributionListInfo ? 0 : 1;
    this.convertData(this.data.selectedRowsFromGrid, this.data.resourceData);
    this.emailService.emailDistributionList = this.data.distributionListInfo;

    this.emailService.datasetsForm.patchValue({
      emailLayout: this.data.emailContent,
    });
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
   * Used to convert the data format suitable for the preview
   *
   * @param rowData The input array of data items to be converted.
   * @param metaData The metadata of the data items.
   */
  convertData(rowData: any, metaData: any) {
    // Initialize the datasetFields and dataList arrays
    const datasetFields: any = [];
    const datasetFieldsObj: any = [];
    const dataList: any = [];

    // Iterate over each item in the input data
    rowData?.forEach((item: any) => {
      // Get the text object from the dataItem
      const text: any = {};
      // Extract the keys from the object to populate datasetFields
      this.data.selectedLayoutFields.forEach((key: any) => {
        if (!datasetFieldsObj?.map((x: any) => x.name).includes(key.name)) {
          datasetFieldsObj.push(key);
        }
      });

      this.data.selectedLayoutFields
        ?.map((x: any) => x.name)
        .forEach((key: any) => {
          if (!datasetFields.includes(key)) {
            datasetFields.push(key);
          }
        });

      datasetFieldsObj
        ?.map((x: any) => x.name)
        ?.forEach((keyNm: any, index: number) => {
          text[keyNm] = this.getValueOfKey(item, keyNm, metaData);
          const navigateSettings = this.data.navigateSettings;
          if (
            navigateSettings &&
            navigateSettings.field &&
            !datasetFields.includes(navigateSettings.field) &&
            index === datasetFieldsObj.length - 1
          ) {
            text[navigateSettings.field] = this.getValueOfKey(
              item,
              navigateSettings.field,
              metaData
            );
          }
        });
      // Add the text object to the dataList array
      dataList.push(text);
    });

    this.emailService.allPreviewData = [
      {
        datasetFields,
        datasetFieldsObj,
        dataList,
        tabIndex: 0,
        tabName: 'Block 1',
        navigateToPage: !isNil(this.data.navigateSettings),
        navigateSettings: this.data.navigateSettings,
      },
    ];
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
    const dlData: any = this.emailService.emailDistributionList;
    const previewData: any = this.emailService.allPreviewData?.[0];
    const emailData: any = {
      emailDistributionList: {
        to: dlData.to,
        cc: dlData.cc,
        bcc: dlData.bcc,
        name: dlData.name,
      },
      emailLayout: this.emailService.datasetsForm.value.emailLayout,
      tableInfo: [
        {
          columns: previewData?.datasetFieldsObj,
          records: previewData?.dataList,
          index: previewData?.tabIndex,
          name: previewData?.tabName,
          navigateToPage: previewData?.navigateToPage,
          navigateSettings: previewData?.navigateSettings,
        },
      ],
    };
    this.dialogRef.close();
    this.emailService.sendQuickEmail(emailData).subscribe(() => {
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
}