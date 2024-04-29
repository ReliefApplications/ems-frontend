import { EventEmitter, Injectable, NgZone, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ADD_EMAIL_NOTIFICATION,
  GET_AND_UPDATE_EMAIL_NOTIFICATION,
  GET_DATA_SET,
  GET_EMAIL_NOTIFICATIONS,
} from './graphql/queries';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestService } from '../../services/rest/rest.service';
import { TYPE_LABEL } from './filter/filter.constant';

/**
 * Helper functions service for emails template.
 */
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  /** Index of current dataset block */
  public index = new BehaviorSubject(null);
  /** Dataset block title */
  public title = new BehaviorSubject<string>('');
  /** Current email notification form group */
  public datasetsForm!: FormGroup;
  /** Email resources */
  public resourcesNameId!: {
    name: string | undefined;
    id: string | undefined;
  }[];
  /** Selected dataset */
  public selectedDataSet: any;
  /** Form group for to: email field */
  public toEmailFilter!: FormGroup | any;
  /** Form group for cc: email field */
  public ccEmailFilter!: FormGroup | any;
  /** Form group for bcc: email field */
  public bccEmailFilter!: FormGroup | any;
  /** Email preview data */
  public allPreviewData: any[] = [];
  /** Email type ( only email supported now ) */
  public notificationTypes: string[] = ['email', 'alert', 'push notification'];
  /** Email layout data + styles */
  public emailLayout!: any;
  /** Email header background color */
  public headerBackgroundColor = '#00205C';
  /** Email header text color */
  public headerTextColor = '#FFFFFF';
  /** Email body background color */
  public bodyBackgroundColor = '#FFFFFF';
  /** Email body text color */
  public bodyTextColor = '#000000';
  /** Email footer background color */
  public footerBackgroundColor = '#FFFFFF';
  /** Email footer text color */
  public footerTextColor = '#000000';
  /** Dataset event emitter */
  public datasetSave: EventEmitter<boolean> = new EventEmitter();
  /** Disable SaveAsDraft button  */
  public disableSaveAsDraft = new BehaviorSubject<boolean>(false);
  /** Control save & proceed button disable status */
  public disableSaveAndProceed = new BehaviorSubject<boolean>(false);
  /** Control stepper disable status */
  public stepperDisable = new BehaviorSubject<any>('');
  /** Should show existing distribution list */
  public showExistingDistributionList = false;
  /** Distribution list data */
  public recipients: {
    distributionListName: string;
    To: string[];
    Cc: string[];
    Bcc: string[];
  } = {
    distributionListName: '',
    To: [],
    Cc: [],
    Bcc: [],
  };
  /** List of tabs */
  public tabs: any[] = [
    {
      title: `Block 1`,
      content: `Block 1 Content`,
      active: true,
      index: 0,
    },
  ];
  /** Used to disable stepper steps */
  public disableFormSteps = new BehaviorSubject({
    stepperIndex: 0,
    disableAction: false,
  });
  /** Should stepper enable all steps */
  public enableAllSteps = new BehaviorSubject<boolean>(false);
  /** Email layout data */
  public allLayoutdata: any = {
    /** Images & styles */
    bannerImage: null,
    bannerImageStyle: '',
    /** Container style */
    containerStyle: '',
    /** FOOTER COPYRIGHT STYLE */
    copyrightStyle: '',
    /** Email subject */
    txtSubject: '',
    /** Email header */
    headerHtml: '',
    headerLogo: null,
    headerLogoStyle: '',
    headerBackgroundColor: this.headerBackgroundColor,
    headerTextColor: this.headerTextColor,
    headerStyle: '',
    /** Email body */
    bodyHtml: '',
    bodyBackgroundColor: this.bodyBackgroundColor,
    bodyTextColor: this.bodyTextColor,
    bodyStyle: '',
    /** Email footer */
    footerHtml: '',
    footerLogo: null,
    footerBackgroundColor: this.footerBackgroundColor,
    footerTextColor: this.footerTextColor,
    footerStyle: '',
    footerImgStyle: '',
    footerHtmlStyle: '',
  };

  /** Default block dataset table style*/
  public defaultTableStyle: any = {
    tableDivStyle: '',
    labelStyle: '',
    tableStyle: '',
    theadStyle: '',
    tbodyStyle: '',
    thStyle: '',
    trStyle: '',
    tdStyle: '',
  };
  /** Is distribution list existing */
  isExisting = true;
  /** Email notification id */
  public configId: string | undefined;
  /** Datalist */
  public dataList!: { [key: string]: any }[];
  /** Dataset fields */
  public dataSetFields!: string[];
  /** Email distribution list of names */
  public distributionListNames: string[] = [];
  /** Email notification list of names */
  public emailNotificationNames: string[] = [];
  /** Email notification edit id */
  public editId = '';
  /** navigate to preview emitter */
  @Output() navigateToPreview: EventEmitter<any> = new EventEmitter();
  /** Current step */
  stepperStep = 0;
  /** Is in edit mode */
  public isEdit = false;
  /** Is in preview */
  public isPreview = false;
  /** Is email stepper linear */
  public isLinear = true;
  /** Email loading checker */
  public emailListLoading = true;
  /** Separate email lists */
  public separateEmail = [];

  /**
   * Constructs the EmailService instance.
   *
   * @param formBuilder The FormBuilder instance used to create form groups and controls
   * @param apollo The Apollo server instance used for GraphQL queries
   * @param http The HttpClient instance used for making HTTP requests
   * @param restService mapping of the url
   * @param ngZone The NgZone instance used for executing work inside or outside of the Angular zone.
   */
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private http: HttpClient,
    private restService: RestService,
    private ngZone: NgZone
  ) {
    this.setDatasetForm();
  }

  /**
   * Generates new dataset group.
   *
   * @returns new Dataset form group.
   */
  createNewDataSetGroup(): FormGroup {
    return this.formBuilder.group({
      resource: null,
      name: null,
      pageSize: 10,
      filter: this.formBuilder.group({
        logic: 'and',
        filters: new FormArray([]),
      }),
      fields: [],
      cacheData: {},
      tableStyle: this.defaultTableStyle,
      blockType: 'table', // Either Table or Text
      textStyle: this.formBuilder.group({
        fields: new FormArray([]),
        blockStyle: '',
      }), // Fields (field selected and style), Block Style (HTML wrapping field with token)
      individualEmail: false,
    });
  }

  /**
   * Initialises the `datasetsForm` with a default structure and validators.
   */
  setDatasetForm() {
    this.datasetsForm = this.formBuilder.group({
      name: ['', Validators.required],
      notificationType: [null, Validators.required],
      applicationId: [''],
      dataSets: new FormArray([this.createNewDataSetGroup()]),
      recipients: this.recipients,
      emailLayout: this.emailLayout,
      schedule: [''],
    });
  }

  /**
   * Sets the email layout styles.
   */
  setEmailStyles(styles: { [key: string]: string } = {}) {
    const defaultStyles = {
      headerStyle: `margin: 0 auto; display: flex; width: 100%; background-color: ${this.allLayoutdata.headerBackgroundColor};`,
      headerHtmlStyle: `text-align: center; margin: 0.5rem auto; padding: 0.5rem; width: 80%; overflow: hidden; background-color: ${this.allLayoutdata.headerBackgroundColor}; color: ${this.allLayoutdata.headerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`,
      headerLogoStyle: `margin: 0.5rem; display: block; width: 20%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.allLayoutdata.headerBackgroundColor};`,
      bodyStyle: `text-align: center; margin: 0.5rem auto; padding: 0.5rem; width: 90%;overflow-x: auto; background-color: ${this.allLayoutdata.bodyBackgroundColor}; color: ${this.allLayoutdata.bodyTextColor};`,
      footerStyle: `margin: 0.25rem 0; display: flex; width: 90%; background-color: ${this.allLayoutdata.footerBackgroundColor};`,
      footerImgStyle: `margin: 0.5rem; display: block; width: 20%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.allLayoutdata.footerBackgroundColor};`,
      footerHtmlStyle: `width: 80%; overflow: hidden; background-color: ${this.allLayoutdata.footerBackgroundColor}; color: ${this.allLayoutdata.footerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`,
      bannerImageStyle: `max-width: 100%; height: auto; object-fit: contain; padding-bottom: 0.5rem;`,
      copyrightStyle: `text-align: center; width: 100%; padding-top: 0.5rem; padding-bottom: 0.5rem; box-sizing: border-box; background-color: #00205C; color: white; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif; margin-top: auto;`,
      containerStyle: `border: 2px solid #00205C; width: 100%; height: 100%; box-sizing: border-box; display: flex; flex-direction: column;`,
    };

    // Initialize allLayoutdata with default styles if they are not already set
    Object.keys(defaultStyles).forEach((key: string) => {
      if (
        this.allLayoutdata[key as keyof typeof defaultStyles] === undefined ||
        this.allLayoutdata[key as keyof typeof defaultStyles] === null
      ) {
        this.allLayoutdata[key as keyof typeof defaultStyles] =
          defaultStyles[key as keyof typeof defaultStyles];
      }
    });

    // Override with provided styles
    Object.keys(styles).forEach((key: string) => {
      if (styles[key] !== undefined && styles[key] !== null) {
        this.allLayoutdata[key as keyof typeof defaultStyles] = styles[key];
      }
    });
  }

  /**
   * Sets the Table Styles.
   */
  setTableStyles(styles: { [key: string]: string }) {
    Object.keys(styles).forEach((styleKey) => {
      if (styles[styleKey] !== undefined) {
        this.defaultTableStyle[styleKey] = styles[styleKey];
      }
    });
  }

  /**
   * Retrieves the Table inline Styles.
   *
   * @returns Table inline Styles
   */
  getTableStyles(): any {
    return this.defaultTableStyle;
  }

  /**
   * Sets the selected data set.
   *
   * @param dataSet The data set to be selected.
   */
  setSelectedDataSet(dataSet: any): void {
    this.selectedDataSet = dataSet;
  }

  /**
   * get selected data set
   *
   *@returns dataset
   */
  getSelectedDataSet(): any {
    return this.selectedDataSet;
  }

  /**
   * Sets the preview data for all tabs.
   *
   * @param previewData An array of preview data objects for each tab.
   */
  setAllPreviewData(previewData: any[]): void {
    this.allPreviewData = previewData;
  }

  /**
   * Retrieves all preview data objects.
   *
   * @returns An array of all preview data objects.
   */
  getAllPreviewData(): any[] {
    return this.allPreviewData;
  }

  /**
   * Converts a file to a base64 string.
   *
   * @param file The file to be converted.
   * @returns A promise that resolves to the base64 string.
   */
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // The result attribute contains the data as a base64 encoded string
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Converts a base64 string to a file.
   *
   * @param base64String base64 string you want to convert.
   * @param filename name of the file.
   * @param mimeType file type.
   * @returns A file object
   */
  convertBase64ToFile(
    base64String: string,
    filename: string,
    mimeType: string
  ): File {
    // Check if the base64 string contains the data URL prefix and remove it
    const base64Data = base64String.split(',')[1] || base64String;

    // Decode the base64 string
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: mimeType });

    const file = new File([blob], filename, { type: mimeType });
    return file;
  }

  /**
   * Retrieves all preview data objects.
   */
  patchEmailLayout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Your existing code with modifications to handle promises
      this.setEmailStyles();
      this.ngZone.run(() => {
        const headerPromise =
          this.allLayoutdata?.headerLogo instanceof File
            ? this.convertFileToBase64(this.allLayoutdata?.headerLogo)
            : Promise.resolve(null);

        const footerPromise =
          this.allLayoutdata?.footerLogo instanceof File
            ? this.convertFileToBase64(this.allLayoutdata?.footerLogo)
            : Promise.resolve(null);

        const bannerPromise =
          this.allLayoutdata?.bannerImage instanceof File
            ? this.convertFileToBase64(this.allLayoutdata?.bannerImage)
            : Promise.resolve(null);

        Promise.all([headerPromise, footerPromise, bannerPromise])
          .then(([headerImg, footerImg, bannerLogo]) => {
            this.emailLayout = {
              subject: this.allLayoutdata?.txtSubject,
              header: {
                headerHtml: this.allLayoutdata?.headerHtml,
                headerLogo: headerImg,
                headerLogoStyle: this.allLayoutdata.headerLogoStyle,
                headerBackgroundColor: this.allLayoutdata.headerBackgroundColor,
                headerTextColor: this.allLayoutdata.headerTextColor,
                headerHtmlStyle: this.allLayoutdata?.headerHtmlStyle,
                headerStyle: this.allLayoutdata?.headerStyle,
              },
              body: {
                bodyHtml: this.allLayoutdata?.bodyHtml,
                bodyBackgroundColor: this.allLayoutdata.bodyBackgroundColor,
                bodyTextColor: this.allLayoutdata.bodyTextColor,
                bodyStyle: this.allLayoutdata?.bodyStyle,
              },
              banner: {
                bannerImage: bannerLogo,
                bannerImageStyle: this.allLayoutdata?.bannerImageStyle,
                containerStyle: this.allLayoutdata?.containerStyle,
                copyrightStyle: this.allLayoutdata?.copyrightStyle,
              },
              footer: {
                footerHtml: this.allLayoutdata?.footerHtml,
                footerLogo: footerImg,
                footerBackgroundColor: this.allLayoutdata.footerBackgroundColor,
                footerTextColor: this.allLayoutdata.footerTextColor,
                footerStyle: this.allLayoutdata?.footerStyle,
                footerImgStyle: this.allLayoutdata?.footerImgStyle,
                footerHtmlStyle: this.allLayoutdata?.footerHtmlStyle,
              },
            };
            this.datasetsForm.get('emailLayout')?.setValue(this.emailLayout);
            this.allLayoutdata.headerLogo = headerImg;
            this.allLayoutdata.footerLogo = footerImg;
            this.allLayoutdata.bannerImage = bannerLogo;
            resolve(); // Resolve the promise when all asynchronous tasks are completed
          })
          .catch((error) => {
            reject(error); // Reject the promise if an error occurs
          });
      });
    });
  }

  /**
   * Patches the table styles with the default values.
   */
  patchTableStyles(): void {
    const tableStyles = {
      tableDivStyle: this.defaultTableStyle?.tableDivStyle,
      labelStyle: this.defaultTableStyle?.labelStyle,
      tableStyle: this.defaultTableStyle?.tableStyle,
      theadStyle: this.defaultTableStyle?.theadStyle,
      tbodyStyle: this.defaultTableStyle?.tbodyStyle,
      thStyle: this.defaultTableStyle?.thStyle,
      trStyle: this.defaultTableStyle?.trStyle,
      tdStyle: this.defaultTableStyle?.tdStyle,
    };

    this.datasetsForm.get('dataSets')?.get('tableStyle')?.setValue(tableStyles);
  }

  /**
   * Retrieves preview data for a specific tab by name.
   *
   * @param tabName The name of the tab to retrieve preview data for.
   * @returns The preview data object for the specified tab, if found.
   */
  getAllPreviewDataByTabName(tabName: string): any {
    return this.allPreviewData.find((preview) => preview.tabName === tabName);
  }

  /**
   * To replace all special characters with whitespace
   *
   * @param userValue The user's input value
   * @returns A string where all non-alphanumeric and non-hyphen characters are replaced with a whitespace.
   */
  replaceUnderscores(userValue: string): string {
    return userValue ? userValue.replace(/[^a-zA-Z0-9-]/g, ' ') : '';
  }

  /**
   * Preparing dataset filters dynamically
   *
   * @returns form group
   */
  prepareDatasetFilters(): FormGroup {
    return this.formBuilder.group({
      logic: 'and',
      filters: new FormArray([]),
    });
  }

  /**
   * Preparing dataset filters dynamically
   *
   * @param operator The comparison operator to be used in the filter
   * @param fieldValue The value of the field to be compared
   * @param userValue The value provided by the user to compare against the field value
   * @returns The result of the filter operation or undefined if no operator is provided
   */
  filterData(
    operator: string,
    fieldValue: string | any,
    userValue: string | Date | number
  ) {
    let result;
    if (!operator) return;
    switch (operator) {
      case 'eq':
        result = userValue && fieldValue === userValue;
        break;
      case 'neq':
        result = userValue && fieldValue !== userValue;
        break;
      case 'gte':
        result = userValue && fieldValue >= userValue;
        break;
      case 'gt':
        result = userValue && fieldValue > userValue;
        break;
      case 'lte':
        result = userValue && fieldValue <= userValue;
        break;
      case 'lt':
        result = userValue && fieldValue < userValue;
        break;
      case 'isnull':
        result = fieldValue === null;
        break;
      case 'isnotnull':
        result = fieldValue !== null;
        break;
      case 'isempty':
        result = fieldValue === '' || !fieldValue;
        break;
      case 'isnotempty':
        result = fieldValue !== '' && fieldValue !== undefined;
        break;
      case 'contains':
        result =
          fieldValue && userValue && fieldValue.includes(userValue as string);
        break;
      case 'doesnotcontain':
        result =
          fieldValue && userValue && !fieldValue.includes(userValue as string);
        break;
      case 'startswith':
        result =
          fieldValue && userValue && fieldValue.startsWith(userValue as string);
        break;
      case 'endswith':
        result =
          fieldValue && userValue && fieldValue.endsWith(userValue as string);
        break;
      case 'in':
        result = userValue && (userValue as string | number) in fieldValue;
        break;
      case 'notin':
        result = userValue && !((userValue as string | number) in fieldValue);
        break;
      default:
        return;
    }
    return result;
  }

  /**
   * To get data set
   *
   * @param filterQuery query details to fetch data set
   * @returns the dataset.
   */
  fetchDataSet(filterQuery: any) {
    return this.apollo.query<any>({
      query: GET_DATA_SET,
      variables: {
        query: filterQuery,
      },
    });
  }

  /**
   * Handles the user selection of a header logo file.
   *
   * @param file The selected file or null if no file is selected.
   */
  onHeaderLogoSelected(file: File | null): void {
    this.allLayoutdata.headerLogo = file;
  }

  /**
   * Handles the user selection of a banner image file.
   *
   * @param file The selected file or null if no file is selected.
   */
  onBannerSelected(file: File | null): void {
    this.allLayoutdata.bannerImage = file;
  }

  /**
   * Handles the user selection of a footer logo file.
   *
   * @param file The selected file or null if no file is selected.
   */
  onFooterLogoSelected(file: File | null): void {
    this.allLayoutdata.footerLogo = file;
  }

  /**
   * Retrieves email notifications.
   *
   * @param id The application ids of the email notifications.
   * @param limit The number of email notifications.
   * @param skip The number of email notifications to skip.
   * @returns Email notifications query result.
   */
  getEmailNotifications(id: string, limit?: number, skip?: number) {
    return this.apollo.query<any>({
      query: GET_EMAIL_NOTIFICATIONS,
      variables: {
        applicationId: id,
        limit: limit,
        skip: skip,
      },
    });
  }

  /**
   * Converts days, months, years to minutes.
   *
   * @param value number value
   * @param unit days, months, years
   * @returns days in days, months or years.
   */
  convertToMinutes(value: number, unit: string): number {
    const currentDate = new Date();
    let minutes;

    switch (unit) {
      case 'hours':
        minutes = value * 60;
        break;
      case 'days':
        minutes = value * 24 * 60;
        break;
      case 'weeks':
        minutes = value * 7 * 24 * 60;
        break;
      case 'months':
        const monthsAgo = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - value,
          currentDate.getDate()
        );
        minutes = Math.floor(
          (currentDate.getTime() - monthsAgo.getTime()) / (1000 * 60)
        );
        break;
      case 'years':
        const yearsAgo = new Date(
          currentDate.getFullYear() - value,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        minutes = Math.floor(
          (currentDate.getTime() - yearsAgo.getTime()) / (1000 * 60)
        );
        break;
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }

    return minutes;
  }

  /**
   * Adds an email notification with the provided data.
   *
   * @param data The notification data to be added.
   * @returns A query result after adding the email notification.
   */
  addEmailNotification(data: any) {
    return this.apollo.query<any>({
      query: ADD_EMAIL_NOTIFICATION,
      variables: {
        notification: data,
      },
    });
  }

  /**
   * Gets the first block and first row from the all preview dataset.
   *
   * @returns The first block and first row from the all preview dataset and null if there is no data.
   */
  getFirstBlockFirstRow(): any {
    const allPreviewData = this.getAllPreviewData();
    if (
      allPreviewData.length > 0 &&
      allPreviewData[0].dataList &&
      allPreviewData[0].dataList.length > 0
    ) {
      // Return the first row of the first block
      return allPreviewData[0].dataList[0];
    }
    return null;
  }

  /**
   * Get an email notification with the provided id.
   *
   * @param id The notification data id.
   * @param applicationId The application id of the email notification.
   * @returns Email notification.
   */
  getEmailNotification(id: string, applicationId: string) {
    return this.apollo.query<any>({
      query: GET_AND_UPDATE_EMAIL_NOTIFICATION,
      variables: {
        notification: null,
        editEmailNotificationId: id,
        applicationId: applicationId,
      },
    });
  }

  /**
   * Edit an email notification with the provided id.
   *
   * @param id The notification data id.
   * @param data The notification data to be edited.
   * @returns The edited Email notification.
   */
  editEmailNotification(id: string, data: any) {
    return this.apollo.query<any>({
      query: GET_AND_UPDATE_EMAIL_NOTIFICATION,
      variables: {
        notification: data,
        editEmailNotificationId: id,
      },
    });
  }

  /**
   * Delete an email notification with the provided id.
   *
   * @param id The notification data id.
   * @param applicationId The application id of the email notification.
   * @returns Email Notification that has been deleted.
   */
  deleteEmailNotification(id: string, applicationId: string) {
    return this.apollo.query<any>({
      query: GET_AND_UPDATE_EMAIL_NOTIFICATION,
      variables: {
        notification: {
          isDeleted: 1,
          applicationId: applicationId,
        },
        editEmailNotificationId: id,
      },
    });
  }

  /**
   * sending emails to endpoint
   *
   * @param configId id of the config.
   * @param emailData data to be send.
   * @param separateEmail trigger for sending individual emails
   * @returns rest post to end point.
   */
  sendEmail(
    configId: string | undefined,
    emailData: any,
    separateEmail: boolean
  ): Observable<any> {
    if (separateEmail) {
      const urlWithConfigId = `${this.restService.apiUrl}/notification/send-individual-email/${configId}`;
      return this.http.post<any>(urlWithConfigId, emailData);
    } else {
      const urlWithConfigId = `${this.restService.apiUrl}/notification/send-email/${configId}`;
      return this.http.post<any>(urlWithConfigId, emailData);
    }
  }

  /**
   * persisting the state of the boolean variable for sending separate emails
   *
   * @param index - dataset index
   * @returns Bound variable between service and dist list component
   */
  updateSeparateEmail(index: number): boolean {
    const datasetArray = this.datasetsForm?.get('dataSets') as FormArray;
    const isSeparate = datasetArray?.at(index)?.get('individualEmail')?.value;
    return isSeparate;
  }

  /**
   * persisting the state of the boolean variable for sending separate emails
   *
   * @param separateEmail - boolean value for checkbox
   * @param index - dataset index
   */
  setSeparateEmail(separateEmail: boolean, index: number): void {
    const datasetArray = this.datasetsForm?.get('dataSets') as FormArray;
    datasetArray?.at(index)?.get('individualEmail')?.setValue(separateEmail);
  }

  /**
   * method for checking whether any of the datasets have had the checkbox for induvidual emails ticked
   *
   * @returns boolean for triggering endpoints
   */
  sendSeparateEmail(): boolean {
    let separateEmail = false;
    const datasetArray = this.datasetsForm.get('dataSets') as FormArray;
    datasetArray.controls.forEach((datasetControl: any) => {
      if (datasetControl.get('individualEmail')?.value === true) {
        separateEmail = true;
      }
    });
    return separateEmail;
  }

  /**
   * Get the data set and flatten it.
   *
   * @param emailData data to be sent.
   * @param isSendEmail checks if sending email or not.
   */
  getDataSet(emailData: any, isSendEmail?: boolean) {
    let count = 0;
    let allPreviewData: any = [];
    for (const query of emailData.dataSets) {
      query.fields.forEach((x: any) => {
        if (x.parentName) {
          const child = x.name;
          x.childName = child.split(' - ')[1];
          x.name = x.parentName;
          x.childType = x.type;
          x.type = 'resource';
        }
      });
      query.tabIndex = count;
      count++;
      query.pageSize = Number(query.pageSize);
      this.fetchDataSet(query).subscribe((res: { data: { dataSet: any } }) => {
        if (res?.data?.dataSet) {
          const dataSetResponse = res?.data?.dataSet.records;
          this.dataList = dataSetResponse?.map((record: any) => {
            const flattenedObject = this.flattenRecord(record, query);

            query.fields.forEach((x: any) => {
              if (x.parentName) {
                x.name = `${x.parentName} - ${x.childName}`;
                x.type = x.childType;
              }
            });

            delete flattenedObject.data;

            const flatData = Object.fromEntries(
              Object.entries(flattenedObject).filter(
                ([, value]) => value !== null && value !== undefined
              )
            );

            return flatData;
          });
          if (this.dataList?.length) {
            const existfields = emailData.dataSets[
              res?.data?.dataSet?.tabIndex
            ].fields.map((x: any) => x.name);
            const temp = Object.keys(this.dataList[0]);
            const notmatching = temp.filter(
              (currentId) => !existfields.some((item: any) => item == currentId)
            );
            existfields.concat(notmatching);
            this.dataSetFields = existfields;
          }
          allPreviewData.push({
            dataList: this.dataList,
            dataSetFields: this.dataSetFields,
            tabIndex: res?.data?.dataSet?.tabIndex,
            tabName:
              res?.data?.dataSet?.tabIndex < this.tabs.length
                ? this.tabs[res.data.dataSet.tabIndex].title
                : '',
          });
          if (this.tabs.length == allPreviewData.length) {
            allPreviewData = allPreviewData.sort(
              (a: any, b: any) => a.tabIndex - b.tabIndex
            );
            // this.loading = false;
            this.navigateToPreview.emit(allPreviewData);
            this.setAllPreviewData(allPreviewData);
            if (isSendEmail) {
              this.stepperStep = 5;
              this.isPreview = true;
              this.isLinear = false;
            }
            this.emailListLoading = false;
          }
        } else {
          this.emailListLoading = false;
        }
      });
    }
    if (emailData?.dataSets?.length == 0) {
      this.emailListLoading = false;
    }
  }

  /**
   * Flattens the given record object into a single level object.
   *
   * @param record The record to be flattened.
   * @param query Form Query Object for field values.
   * @returns The flattened record.
   */
  flattenRecord(record: any, query?: any): any {
    const result: any = {};
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        const value = record[key];
        if (typeof value === 'object' && value !== null) {
          if (value.data) {
            query.fields.forEach((x: any) => {
              if (x.childName) {
                // Check if the childName exists in the records object
                let matchingKey = Object.keys(record[key].data).find(
                  (child) => child === x.childName
                );
                if (
                  x.childName.split('.')[0] === '_createdBy' ||
                  x.childName.split('.')[0] === '_createdBy'
                ) {
                  const namedChild = `${x.childName}`;
                  matchingKey = Object.keys(
                    record[key][namedChild.split('.')[0]][
                      namedChild.split('.')[1]
                    ]
                  ).find((child) => child === namedChild.split('.')[2]);
                }

                if (
                  matchingKey &&
                  !(
                    x.childName.split('.')[0] === '_createdBy' ||
                    x.childName.split('.')[0] === '_lastUpdatedBy'
                  )
                ) {
                  // If a match is found, map the child field to the corresponding value in records
                  result[`${x.parentName} - ${x.childName}`] =
                    value.data[matchingKey];
                } else {
                  matchingKey =
                    matchingKey ??
                    Object.keys(record[key]).find(
                      (child) => child === x.childName
                    ) ??
                    Object.keys(record[key]).find(
                      (child) => child === `_${x.childName}`
                    );
                  if (
                    matchingKey &&
                    !(
                      x.childName.split('.')[0] === '_createdBy' ||
                      x.childName.split('.')[0] === '_lastUpdatedBy'
                    )
                  ) {
                    // If a match is found, searches for meta data and sets if found
                    result[`${x.parentName} - ${x.childName}`] =
                      record[key][matchingKey];
                  } else if (matchingKey) {
                    const namedChild = `${x.childName}`;
                    result[`${x.parentName} - ${x.childName}`] =
                      record[key][namedChild.split('.')[0]][
                        namedChild.split('.')[1]
                      ][namedChild.split('.')[2]];
                  }
                }
              }
            });
          } else if (value.geometry) {
            result[
              key
            ] = `${record[key].properties.countryName} (${record[key].properties.coordinates.lat}, ${record[key].properties.coordinates.lng})`;
          } else {
            const fieldType = query.fields.find((field: any) => {
              return field.name === key;
            }).type;

            if (fieldType !== TYPE_LABEL.resources) {
              result[key] = record[key];
            } else {
              // Takes the resources count and maps it to the resource name.
              result[key] =
                record[key].length > 1
                  ? `${record[key].length} items`
                  : `${record[key].length} item`;
            }
          }
        } else {
          if (
            key.split('_')[1] == 'createdBy' ||
            key.split('_')[1] == 'lastUpdatedBy'
          ) {
            if (key.split('_')[3] === 'id') {
              // Takes the created by and last updated by values and persists them.
              result[
                `_${key.split('_')[1]}.${key.split('_')[2]}._${
                  key.split('_')[3]
                }`
              ] = value;
            } else {
              // Takes the created by and last updated by values and persists them.
              result[
                `_${key.split('_')[1]}.${key.split('_')[2]}.${
                  key.split('_')[3]
                }`
              ] = value;
            }
          } else {
            result[key] = value;
          }
        }
      }
    }

    return result;
  }

  /**
   * Formats date strings into a pretty string representation
   *
   * @param rowData table cell data value
   * @returns formatted date string or the original value if not a date string
   */
  formatDateStrings(rowData: any): string {
    // Check if rowData is a string that can be parsed into a date
    if (typeof rowData === 'string' && !isNaN(Date.parse(rowData))) {
      // Parse the string into a Date object
      const date = new Date(rowData);
      // Format the date as MM/DD/YY, hh:mm AM/PM
      return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
        timeZoneName: 'short',
      });
    }
    // If rowData is not a date string, return it as is
    if (!rowData) {
      return '';
    }
    return rowData as string;
  }

  /**
   * Converts String to Title Case
   *
   * @param str Input string to be converted
   * @returns Titlecase string
   */
  titleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Resets the form.
   */
  resetDataSetForm() {
    this.datasetsForm.reset();
    this.allLayoutdata = {};
    this.allPreviewData = [];
    this.emailLayout = {};
    this.recipients = {
      distributionListName: '',
      To: [],
      Cc: [],
      Bcc: [],
    };
    this.tabs = [
      {
        title: `Block 1`,
        content: `Block 1 Content`,
        active: true,
        index: 0,
      },
    ];
  }
}
