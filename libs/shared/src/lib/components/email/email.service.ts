import { EventEmitter, Injectable, Output } from '@angular/core';
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

/**
 * Helper functions for emails template
 */
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  public datasetsForm!: FormGroup;
  public resourcesNameId!: {
    name: string | undefined;
    id: string | undefined;
  }[];
  public selectedDataSet: any;
  public toEmailFilter!: FormGroup | any;
  public ccEmailFilter!: FormGroup | any;
  public bccEmailFilter!: FormGroup | any;
  public allPreviewData: any[] = [];
  public notificationTypes: string[] = ['email', 'alert', 'push notification'];
  public emailLayout!: any;
  /** EMAIL STYLES DATA */
  public headerBackgroundColor = '#00205C';
  public headerTextColor = '#FFFFFF';
  public bodyBackgroundColor = '#FFFFFF';
  public bodyTextColor = '#000000';
  public footerBackgroundColor = '#FFFFFF';
  public footerTextColor = '#000000';
  public datasetSave: EventEmitter<boolean> = new EventEmitter();
  public disableSaveAndProceed = new BehaviorSubject<boolean>(false);
  public stepperDisable = new BehaviorSubject<any>('');
  public showExistingDistributionList = false;
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
  public tabs: any[] = [
    {
      title: `Block 1`,
      content: `Block 1 Content`,
      active: true,
      index: 0,
    },
  ];

  /** EMAIL LAYOUT DATA */
  public allLayoutdata: any = {
    /** IMAGES AND STYLES */
    bannerImage: null,
    bannerImageStyle: '',
    /** CONTAINER STYLE */
    containerStyle: '',
    /** FOOTER COPYRIGHT STYLE */
    copyrightStyle: '',
    /** EMAIL SUBJECT */
    txtSubject: '',
    /** EMAIL HEADER */
    headerHtml: '',
    headerLogo: null,
    headerLogoStyle: '',
    headerBackgroundColor: this.headerBackgroundColor,
    headerTextColor: this.headerTextColor,
    headerStyle: '',
    /** EMAIL BODY */
    bodyHtml: '',
    bodyBackgroundColor: this.bodyBackgroundColor,
    bodyTextColor: this.bodyTextColor,
    bodyStyle: '',
    /** EMAIL FOOTER */
    footerHtml: '',
    footerLogo: null,
    footerBackgroundColor: this.footerBackgroundColor,
    footerTextColor: this.footerTextColor,
    footerStyle: '',
    footerImgStyle: '',
    footerHtmlStyle: '',
  };

  /** DEFAULT BLOCK DATASET TABLE STYLE */
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
  isExisting = true;

  public configId: string | undefined;
  public dataList!: { [key: string]: any }[];
  public dataSetFields!: string[];
  public distributionListNames: string[] = [];
  public emailNotificationNames: string[] = [];
  public editId = '';
  @Output() navigateToPreview: EventEmitter<any> = new EventEmitter();
  stepperStep = 0;
  public isEdit = false;
  public isPreview = false;
  public isLinear = true;
  //private apiUrl = 'http://localhost:3000/notification/send-email/';

  //private apiUrl = 'https://emspocdev.adapptlabs.com/api/notification/send-email/';

  /**
   * To replace all special characters with space
   *
   * @returns form group
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
    });
  }

  /**
   * Constructs the EmailService instance.
   *
   * @param formBuilder The FormBuilder instance used to create form groups and controls
   * @param apollo The Apollo server instance used for GraphQL queries
   * @param http The HttpClient instance used for making HTTP requests
   * @param restService mapping of the url
   */
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private http: HttpClient,
    private restService: RestService
  ) {
    this.setDatasetForm();
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
      headerStyle: `margin: 0 auto; display: flex; width: 100%; background-color: ${this.headerBackgroundColor};`,
      headerHtmlStyle: `text-align: center; margin: 0.5rem auto; padding: 0.5rem; width: 80%; background-color: white; overflow: hidden; background-color: ${this.headerBackgroundColor}; color: ${this.headerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`,
      headerLogoStyle: `margin: 0.5rem; display: block; width: 20%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.headerBackgroundColor};`,
      bodyStyle: `text-align: center; margin: 0.5rem auto; padding: 0.5rem; width: 90%;overflow-x: auto; background-color: ${this.bodyBackgroundColor}; color: ${this.bodyTextColor};`,
      footerStyle: `margin: 0.25rem 0; display: flex; width: 90%; background-color: ${this.footerBackgroundColor};`,
      footerImgStyle: `margin: 0.5rem; display: block; width: 20%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.footerBackgroundColor};`,
      footerHtmlStyle: `width: 80%; background-color: white; overflow: hidden; background-color: ${this.footerBackgroundColor}; color: ${this.footerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`,
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
   *
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
    for (let i = 0; i < previewData.length; i++) {
      console.log(previewData[i].tabName);
    }
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
   *
   * @param file
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
   *
   * @param base64String
   * @param filename
   * @param mimeType
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
  patchEmailLayout(): void {
    this.setEmailStyles();
    const headerImg =
      this.allLayoutdata?.headerLogo instanceof File
        ? this.convertFileToBase64(this.allLayoutdata?.headerLogo)
            .then((base64String) => {
              console.log('Base64 string:', base64String);
              return base64String;
            })
            .catch((error) => {
              console.error('Error converting file to base64:', error);
            })
        : null;

    const footerImg =
      this.allLayoutdata?.footerLogo instanceof File
        ? this.convertFileToBase64(this.allLayoutdata?.footerLogo)
            .then((base64String) => {
              console.log('Base64 string:', base64String);
              return base64String;
            })
            .catch((error) => {
              console.error('Error converting file to base64:', error);
            })
        : null;

    const bannerLogo =
      this.allLayoutdata?.bannerImage instanceof File
        ? this.convertFileToBase64(this.allLayoutdata?.bannerImage)
            .then((base64String) => {
              console.log('Base64 string:', base64String);
              return base64String;
            })
            .catch((error) => {
              console.error('Error converting file to base64:', error);
            })
        : null;

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

    console.log(tableStyles);

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
   * @param limit
   * @param skip
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
   * @param data
   * @returns Email notification.
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
   * @returns rest post to end point.
   */
  sendEmail(configId: string | undefined, emailData: any): Observable<any> {
    console.log(this.restService.apiUrl);
    const urlWithConfigId = `${this.restService.apiUrl}/notification/send-email/${configId}`;
    return this.http.post<any>(urlWithConfigId, emailData);
  }

  /**
   *
   * @param emailData
   */
  getDataSet(emailData: any) {
    let count = 0;
    let allPreviewData: any = [];
    for (const query of emailData.dataSets) {
      query.tabIndex = count;
      count++;
      query.pageSize = Number(query.pageSize);
      this.fetchDataSet(query).subscribe((res: { data: { dataSet: any } }) => {
        if (res?.data?.dataSet) {
          console.log(res);
          // this.dataSetResponse = res?.data?.dataSet;
          this.dataList = res?.data?.dataSet.records?.map((record: any) => {
            const flattenedObject = this.flattenRecord(record);

            delete flattenedObject.data;

            const flatData = Object.fromEntries(
              Object.entries(flattenedObject).filter(
                ([, value]) => value !== null && value !== undefined
              )
            );

            return flatData;
          });
          if (this.dataList?.length) {
            this.dataSetFields = [
              ...new Set(
                this.dataList
                  .map((data: { [key: string]: any }) => Object.keys(data))
                  .flat()
              ),
            ];
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
            this.stepperStep = 5;
          }
        }
      });
    }
  }

  /**
   *
   * @param record
   */
  flattenRecord(record: any): any {
    const result: any = {};

    for (const key in record) {
      // eslint-disable-next-line no-prototype-builtins
      if (record.hasOwnProperty(key)) {
        const value = record[key];

        if (typeof value === 'object' && value !== null) {
          const flattenedValue = this.flattenRecord(value);

          for (const subKey in flattenedValue) {
            // eslint-disable-next-line no-prototype-builtins
            if (flattenedValue.hasOwnProperty(subKey)) {
              result[`${key}-${subKey}`] = flattenedValue[subKey];
            }
          }
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  /**
   *
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
