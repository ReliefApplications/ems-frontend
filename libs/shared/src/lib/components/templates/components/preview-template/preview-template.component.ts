import { CommonModule } from '@angular/common';
import { EmailModule } from '../../../email/email.module';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  ButtonModule,
  DialogModule,
  SnackbarService,
  TableModule,
} from '@oort-front/ui';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '@progress/kendo-angular-layout';
import { EmailService } from '../../../email/email.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 *
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
  ],
  selector: 'shared-preview-modal',
  templateUrl: './preview-template.component.html',
  styleUrls: ['./preview-template.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PreviewTemplate {
  /**
   *
   */
  public displayedColumns: string[] = [
    'Alerts',
    'Cause',
    'Date of Disaster',
    'Date of Logging',
    'Plan',
    'Notes',
    'Description',
    'Level of Alert',
  ];
  /**
   *
   */
  public currentStep = 1;
  /**
   *
   */
  public disableActionButton = false;
  /** NAVIGATE TO MAIN EMAIL LIST SCREEN */

  /**
   *
   */
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
  /**  */
  destroy$: Subject<boolean> = new Subject<boolean>();
  /** dialog ref */
  @ViewChild('dialogRef') dialogRef?: any;

  /**
   * Constructor for creating a new instance of a dialog component.
   *
   * @param {any} data - Dialog data.
   * @param {EmailService} emailService - An instance of the EmailService.
   * @param apollo
   * @param snackBar
   * @param translate
   */
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private emailService: EmailService,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    console.log('this email,', this.data);
    this.emailService.isQuickAction = true;
    this.currentStep = !this.data.distributionListInfo ? 0 : 1;
    this.convertData(this.data.selectedRowsFromGrid, this.data.resourceData);
    this.emailService.emailDistributionList = this.data.distributionListInfo;
    // this.emailService.recipients = this.data.distributionListInfo;

    this.emailService.datasetsForm.patchValue({
      emailLayout: this.data.emailContent,
    });
    this.emailService?.datasetsForm
      ?.get('emailDistributionList')
      ?.get('name')
      ?.setValue(this.data.distributionListInfo?.distributionListName);
    this.emailService.populateEmails(
      this.data.distributionListInfo.To,
      this.emailService?.datasetsForm
        ?.get('emailDistributionList')
        ?.get('to')
        ?.get('inputEmails') as FormArray
    );

    this.emailService.populateEmails(
      this.data.distributionListInfo.Cc,
      this.emailService?.datasetsForm
        ?.get('emailDistributionList')
        ?.get('cc')
        ?.get('inputEmails') as FormArray
    );

    this.emailService.populateEmails(
      this.data.distributionListInfo.Bcc,
      this.emailService?.datasetsForm
        ?.get('emailDistributionList')
        ?.get('bcc')
        ?.get('inputEmails') as FormArray
    );

    this.emailService.emailLayout = {
      subject: this.data.emailContent?.subject,
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

    console.log('The email content', this.data);
  }

  /**
   * Used to convert the data format suitable for the preview
   *
   * @param rowData The input array of data items to be converted.
   * @param metaData
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
        if (!datasetFieldsObj?.map((x: any) => x.field).includes(key.name)) {
          datasetFieldsObj.push({
            field: key.name,
            name: key.label,
            type: key.type,
          });
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
        ?.map((x: any) => x.field)
        ?.forEach((keyNm: any) => {
          const keyData = metaData
            .filter((x: any) => x.name == keyNm)?.[0]
            .options?.filter((x: any) => item?.node[keyNm]?.includes(x.value))
            .map((y: any) => y.text);
          text[keyNm] = keyData?.length > 0 ? keyData : item?.node[keyNm];
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
      },
    ];
  }

  //   replaceTokensWithTables(): void {
  //     // this.bodyString = this.emailService.allLayoutdata.bodyHtml;
  //     // Token matching {{String}}
  //     // const tokenRegex = /{{([^}]+)}}/g;
  //     // let match;
  //     // while ((match = tokenRegex.exec(this.bodyString)) !== null) {
  //     //   const tabName = match[1]; // Extract the tab name from the token
  //     //   const previewData = this.emailService.allPreviewData.find(
  //     //     (data) => data.tabName === tabName
  //     //   );

  //       if (this.data.dataset) {
  //         const tableHtml = this.convertPreviewDataToHtml(previewData);
  //         this.bodyString = this.bodyString.replace(match[0], tableHtml);
  //       }
  //     }
  //   }

  /**
   * To send the email from the GRID view
   */
  send() {
    const dlData: any = this.emailService.emailDistributionList;
    const previewData: any = this.emailService.allPreviewData?.[0];
    const emailData: any = {
      emailDistributionList: {
        To: dlData.To,
        Cc: dlData.Cc,
        Bcc: dlData.Bcc,
        name: dlData.distributionListName,
      },
      emailLayout: this.emailService.datasetsForm.value.emailLayout,
      tableInfo: [
        {
          columns: previewData?.datasetFields,
          records: previewData?.dataList,
          index: previewData?.tabIndex,
          name: previewData?.tabName,
        },
      ],
    };
    this.dialogRef?.onClose();
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
}
