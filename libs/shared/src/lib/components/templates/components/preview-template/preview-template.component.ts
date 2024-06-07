import { CommonModule } from '@angular/common';
import { EmailModule } from '../../../email/email.module';
import { Component, Inject } from '@angular/core';
import { ButtonModule, DialogModule, TableModule } from '@oort-front/ui';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '@progress/kendo-angular-layout';
import { EmailService } from '../../../email/email.service';

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

  /**
   * Constructor for creating a new instance of a dialog component.
   *
   * @param {any} data - Dialog data.
   * @param {EmailService} emailService - An instance of the EmailService.
   */
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private emailService: EmailService
  ) {
    console.log('this email,', this.data);
    this.convertData(this.data.selectedRowsFromGrid);
    this.emailService.emailDistributionList = this.data.distributionListInfo;
    // this.emailService.recipients = this.data.distributionListInfo;

    this.emailService.datasetsForm.patchValue({
      emailLayout: this.data.emailContent,
    });

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
   */
  convertData(rowData: any) {
    // Initialize the datasetFields and dataList arrays
    const datasetFields: any = [];
    const dataList: any = [];

    // Iterate over each item in the input data
    rowData?.forEach((item: any) => {
      // Get the text object from the dataItem
      const text = item.dataItem.text;

      // Extract the keys from the text object to populate datasetFields
      Object.keys(text).forEach((key) => {
        if (!datasetFields.includes(key)) {
          datasetFields.push(key);
        }
      });

      // Add the text object to the dataList array
      dataList.push(text);
    });

    this.emailService.allPreviewData = [
      {
        datasetFields,
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
    // this.emailService
    //   .sendEmail('663b2956f1848a1a8832c412', 'Good', false)
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
  }

  /**
   * Method called when closing the dialog.
   */
  onClose() {
    this.emailService.datasetsForm.reset();
  }
}
