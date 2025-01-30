import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnInit,
  Input,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { EmailService } from '../../email.service';
import { Subscription } from 'rxjs';
import { TokenRegex } from '../../constant';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../../../../services/rest/rest.service';
import { FormArray } from '@angular/forms';
import { cloneDeep } from 'lodash';

/**
 * The preview component is used to display the email layout using user input from layout component.
 */
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  /** Selected resource ID. -TO DELETE? */
  public selectedResourceId: string | undefined;
  /** List of data items. -TO DELETE? */
  public dataList!: { [key: string]: string }[];
  /** List of keys for data items. -TO DELETE? */
  public dataListKey!: { [key: string]: string }[];
  /** HEADER LOGO FILE SRC STRING */
  public headerLogo: string | ArrayBuffer | null = null;
  /** BANNER IMAGE FILE SRC STRING */
  public bannerImage: string | ArrayBuffer | null = null;
  /** FOOTER LOGO FILE SRC STRING */
  public footerLogo: string | ArrayBuffer | null = null;
  /** SUBJECT STRING */
  public subjectString: string | any =
    this.emailService.allLayoutdata.txtSubject;
  /** BODY HTML STRING */
  public bodyString: string | any = this.emailService.allLayoutdata.bodyHtml;
  /** HEADER HTML STRING */
  public headerString: string | any =
    this.emailService.allLayoutdata.headerHtml;
  /** FOOTER HTML STRING */
  public footerString: string | any =
    this.emailService.allLayoutdata.footerHtml;
  /** Subscription for query. */
  private querySubscription: Subscription | null = null;
  /** Expand for Subscription list items. */
  isExpandedSubscription = false;
  /** Expand for "To" list items. */
  isExpandedTo = false;
  /** Expand for "CC" list items. */
  isExpandedCc = false;
  /** Expand for "BCC" list items. */
  isExpandedBcc = false;
  /** Reference to the bodyHtml */
  @ViewChild('bodyHtml') bodyHtml!: ElementRef;
  /** Meta Data Graphql loading state subscription */
  private metaDataLoadSubscription: Subscription = new Subscription();
  /** HTML content to be displayed in the email preview.*/
  emailPreviewHtml: any = '<div></div>';
  /** Dataset form group */
  query: any;
  /** Distribution List Send Separate */
  distributionListSeparate: any = [];
  /** Distribution List To */
  distributionListTo: any = [];
  /** Distribution List Cc */
  distributionListCc: any[] = [];
  /** Distribution List Bcc */
  distributionListBcc: any[] = [];
  /** Refernce to Subject */
  @ViewChild('subjectHtmlRef') subjectHtmlRef: any;
  /** Refernce to Subject */
  @ViewChild('emailHTMLRef') emailHTMLRef: any;
  /** data set*/
  @Input() dataset!: any[];
  /** previewUrl for cehcking the preview Type */
  previewUrl = 'email';

  /**
   * Expand see more email list dropdown for Subscription List.
   */
  toggleExpandSubscription() {
    this.isExpandedSubscription = !this.isExpandedSubscription;
  }

  /**
   * Expand see more email list dropdown for "To".
   */
  toggleExpandTo() {
    this.isExpandedTo = !this.isExpandedTo;
  }

  /**
   * Expand see more email list dropdown for "Cc".
   */
  toggleExpandCc() {
    this.isExpandedCc = !this.isExpandedCc;
  }

  /**
   * Expand see more email list dropdown for "Bcc".
   */
  toggleExpandBcc() {
    this.isExpandedBcc = !this.isExpandedBcc;
  }

  /**
   * Creates an instance of PreviewComponent.
   *
   * @param apollo - The Apollo client for making GraphQL queries.
   * @param emailService - The service for email-related operations.
   * @param sanitizer - The sanitizer for sanitizing HTML.
   * @param http - The http client for making HTTP requests.
   * @param restService - The rest service for making REST requests.
   */
  constructor(
    private apollo: Apollo,
    public emailService: EmailService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private restService: RestService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['emailService']?.currentValue?.finalEmailPreview) {
      this.loadFinalEmailPreview();
    }
  }

  ngOnInit() {
    const datasets = this.emailService.datasetsForm.get(
      'datasets'
    ) as FormArray;

    datasets.controls.forEach((control: any) => {
      if (control.get('cacheData')) {
        control.removeControl('cacheData');
      }
    });

    if (
      this.emailService.isQuickAction &&
      this.emailService.quickEmailDLQuery?.length === 0
    ) {
      const toData = this.emailService.emailDistributionList?.to;
      const ccData = this.emailService.emailDistributionList?.cc;
      const bccData = this.emailService.emailDistributionList?.bcc;
      this.emailService.quickEmailDLQuery = { to: [], cc: [], bcc: [] };
      this.emailService.quickEmailDLQuery.to = cloneDeep(toData);
      this.emailService.quickEmailDLQuery.cc = cloneDeep(ccData);
      this.emailService.quickEmailDLQuery.bcc = cloneDeep(bccData);
    }

    if (this.emailService.isQuickAction) {
      this.populateDLForm();
    }

    this.query = this.emailService.datasetsForm.value;
    this.query.datasets = this.emailService.datasetsForm
      ?.get('datasets')
      ?.getRawValue();
    this.query.emailDistributionList = this.query.emailDistributionList
      ? this.query.emailDistributionList
      : {};
    this.query.emailDistributionList = this.emailService?.datasetsForm
      ?.get('emailDistributionList')
      ?.getRawValue();
    if (this.emailService.isQuickAction) {
      this.query.emailDistributionList.to =
        this.emailService.quickEmailDLQuery.to;
      this.query.emailDistributionList.cc =
        this.emailService.quickEmailDLQuery.cc;
      this.query.emailDistributionList.bcc =
        this.emailService.quickEmailDLQuery.bcc;
    }
    this.loadDistributionList();
    this.loadFinalEmailPreview();
  }

  /**
   * Populates dataset Form using custom template DL object
   */
  populateDLForm() {
    if (this.emailService.isQuickAction) {
      const { to, cc, bcc } = this.emailService.emailDistributionList; //this.emailService.customLayoutDL;

      const uniqueTo: any = [...new Set(to?.inputEmails ?? to)];
      const uniqueCc: any = [...new Set(cc?.inputEmails ?? cc)];
      const uniqueBcc: any = [...new Set(bcc?.inputEmails ?? bcc)];

      this.emailService.emailDistributionList.to = uniqueTo;
      this.emailService.emailDistributionList.cc = uniqueCc;
      this.emailService.emailDistributionList.bcc = uniqueBcc;

      this.distributionListTo = this.emailService.emailDistributionList.to;
      this.distributionListCc = this.emailService.emailDistributionList.cc;
      this.distributionListBcc = this.emailService.emailDistributionList.bcc;

      this.emailService.populateEmails(
        this.emailService.emailDistributionList.to,
        this.emailService?.datasetsForm
          ?.get('emailDistributionList')
          ?.get('to')
          ?.get('inputEmails') as FormArray
      );

      this.emailService.populateEmails(
        this.emailService.emailDistributionList.cc,
        this.emailService?.datasetsForm
          ?.get('emailDistributionList')
          ?.get('cc')
          ?.get('inputEmails') as FormArray
      );

      this.emailService.populateEmails(
        this.emailService.emailDistributionList.bcc,
        this.emailService?.datasetsForm
          ?.get('emailDistributionList')
          ?.get('bcc')
          ?.get('inputEmails') as FormArray
      );
    }
  }

  /**
   * Loads the distribution list.
   *
   */
  loadDistributionList() {
    this.emailService.loading = true;
    const objData: any = cloneDeep(this.query);
    //Updating payload

    if (
      this.emailService.emailDistributionList.to instanceof Array &&
      objData.emailDistributionList.to
    ) {
      objData.emailDistributionList.to.inputEmails = this.emailService
        ?.emailDistributionList?.to?.inputEmails
        ? this.emailService.emailDistributionList.to.inputEmails
        : this.emailService.emailDistributionList.to;
    }
    if (
      this.emailService.emailDistributionList.cc instanceof Array &&
      objData.emailDistributionList.cc
    ) {
      objData.emailDistributionList.cc.inputEmails = this.emailService
        ?.emailDistributionList?.cc?.inputEmails
        ? this.emailService.emailDistributionList.cc.inputEmails
        : this.emailService.emailDistributionList.cc;
    }
    if (
      this.emailService.emailDistributionList.bcc instanceof Array &&
      objData.emailDistributionList.bcc
    ) {
      objData.emailDistributionList.bcc.inputEmails = this.emailService
        ?.emailDistributionList?.bcc?.inputEmails
        ? this.emailService.emailDistributionList.bcc.inputEmails
        : this.emailService.emailDistributionList.bcc;
    }

    if (objData.emailDistributionList?.to?.commonServiceFilter?.filter) {
      objData.emailDistributionList.to.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList?.to?.commonServiceFilter?.filter
        );
    }

    if (objData.emailDistributionList?.cc?.commonServiceFilter) {
      objData.emailDistributionList.cc.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList?.cc?.commonServiceFilter?.filter
        );
    }

    if (objData.emailDistributionList?.bcc?.commonServiceFilter) {
      objData.emailDistributionList.bcc.commonServiceFilter =
        this.emailService.setCommonServicePayload(
          objData.emailDistributionList?.bcc?.commonServiceFilter?.filter
        );
    }

    //If no Fields selected then set as []
    if (
      objData.emailDistributionList?.to?.commonServiceFilter?.filters?.filter(
        (x: any) => x?.field != null
      )?.length === 0
    ) {
      objData.emailDistributionList.to.commonServiceFilter.filters = [];
    }
    this.http
      .post(
        `${this.restService.apiUrl}/notification/preview-distribution-lists/`,
        objData
      )
      .subscribe(
        (response: any) => {
          if (
            this.query.emailDistributionList.to?.resource?.trim() !== '' ||
            this.query.emailDistributionList.cc?.resource?.trim() !== '' ||
            this.query.emailDistributionList.bcc?.resource?.trim() !== '' ||
            this.query.emailDistributionList?.to?.inputEmails?.length > 0 ||
            this.query.emailDistributionList?.cc?.inputEmails?.length > 0 ||
            this.query.emailDistributionList?.bcc?.inputEmails?.length > 0
          ) {
            this.distributionListTo = [
              ...new Set(
                response?.to.concat(
                  this.emailService.emailDistributionList.to?.inputEmails ??
                    this.emailService.emailDistributionList.to
                )
              ),
            ];

            this.distributionListCc = [
              ...new Set(
                response?.cc.concat(
                  this.emailService.emailDistributionList.cc?.inputEmails ??
                    this.emailService.emailDistributionList.cc
                )
              ),
            ];

            this.distributionListBcc = [
              ...new Set(
                response?.bcc.concat(
                  this.emailService.emailDistributionList.bcc?.inputEmails ??
                    this.emailService.emailDistributionList.bcc
                )
              ),
            ];
            this.emailService.emailDistributionList.to =
              this.distributionListTo;
            this.emailService.emailDistributionList.cc =
              this.distributionListCc;
            this.emailService.emailDistributionList.bcc =
              this.distributionListBcc;
          }

          this.distributionListSeparate = response?.individualEmailList;
          this.distributionListSeparate?.forEach((block: any) => {
            block.isExpanded = false;
            block.emails = Array.from(new Set(block.emails)); // Remove duplicate emails
          });

          if (
            !this.distributionListTo.length &&
            !this.distributionListSeparate.length
          ) {
            this.emailService.disableSaveAndSend.next(true);
          } else {
            this.emailService.disableSaveAndSend.next(false);
          }
          this.emailService.loading = false;
        },
        () => {
          this.emailService.loading = false;
        }
      );
  }

  /**
   * Loads the final email preview.
   *
   */
  async loadFinalEmailPreview(): Promise<void> {
    const previewData: any = this.emailService.allPreviewData?.[0];
    if (
      this.emailService.datasetsForm.value.emailLayout !== null &&
      this.emailService.datasetsForm.value.emailLayout !== undefined &&
      !this.emailService.datasetsForm.value.emailLayout
    ) {
      this.emailService.isQuickAction = true;
      this.emailService.quickEmailDLQuery = [];
    }
    this.previewUrl = `${this.restService.apiUrl}/notification/preview-email/`;

    // Checks if url exists
    if (this.previewUrl) {
      this.emailService.loading = true; // Show spinner
      // if (!this.emailService.datasetsForm.value.emailLayout) {
      await this.emailService.patchEmailLayout();

      if (this.emailService.isQuickAction) {
        if (this.query?.datasets.length > 0) {
          this.query.datasets[0].name = 'Block 1';
          this.query.datasets[0].query.filter = previewData?.dataQuery?.filter
            ? previewData.dataQuery.filter
            : this.query.datasets[0].query.filter;
          this.query.datasets[0].query.name =
            previewData?.dataQuery?.queryName || '';
          this.query.datasets[0].query.fields =
            previewData?.dataQuery?.fields || [];
        }
        if (this.emailService.allPreviewData.length > 0) {
          this.emailService.allPreviewData[0]['emailDistributionList'] =
            this.query?.emailDistributionList;
        }
        this.query.datasets[0].navigateToPage = previewData?.navigateToPage;
        this.query.datasets[0].navigateSettings = previewData?.navigateSettings;
      }

      this.query.emailLayout =
        this.emailService.datasetsForm.getRawValue().emailLayout;
      if (
        this.query?.datasets?.length > 0 &&
        this.emailService?.isQuickAction
      ) {
        this.query.datasets[0].resource = '';
      }
      const objData: any = cloneDeep(this.query);
      objData.emailLayout.name = this.emailService?.layoutTitle;
      if (!this.emailService.isQuickAction) {
        //Updating payload
        objData.emailDistributionList.to.commonServiceFilter =
          this.emailService.setCommonServicePayload(
            objData.emailDistributionList.to.commonServiceFilter.filter
          );

        objData.emailDistributionList.cc.commonServiceFilter =
          this.emailService.setCommonServicePayload(
            objData.emailDistributionList.cc.commonServiceFilter.filter
          );

        objData.emailDistributionList.bcc.commonServiceFilter =
          this.emailService.setCommonServicePayload(
            objData.emailDistributionList.bcc.commonServiceFilter.filter
          );
      }

      //If no Fields selected then set as []
      if (
        objData.emailDistributionList?.to?.commonServiceFilter?.filters?.filter(
          (x: any) => x?.field != null
        )?.length === 0
      ) {
        objData.emailDistributionList.to.commonServiceFilter.filters = [];
      }
      this.http.post(this.previewUrl, objData).subscribe(
        (response: any) => {
          this.emailService.finalEmailPreview = response;
          this.updateEmailContainer(); // Update the email container with the new preview
          this.subjectString =
            this.emailService.finalEmailPreview.subject ?? this.subjectString; // Updae/Replace the subject string from the response
          if (this.subjectHtmlRef?.nativeElement) {
            this.subjectHtmlRef.nativeElement.innerHTML = this.subjectString;
          }
          this.emailService.loading = false; // Hide spinner
        },
        (error: string) => {
          console.error('Failed to load final email preview:', error);
          this.emailService.loading = false; // Hide spinner in case of error
        }
      );
    }
  }

  /**
   * Updates the email container with the new preview
   */
  updateEmailContainer(): void {
    const emailContainer = this.emailHTMLRef?.nativeElement;
    if (emailContainer) {
      this.emailPreviewHtml =
        this.emailService.finalEmailPreview ?? '<div></div>';
      emailContainer.innerHTML = new TextDecoder().decode(
        Uint8Array.from(window.atob(this.emailPreviewHtml.html), (c) =>
          c.charCodeAt(0)
        )
      );
    }
  }

  ngAfterViewInit(): void {
    this.replaceTokensWithTables();
    this.replaceDateTimeTokens();
    this.emailService.emailDistributionList =
      this.emailService.emailDistributionList == undefined
        ? {
            name: '',
            to: [],
            cc: [],
            bcc: [],
          }
        : this.emailService.emailDistributionList;
    // this.bodyHtml.nativeElement.innerHTML = this.bodyString;
    // this.checkAndApplyBodyStyle();
    if (this.subjectHtmlRef?.nativeElement) {
      this.subjectHtmlRef.nativeElement.innerHTML =
        this.emailPreviewHtml.subject ?? '<div></div>';
    }

    this.emailPreviewHtml =
      this.emailService.finalEmailPreview ?? '<div></div>';
    if (this.emailHTMLRef?.nativeElement) {
      this.emailHTMLRef.nativeElement.innerHTML = this.emailPreviewHtml
        .html as string;
    }

    // this.loadFinalEmailPreview();
    if (this.emailService.allLayoutdata.bannerImage) {
      this.bannerImage = this.emailService.allLayoutdata.bannerImage;
    }

    if (
      (document.getElementById('footerHtml') as HTMLInputElement)?.innerHTML
    ) {
      (document.getElementById('footerHtml') as HTMLInputElement).innerHTML =
        this.footerString;
    }
  }

  /**
   * Replaces Subject Tokens with data from the first row of data.
   */
  replaceSubjectTokens() {
    const tokenRegex = TokenRegex;
    const firstRowData = this.emailService.allPreviewData[0]?.dataList[0];
    const fieldNameList = this.subjectString.match(tokenRegex);
    fieldNameList?.forEach((fName: any) => {
      const fieldName = fName.replace('{{', '').replace('}}', '');
      const fieldValue = firstRowData[fieldName];

      if (fieldValue !== undefined) {
        if (fieldValue instanceof Date) {
          this.subjectString = this.subjectString.replace(
            fName,
            fieldValue.toLocaleString('en-US', {
              month: 'numeric',
              day: 'numeric',
              year: '2-digit',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'UTC',
              timeZoneName: 'short',
            })
          );
        } else if (typeof fieldValue === 'string') {
          const date = new Date(fieldValue);
          if (!isNaN(date.getTime())) {
            this.subjectString = this.subjectString.replace(
              fName,
              date.toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC',
                timeZoneName: 'short',
              })
            );
          }
        }
        this.subjectString = this.subjectString.replace(fName, fieldValue);
      }
    });
  }

  /**
   * Retrieves the style based on the item name then sets the style in the email service.
   *
   * @param item The item you are retrieving the inline styling of.
   * @returns The inline styling of the item.
   */
  getEmailStyle(item: string): string {
    const styles: { [key: string]: string } = {}; // Define the type of the styles object
    switch (item) {
      case 'bannerImage':
        styles[
          'bannerImageStyle'
        ] = `max-width: 100%; height: auto; object-fit: contain; padding-bottom: 0.5rem; align-items: center;`;
        break;
      case 'header':
        styles[
          'headerStyle'
        ] = `margin: 0 auto; display: flex; width: 100%; background-color: ${this.emailService.allLayoutdata.headerBackgroundColor};`;
        break;
      case 'headerLogo':
        styles[
          'headerLogoStyle'
        ] = `margin: 0.5rem; display: block; width: 15%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.emailService.allLayoutdata.headerBackgroundColor};`;
        break;
      case 'headerHtml':
        styles[
          'headerHtmlStyle'
        ] = `text-align: center; margin: 0.5rem auto; padding: 0.5rem; width: 80%; overflow: hidden; background-color: ${this.emailService.allLayoutdata.headerBackgroundColor}; color: ${this.emailService.allLayoutdata.headerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
      case 'body':
        styles[
          'bodyStyle'
        ] = `text-align: center; padding: 0.5rem; padding-top: 1rem; width: 100%; overflow-x: auto; background-color: ${this.emailService.allLayoutdata.bodyBackgroundColor}; color: ${this.emailService.allLayoutdata.bodyTextColor}; flex-grow: 1;`;
        break;
      case 'footer':
        styles[
          'footerStyle'
        ] = `display: flex; width: 100%; background-color: ${this.emailService.allLayoutdata.footerBackgroundColor};`;
        break;
      case 'footerImg':
        styles[
          'footerImgStyle'
        ] = `margin: 0.5rem; display: block; width: 20%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.emailService.allLayoutdata.footerBackgroundColor};`;
        break;
      case 'footerHtml':
        styles[
          'footerHtmlStyle'
        ] = `width: 80%; padding-top: 1rem; overflow: hidden; background-color: ${this.emailService.allLayoutdata.footerBackgroundColor}; color: ${this.emailService.allLayoutdata.footerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
      case 'copyright':
        styles[
          'copyrightStyle'
        ] = `text-align: center; width: 100%; padding-top: 0.5rem; padding-bottom: 0.5rem; box-sizing: border-box; background-color: #00205C; color: white; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif; margin-top: auto;`;
        break;

      case 'container':
        styles[
          'containerStyle'
        ] = `border: 2px solid #00205C; width: 100%; height: 60%; box-sizing: border-box; display: flex; flex-direction: column;`;
        break;
      default:
        return '';
    }
    this.emailService.setEmailStyles(styles);
    return styles[item + 'Style'] || '';
  }

  /**
   * Retrieves the table object based on the item name then sets the style in the email service.
   *
   * @param item The table part you are retrieving the inline styling of.
   * @returns The inline style of the item.
   */
  getTableStyle(item: string): string {
    const styles: { [key: string]: string } = {};
    switch (item) {
      case 'tableDiv':
        styles[
          'tableDivStyle'
        ] = `display: flex; flex-direction: column !important; align-items: center; width: 90%; margin: 0 auto; margin-top: 1rem;`;
        break;
      case 'label':
        styles[
          'labelStyle'
        ] = `display: block; text-align: left; padding-left: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; width: 100%; font-size: 0.875rem; line-height: 1.25rem; font-family: 'Source Sans Pro', sans-serif; background-color: #00205C; color: white; font-style: normal; font-weight: 700;`;
        break;
      case 'table':
        styles['tableStyle'] =
          'width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; overflow:auto; padding-left: 1.25rem; padding-top: 0.5rem; padding-bottom: 0.5rem; padding-right: 0.5rem;';
        break;
      case 'thead':
        styles[
          'theadStyle'
        ] = `background-color: #00205C; color: white; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
      case 'tbody':
        styles['tbodyStyle'] = `font-size: 14px;`;
        break;
      case 'th':
        styles['thStyle'] =
          'text-align: left; padding: 0.5rem; background-color: #00205C; color: white;';
        break;
      case 'tr':
        styles['trStyle'] =
          'border-top: 1px solid #d1d5db; background-color: white;';
        break;
      case 'td':
        styles[
          'tdStyle'
        ] = `padding: 0.5rem; text-align: left; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif; color: #000000;`;
        break;
    }
    this.emailService.setTableStyles(styles);
    return styles[item + 'Style'] || '';
  }

  /**
   * This function formats the date and time in a readable format
   * for in the last.
   *
   * @param minutes The in the last number and unit converted to minutes
   * @returns The formatted date and time.
   */
  formatInLastString(minutes: number): string {
    const currentDate = new Date();
    // Multiplied by 60000 to convert minutes to milliseconds (to match getTime)

    // Current date offset by minutes param
    const pastDate = new Date(currentDate.getTime() - minutes * 60000);

    // Past Date in date format (mm/dd/yyyy)
    const formattedPastDate = pastDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    });

    // Past Date in time format (hh:mm)
    const formattedPastTime = pastDate.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      timeZoneName: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });

    // Current Date in date format (mm/dd/yyyy)
    const formattedCurrentDate = currentDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    });

    // Current Date in time format (hh:mm)
    const formattedCurrentTime = currentDate.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      timeZoneName: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });

    // If minutes is greater than a week then set past time as current time
    const minutesInAWeek = 7 * 24 * 60;
    if (minutes > minutesInAWeek) {
      return `From ${formattedPastDate} ${formattedCurrentTime} as of ${formattedCurrentDate} ${formattedCurrentTime}`;
    }

    return `From ${formattedPastDate} ${formattedPastTime} as of ${formattedCurrentDate} ${formattedCurrentTime}`;
  }

  /**
   * This function replaces certain in the last tokens in the header string.
   *
   * @param headerString The current header text value.
   */
  replaceInTheLast(headerString: string | any): void {
    // Token matching {{String.String.number}}
    const tokenRegex = /{{([^}]+)\.([^}]+)\.(\d+)}}/g;
    let match;
    while ((match = tokenRegex.exec(headerString)) !== null) {
      // Extract the unitInMinutes from the token
      const unitInMinutes = Number(match[3]);
      const formattedDateTime = this.formatInLastString(unitInMinutes);
      // Replace the entire token with the formatted date and time
      headerString = headerString.replace(match[0], formattedDateTime);
    }
    this.headerString = headerString;
  }

  /**
   * Parses the email body string and replaces dataset tokens with corresponding HTML tables.
   */
  replaceTokensWithTables(): void {
    this.bodyString = this.emailService.allLayoutdata.bodyHtml;
    // Token matching {{String}}
    const tokenRegex = /{{([^}]+)}}/g;
    let match;
    while ((match = tokenRegex.exec(this.bodyString)) !== null) {
      const tabName = match[1]; // Extract the tab name from the token
      const previewData = this.emailService.allPreviewData.find(
        (data) => data.tabName === tabName
      );

      if (previewData) {
        const tableHtml = this.emailService.allPreviewData?.[0].dataList; //this.convertPreviewDataToHtml(previewData);
        this.bodyString = this.bodyString.replace(match[0], tableHtml);
      }
    }
  }

  /**
   * Replaces time tokens with string value for both header and footer.
   */
  replaceDateTimeTokens(): void {
    const currentDate = new Date();

    const dateString = currentDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      timeZoneName: 'short',
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    });
    const timeString = currentDate.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      timeZoneName: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
    const dateTimeString = currentDate.toLocaleString('en-US', {
      timeZone: 'UTC',
      timeZoneName: 'short',
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    });

    // Tokens to match
    const tokens = {
      '{{today.date}}': dateString,
      '{{now.datetime}}': dateTimeString,
      '{{now.time}}': timeString,
    };

    this.subjectString = this.emailService.allLayoutdata.txtSubject;
    if (this.subjectString) {
      Object.entries(tokens).forEach(([token, value]) => {
        this.subjectString = this.subjectString.replace(
          new RegExp(token, 'g'),
          value
        );
      });
      // this.replaceSubjectTokens();
    } else {
      this.subjectString = '';
    }

    // this.headerString = this.emailService.allLayoutdata.headerHtml;
    // if (this.headerString) {
    //   Object.entries(tokens).forEach(([token, value]) => {
    //     this.headerString = this.headerString?.replace(
    //       new RegExp(token, 'g'),
    //       value
    //     );
    //   });
    //   this.replaceInTheLast(this.headerString);
    // } else {
    //   this.headerString = '';
    // }

    // this.footerString = this.emailService.allLayoutdata.footerHtml;
    // if (this.footerString) {
    //   Object.entries(tokens).forEach(([token, value]) => {
    //     this.footerString = this.footerString.replace(
    //       new RegExp(token, 'g'),
    //       value
    //     );
    //   });
    // } else {
    //   this.footerString = '';
    // }
  }

  /**
   * Converts the given preview data into an HTML table representation.
   *
   * @param previewData The data to be converted into an HTML table.
   * @returns An HTML string representing the data as a table.
   */
  convertPreviewDataToHtml(previewData: any): string {
    if (!previewData?.dataList?.length) {
      return `
      <div style="${this.getTableStyle('tableDiv')}">
        <div style="width: 100%;">
          <label style="${this.getTableStyle('label')}">
          ${previewData.tabName}</label>
        </div>
        <div style="width: 100%; overflow-x: auto;">
          <table style="${this.getTableStyle('table')};">
            <tbody style="${this.getTableStyle('tbody')}">
              <tr style="${this.getTableStyle('tr')}">
                <td style="${this.getTableStyle('td')}">no data found</td>
              <tr>
            </tbody>
          </table>
        </div>
      </div>`;
    }

    const theadHtml = previewData.datasetFields
      .map(
        (fieldKeyString: any) =>
          `<th style="${this.getTableStyle(
            'th'
          )}">${this.emailService.titleCase(
            this.emailService.replaceUnderscores(fieldKeyString)
          )}</th>`
      )
      .join('');

    const tbodyHtml = previewData.dataList
      .map(
        (data: any) =>
          `<tr style="${this.getTableStyle('tr')}">${previewData.datasetFields
            .map(
              (fieldKeyString: any) =>
                `<td style="${this.getTableStyle(
                  'td'
                )}">${this.emailService.formatDataStrings(
                  data[fieldKeyString] ?? '',
                  fieldKeyString
                )}</td>`
            )
            .join('')}</tr>`
      )
      .join('');

    const tableHtml = `
  <div style="${this.getTableStyle('tableDiv')}">
    <label style="${this.getTableStyle('label')}">${previewData.tabName}</label>
    <div style="width: 100%; overflow-x: auto;">
      <table style="${this.getTableStyle('table')}" class="dataset-preview">
        <thead style="${this.getTableStyle('thead')}">
          <tr style="${this.getTableStyle('tr')}">
            ${theadHtml}
          </tr>
        </thead>
        <tbody style="${this.getTableStyle('tbody')}">
          ${tbodyHtml}
        </tbody>
      </table>
    </div>
  </div>
`;
    return tableHtml;
  }

  override ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    this.emailService.patchTableStyles();
  }
}
