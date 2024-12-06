import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, NgZone, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import {
  EMAIL_NOTIFICATION_TYPES,
  EmailDistributionListQueryResponse,
  EmailNotificationQueryResponse,
  EmailNotificationsQueryResponse,
  EmailNotificationTypes,
  EmailTemplatesQueryResponse,
} from '../../models/email-notifications.model';
import { RestService } from '../../services/rest/rest.service';
import {
  ADD_CUSTOM_TEMPLATE,
  ADD_DISTRIBUTION_LIST,
  ADD_EMAIL_NOTIFICATION,
  DELETE_EMAIL_NOTIFICATION,
  EDIT_CUSTOM_TEMPLATE,
  EDIT_DISTRIBUTION_LIST,
  GET_AND_UPDATE_EMAIL_NOTIFICATION,
  GET_CUSTOM_TEMPLATES,
  GET_DISTRIBUTION_LIST,
  GET_EMAIL_NOTIFICATION_BY_ID,
  GET_EMAIL_NOTIFICATIONS,
  GET_RESOURCE_BY_ID,
} from './graphql/queries';
import { FieldStore } from './models/email.const';
import { ResourceQueryResponse } from '../../models/resource.model';
import { prettifyLabel } from '../../utils/prettify';
import { addNewField } from '../query-builder/query-builder-forms';
import get from 'lodash/get';

/**
 * Interface for InValidDataSets
 */
interface InValidDataSets {
  name: string;
  count: number;
}

/**
 * Helper functions service for emails template.
 */
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  /** Stepper for draft */
  public draftStepper!: number;
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
  /** Email preview data */
  public allPreviewData: any[] = [];
  /** Email type ( only email supported now ) */
  public notificationTypes: EmailNotificationTypes[] = EMAIL_NOTIFICATION_TYPES;
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
  /** Loading state */
  public loading = false;
  /** Disable SaveAsDraft button */
  public disableSaveAsDraft = new BehaviorSubject<boolean>(false);
  /** DISABLE SAVE AND PROCEED BUTTON EMITTER */
  public disableSaveAndProceed = new BehaviorSubject<boolean>(false);
  /** Control stepper disable status */
  public stepperDisable = new BehaviorSubject<any>('');
  /** Should show existing distribution list */
  public showExistingDistributionList = false;
  /** Distribution list data */
  public emailDistributionList: any = [];
  /** Quick send email  DL query list data */
  public quickEmailDLQuery: any = [];
  /** Initial tab value */
  public initialTabValue = {
    title: `Block 1`,
    content: `Block 1 Content`,
    active: true,
    index: 0,
    blockHeaderCount: 1,
  };
  /** List of tabs */
  public tabs: any[] = [
    {
      title: `Block 1`,
      content: `Block 1 Content`,
      active: true,
      index: 0,
      blockHeaderCount: 1,
    },
  ];
  /** Used to disable stepper steps */
  public disableFormSteps = new BehaviorSubject({
    stepperIndex: 0,
    disableAction: false,
  });
  /** Email preview data */
  public previewData!: {
    fields: string[];
    datasets: string[];
  };
  /** Should stepper enable all steps */
  public enableAllSteps = new BehaviorSubject<boolean>(false);
  /** Email layout data */
  public allLayoutdata!: any;
  /** Default block dataset table style*/
  public defaultTableStyle!: any;
  /** Is distribution list existing */
  isExisting = true;
  /** Email notification id */
  public configId: string | undefined;
  /** Datalist */
  public dataList!: { [key: string]: any }[];
  /** Dataset fields */
  public datasetFields!: string[];
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
  /** Is in direct send mode */
  public isDirectSend = false;
  /** Is email stepper linear */
  public isLinear = true;
  /** Email loading checker */
  public emailListLoading = true;
  /** Separate email lists */
  public separateEmail = [];
  /** Selected Fields */
  public fields: FieldStore[] = [];
  /** Selected cacheDistributionList */
  public cacheDistributionList: any = [];
  /** Final Email Preview */
  public finalEmailPreview: any = '';
  /** Checking the edit operation on custom template */
  public isCustomTemplateEdit = false;
  /** custom template ID */
  public customTemplateId = '';
  /** Quick action flag */
  public isQuickAction = false;
  /** Custom Layout tile */
  public layoutTitle = '';
  /** Custom Template list names*/
  public customTemplateNames: string[] = [];
  /** Disable Quick Action screen Next Button error state*/
  public disableNextActionBtn = false;
  /** Distribution List Name */
  public distributionListName = '';
  /** Checks if to in email distribution list is valid */
  public isToValid = false;
  /** Checks if to in email distribution list is valid */
  public toDLHasFilter = false;
  /** Checks if to in email distribution list has a filter */
  public displayDLToError = false;
  /** Checks if Distribution list name is duplicate */
  public isDLNameDuplicate = false;
  /** For storing emails For To from service response (In select with Filter option) */
  filterToEmails: any = [];
  /**
   * Name of selected DL name in DL screen used for use existing;
   * 1) Assign value on select of existing; 2) Clear the value on click of Create New
   */
  public selectedDLName: any = '';
  /** Checks if separate emails is checked for all blocks */
  public isAllSeparateEmail = false;
  /** For storing emails For CC from service response (In select with Filter option) */
  public filterCCEmails: any = [];
  /** For storing emails For BCC from service response (In select with Filter option) */
  public filterBCCEmails: any = [];

  /**
   * Generates new dataset group.
   *
   * @returns new Dataset form group.
   */
  createNewDataSetGroup(): FormGroup {
    return this.formBuilder.group({
      name: null,
      query: this.createQuerygroup(),
      resource: null,
      pageSize: 10,
      tableStyle: this.defaultTableStyle,
      blockType: 'table', // Either Table or Text
      textStyle: this.formBuilder.group({
        fields: new FormArray([]),
        blockStyle: '',
      }), // Fields (field selected and style), Block Style (HTML wrapping field with token)
      sendAsAttachment: false,
      individualEmail: false,
      individualEmailFields: this.formBuilder.array([]),
      dataType: null,
      reference: null,
      navigateToPage: false,
      navigateSettings: this.formBuilder.group({
        title: get('', 'actions.navigateSettings.title', 'Details view'),
        pageUrl: [''],
        field: [''],
      }),
    });
  }

  /**
   * Checks if to in email distribution list is valid
   *
   * @returns true if to in email distribution list is valid
   */
  async checkToValid() {
    if (
      this.toDLHasFilter &&
      (this.emailDistributionList?.to?.query?.resource ||
        this.datasetsForm?.getRawValue()?.emailDistributionList?.to?.resource)
    ) {
      const query = {
        emailDistributionList: cloneDeep(this.emailDistributionList),
      };
      await this.http
        .post(
          `${this.restService.apiUrl}/notification/preview-distribution-lists/`,
          query
        )
        .subscribe((response: any) => {
          return response?.to.length > 0;
        });
    } else {
      return (
        this.datasetsForm.getRawValue().emailDistributionList?.to?.inputEmails
          ?.length > 0
      );
    }
    return false;
  }

  /**
   * Subscribes user to email notification
   *
   * @param id The email notification id
   * @returns Promise
   */
  subscribeToEmail(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.http
        .post(
          `${this.restService.apiUrl}/notification/add-subscription/`,
          {
            configId: id,
          },
          { responseType: 'text' }
        )
        .subscribe({
          next: (response: any) => {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'components.email.alert.subscribeSuccess',
                {
                  message: response,
                }
              )
            );

            resolve();
          },
          error: (errMsg: any) => {
            this.snackBar.openSnackBar(
              this.translate.instant('components.email.alert.subscribeFailed', {
                errorMessage: errMsg,
              }),
              { error: true }
            );
            resolve();
          },
        });
    });
  }

  /**
   * Removes user subscription from email notification
   *
   * @param id The email notification id
   * @returns Promise
   */
  unsubscribeFromEmail(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.http
        .post(
          `${this.restService.apiUrl}/notification/remove-subscription/`,
          {
            configId: id,
          },
          { responseType: 'text' }
        )
        .subscribe({
          next: (response: any) => {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'components.email.alert.unsubscribeSuccess',
                {
                  message: response,
                }
              )
            );

            resolve();
          },
          error: (errMsg: any) => {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'components.email.alert.unsubscribeFailed',
                {
                  errorMessage: errMsg,
                }
              ),
              { error: true }
            );
            resolve();
          },
        });
    });
  }

  /**
   * Checks if to in email distribution list is valid
   *
   * @returns true if to in email distribution list is valid
   */
  checkDLToValid(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isAllSeparateEmail) {
        resolve(true);
      } else {
        if (
          this.toDLHasFilter &&
          (this.datasetsForm.getRawValue().emailDistributionList?.to
            ?.resource ||
            this.datasetsForm.getRawValue().emailDistributionList?.to
              ?.reference)
        ) {
          const query = {
            emailDistributionList: cloneDeep(
              this.datasetsForm.getRawValue()?.emailDistributionList
            ),
          };

          firstValueFrom(
            this.http.post(
              `${this.restService.apiUrl}/notification/preview-distribution-lists/`,
              query
            )
          )
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        } else {
          resolve(
            this.datasetsForm.getRawValue().emailDistributionList?.to
              ?.inputEmails?.length > 0
          );
        }
      }
    });
  }

  /**
   * Checks if all datasets are valid
   *
   * @returns if dataset is valid or not
   */
  checkDatasetsValid(): Promise<{ valid: boolean; badData: string[] }> {
    return new Promise((resolve, reject) => {
      const emailDatasets = cloneDeep(
        this.datasetsForm.get('datasets')?.getRawValue()
      ).filter((data: any) => data.resource);

      if (emailDatasets.length) {
        const inValidBlocks: string[] = [];

        // Check for missing fields using forEach
        emailDatasets.forEach((dataset: any) => {
          const fields = dataset.query.fields;
          if (!fields || fields.length === 0) {
            // If fields are missing, add the dataset name to the inValidBlocks array
            inValidBlocks.push(dataset.name);
          }
        });

        // Check if there are any missing fields
        if (inValidBlocks.length === 0) {
          this.http
            .post(
              `${this.restService.apiUrl}/notification/validate-dataset`,
              emailDatasets
            )
            .subscribe({
              next: (data: any) => {
                resolve({
                  valid: !data?.inValidDataSets?.length,
                  badData: data?.inValidDataSets?.map(
                    ({ name }: InValidDataSets) => name // only name to show error
                  ),
                });
              },
              error: (error) => {
                reject(error);
              },
            });
        } else {
          // If there are missing fields, resolve with invalid status and the messages
          resolve({
            valid: false,
            badData: inValidBlocks, // Provide specific messages about which fields are missing
          });
        }
      } else {
        resolve({ valid: true, badData: [] });
      }
    });
  }

  /**
   * Generates new query form group.
   *
   * @returns new query form group.
   */
  createQuerygroup(): FormGroup {
    return this.formBuilder.group({
      name: null,
      filter: this.formBuilder.group({
        logic: 'and',
        filters: new FormArray([]),
      }),
      fields: this.formBuilder.array([]),
    });
  }

  /**
   * Constructs the EmailService instance.
   *
   * @param formBuilder The FormBuilder instance used to create form groups and controls
   * @param apollo The Apollo server instance used for GraphQL queries
   * @param http The HttpClient instance used for making HTTP requests
   * @param restService mapping of the url
   * @param ngZone The NgZone instance
   * @param translate The TranslateService
   * @param snackBar The SnackBarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private http: HttpClient,
    private restService: RestService,
    private ngZone: NgZone,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {
    this.setDatasetForm();
    this.initLayoutData();
  }

  /**
   * Initialises email layout data and table data
   */
  initLayoutData() {
    // Initialise all layout data
    this.allLayoutdata = {
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

    //Initialise table data
    this.defaultTableStyle = {
      tableDivStyle: '',
      labelStyle: '',
      tableStyle: '',
      theadStyle: '',
      tbodyStyle: '',
      thStyle: '',
      trStyle: '',
      tdStyle: '',
    };
  }

  /**
   * Sets the email service fields
   *
   * @param selectedFields The selected fields
   */
  setEmailFields(selectedFields: FieldStore[]) {
    this.fields = selectedFields;
  }

  /**
   * Intialises Distribution List form group
   *
   * @returns Distribution List form group
   */
  initialiseDistributionList(): FormGroup {
    return this.formBuilder.group({
      name: null,
      to: this.createDLGroup(),
      cc: this.createDLGroup(),
      bcc: this.createDLGroup(),
      id: null,
    });
  }

  /**
   * Generates new distribution list form for to, cc and bcc
   *
   * @returns new Distribution List input form group
   */
  createDLGroup(): FormGroup {
    return this.formBuilder.group({
      resource: null,
      query: this.createQuerygroup(),
      inputEmails: this.formBuilder.array([]),
      reference: null,
    });
  }

  /**
   * Grabs filter row values.
   *
   *  @returns FormGroup
   */
  get getNewFilterFields(): FormGroup {
    return this.formBuilder.group({
      field: [],
      operator: ['eq'],
      value: [],
      hideEditor: false,
      inTheLast: this.formBuilder.group({
        number: [1],
        unit: ['days'],
      }),
    });
  }

  /**
   * Creates and populates Distribution List form correctly
   *
   * @param emailDL The email distribution list
   * @returns Distribution List form
   */
  populateDistributionListForm(emailDL: any): FormGroup {
    const distributionListForm = this.initialiseDistributionList();
    if (emailDL)
      this.setDistributionListFormValues(distributionListForm, emailDL);
    return distributionListForm;
  }

  /**
   * Sets Distribution List form values
   *
   * @param form The Distribution List form
   * @param emailDL The email distribution list data in object format
   */
  setDistributionListFormValues(form: FormGroup, emailDL: any) {
    form.patchValue({
      name: emailDL?.name || '',
    });
    form.patchValue({
      id: emailDL?.id || null,
    });

    this.setDistributionListGroupValues(
      form.get('to') as FormGroup,
      emailDL.to
    );
    this.setDistributionListGroupValues(
      form.get('cc') as FormGroup,
      emailDL.cc
    );
    this.setDistributionListGroupValues(
      form.get('bcc') as FormGroup,
      emailDL.bcc
    );
  }

  /**
   * Sets Distribution List group values
   *
   * @param formGroup The Distribution List inner form (to, cc, bcc)
   * @param emailDL The email distribution list data in object format
   */
  setDistributionListGroupValues(formGroup: FormGroup, emailDL: any) {
    const inputArray =
      emailDL?.inputEmails?.map((email: string) =>
        this.formBuilder.control(email)
      ) || [];
    const dlGroup = formGroup as FormGroup;
    dlGroup.setControl('resource', this.formBuilder.control(emailDL.resource));
    dlGroup.setControl(
      'reference',
      this.formBuilder.control(emailDL.reference)
    );
    // Map filters
    dlGroup.setControl(
      'query',
      this.formBuilder.group({
        name: new FormControl(emailDL.query.name || null), // Query name
        filter: this.formBuilder.group({
          logic: new FormControl(emailDL?.query?.filter?.logic || null), // Filter logic
          filters: this.formBuilder.array(
            emailDL?.query?.filter?.filters.map((filter: any) => {
              return this.formBuilder.group({
                ...filter,
                inTheLast: this.formBuilder.group({
                  number: new FormControl(filter.inTheLast?.number || null),
                  unit: new FormControl(filter.inTheLast?.unit || null),
                }),
              });
            }) || []
          ),
        }),
        fields: this.formBuilder.array(
          emailDL?.query?.fields.map(
            (field: any) => this.createFieldsFormGroup(field) // Using the utility function
          )
        ),
      })
    );

    dlGroup.setControl('inputEmails', this.formBuilder.array(inputArray));

    dlGroup.disable();
  }

  /**
   * Common function
   *
   * @param field nested field
   * @returns FormGroup with nested fields
   */
  createFieldsFormGroup(field: any): FormGroup {
    return addNewField(field);
  }

  /**
   * Initializes the `datasetsForm` with a default structure and validators.
   */
  setDatasetForm() {
    this.datasetsForm = this.formBuilder.group({
      name: ['', Validators.required],
      notificationType: [null, Validators.required],
      applicationId: [''],
      datasets: new FormArray([this.createNewDataSetGroup()]),
      emailDistributionList: this.initialiseDistributionList(),
      subscriptionList: this.formBuilder.array([]),
      restrictSubscription: false,
      emailLayout: this.emailLayout,
      schedule: [''],
    });
  }

  /**
   * Sets the email distribution list.
   *
   * @param dlList The email distribution list
   */
  setDistributionList(dlList?: FormGroup) {
    if (dlList?.getRawValue()) {
      this.emailDistributionList = dlList?.getRawValue();
      const emailDL = this.datasetsForm?.get(
        'emailDistributionList'
      ) as FormGroup;

      // Assuming dlList.get('to').value is an array of strings (emails)
      const toEmails = dlList?.get('to')?.value;
      const ccEmails = dlList?.get('cc')?.value;
      const bccEmails = dlList?.get('bcc')?.value;

      // Function to set input emails for to, cc, and bcc
      const setInputEmails = (emailArray: string[], formArray: FormArray) => {
        formArray?.clear(); // Clear existing values
        emailArray?.forEach((email) => {
          formArray.push(this.formBuilder.control(email)); // Add each email as a new FormControl
        });
      };

      // Set input emails for 'to', 'cc', and 'bcc'
      setInputEmails(
        toEmails?.inputEmails,
        emailDL?.get('to')?.get('inputEmails') as FormArray
      );
      setInputEmails(
        ccEmails?.inputEmails,
        emailDL?.get('cc')?.get('inputEmails') as FormArray
      );
      setInputEmails(
        bccEmails?.inputEmails,
        emailDL?.get('bcc')?.get('inputEmails') as FormArray
      );

      // Existing patchValue calls
      emailDL?.get('to')?.patchValue(dlList?.get('to')?.value);
      emailDL?.get('cc')?.patchValue(dlList?.get('cc')?.value);
      emailDL?.get('bcc')?.patchValue(dlList?.get('bcc')?.value);
    } else {
      this.emailDistributionList = this.datasetsForm
        .get('emailDistributionList')
        ?.getRawValue();
    }
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
   * @param dataset The data set to be selected.
   */
  setSelectedDataSet(dataset: any): void {
    this.selectedDataSet = dataset;
  }

  /**
   * Sets the tabs.
   *
   * @param tabs The tabs on DL page.
   */
  setTabs(tabs: any[]): void {
    this.tabs = tabs;
  }

  /**
   * Return tabs.
   *
   * @returns selected tabs
   */
  getTabs(): any[] {
    return this.tabs;
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
   * Creates a preview data object.
   */
  createPreviewData() {
    if (this.datasetsForm?.get('datasets')?.value?.length > 0) {
      const datasetsValues = this.datasetsForm?.get('datasets')?.getRawValue();
      const datasets: string[] = [];
      datasetsValues.forEach((dataset: any) => {
        if (dataset.query.name && dataset.resource) {
          datasets.push(dataset.name);
        } else {
          dataset.query.name && dataset.reference
            ? datasets.push(dataset.name)
            : '';
        }
      });
      const fields: string[] = [];
      datasetsValues[0].query.fields.forEach((field: any) => {
        this.appendFields(field, field.name, fields);
      });
      this.previewData = {
        datasets: datasets,
        fields: fields,
      };
    }
  }

  /**
   * Resets preview data object.
   */
  resetPreviewData() {
    this.previewData = {
      datasets: [],
      fields: [],
    };
  }

  /**
   * Creates Subject field values
   *
   * @param field Field to be appended
   * @param parentName Name of the parent
   * @param fields fields if it exists in the field
   */
  appendFields(field: any, parentName: string, fields: string[]): void {
    if (field.fields && field.fields.length > 0) {
      field.fields.forEach((child: any) => {
        const childName = `${parentName}.${child.name}`;
        this.appendFields(child, childName, fields);
      });
    } else {
      fields.push(parentName);
    }
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
            : this.allLayoutdata?.headerLogo;

        const footerPromise =
          this.allLayoutdata?.footerLogo instanceof File
            ? this.convertFileToBase64(this.allLayoutdata?.footerLogo)
            : this.allLayoutdata?.footerLogo;

        const bannerPromise =
          this.allLayoutdata?.bannerImage instanceof File
            ? this.convertFileToBase64(this.allLayoutdata?.bannerImage)
            : this.allLayoutdata?.bannerImage;

        Promise.all([headerPromise, footerPromise, bannerPromise])
          .then(([headerImg, footerImg, bannerLogo]) => {
            this.emailLayout = {
              subject: this.allLayoutdata?.txtSubject,
              name: this.emailLayout?.name,
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
              id: this.allLayoutdata?.id,
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

    this.datasetsForm.get('datasets')?.get('tableStyle')?.setValue(tableStyles);
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
    return userValue ? userValue?.replace(/[^a-zA-Z0-9-]/g, ' ') : '';
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
    return this.apollo.query<EmailNotificationsQueryResponse>({
      query: GET_EMAIL_NOTIFICATIONS,
      variables: {
        applicationId: id,
        limit: limit,
        skip: skip,
      },
    });
  }

  /**
   * Adds an email notification with the provided data.
   *
   * @param data The notification data to be added.
   * @returns A query result after adding the email notification.
   */
  addEmailNotification(data: any) {
    return this.apollo.mutate<any>({
      mutation: ADD_EMAIL_NOTIFICATION,
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
   * Get email notification by id
   *
   * @param id Email notification id
   * @returns Email notification query
   */
  public getEmailNotification(id: string) {
    return this.apollo.query<EmailNotificationQueryResponse>({
      query: GET_EMAIL_NOTIFICATION_BY_ID,
      variables: {
        id,
      },
    });
  }

  /**
   * Get an email notification with the provided id.
   *
   * @param id The notification data id.
   * @param applicationId The application id of the email notification.
   * @returns Email notification.
   */
  getEmailNotificationForEdition(id: string, applicationId: string) {
    return this.apollo.mutate<any>({
      mutation: GET_AND_UPDATE_EMAIL_NOTIFICATION,
      variables: {
        notification: null,
        editEmailNotificationId: id,
        applicationId: applicationId,
      },
    });
  }

  /**
   * Merges multiple objects into a single object.
   * If values are not arrays, they are converted to arrays.
   * Duplicate values are removed in the final merged object.
   *
   * @param {Array<Record<string, any>>} objects - Array of objects to merge.
   * @returns {Record<string, any[]>} - The merged object with array values and no duplicates.
   */
  mergeObjects(objects: Array<Record<string, any>>): Record<string, any[]> {
    const result: Record<string, any[]> = {};

    objects.forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          // Ensure the value is an array
          value = [value];
        }

        if (result[key]) {
          // Merge arrays and remove duplicates
          result[key] = Array.from(new Set([...result[key], ...value]));
        } else {
          result[key] = value;
        }
      });
    });

    return result;
  }

  /**
   * Gets the final email preview.
   *
   * @param configID - The configID of the email notification.
   */
  async getFinalEmail(configID: any) {
    this.http
      .post(
        `${this.restService.apiUrl}/notification/preview-email/${configID}`,
        {}
      )
      .subscribe(
        (response: any) => {
          this.finalEmailPreview = response;
        },
        (error: string) => {
          console.error('Error:', error);
        }
      );
  }

  /**
   * Edit an email notification with the provided id.
   *
   * @param id The notification data id.
   * @param data The notification data to be edited.
   * @returns The edited Email notification.
   */
  editEmailNotification(id: string, data: any) {
    const applicationId = data.applicationId;

    return this.apollo.mutate<any>({
      mutation: GET_AND_UPDATE_EMAIL_NOTIFICATION,
      variables: {
        notification: data,
        applicationId: applicationId,
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
    return this.apollo.mutate<any>({
      mutation: GET_AND_UPDATE_EMAIL_NOTIFICATION,
      variables: {
        notification: {
          isDeleted: 1,
          applicationId: applicationId,
        },
        editEmailNotificationId: id,
        applicationId: applicationId,
      },
    });
  }

  /**
   *
   * Delete an email notification with the provided id Permanently.
   *
   * @param id The notification data id.
   * @param applicationId The application id of the email notification.
   * @returns success or error message.
   */
  deleteEmailNotificationPermanently(id: string, applicationId: string) {
    return this.apollo.mutate<any>({
      mutation: DELETE_EMAIL_NOTIFICATION,
      variables: {
        id: id,
        applicationId: applicationId,
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
      return this.http.get<any>(urlWithConfigId);
    }
  }

  /**
   * persisting the state of the boolean variable for sending separate emails
   *
   * @param index - dataset index
   * @returns Bound variable between service and dist list component
   */
  updateSeparateEmail(index: number): boolean {
    const datasetArray = this.datasetsForm?.get('datasets') as FormArray;
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
    const datasetArray = this.datasetsForm?.get('datasets') as FormArray;
    datasetArray?.at(index)?.get('individualEmail')?.setValue(separateEmail);
  }

  /**
   * method for checking whether any of the datasets have had the checkbox for induvidual emails ticked
   *
   * @returns boolean for triggering endpoints
   */
  sendSeparateEmail(): boolean {
    let separateEmail = false;
    const datasetArray = this.datasetsForm.get('datasets') as FormArray;
    datasetArray.controls.forEach((datasetControl: any) => {
      if (datasetControl.get('individualEmail')?.value === true) {
        separateEmail = true;
      }
    });
    return separateEmail;
  }

  /**
   * Iterates over the query formgroup, matches each element with availableFields,
   * and updates the element if a match is found.
   *
   * @param query The raw formgroup value of elements to be converted.
   * @param availableFields The array of available fields for matching.
   */
  convertFields(query: any, availableFields: any) {
    query.forEach((ele: any) => {
      const tempMatchedData = availableFields.find(
        (x: any) => prettifyLabel(x.name) === ele.label
      );
      // Appends label onto the correct matched data
      if (tempMatchedData) {
        ele.name = tempMatchedData.name;
        ele.type = tempMatchedData.type.name;
      }
    });
  }

  /**
   * Checks if a given date string is a valid date in the format YYYY-MM-DD.
   *
   * @param {string} dateString The date string to validate.
   * @returns {boolean} Returns true if the date string is a valid date in the format YYYY-MM-DD, otherwise false.
   */
  isValidDate(dateString: any): boolean {
    // Regular expression for basic ISO date format (YYYY-MM-DD)
    const isoDateFormat =
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|([+-]\d{2}:\d{2})))?$/;

    // Check if the dateString matches the ISO date format
    if (!isoDateFormat.test(dateString)) {
      return false;
    }

    // Parse the date string
    const timestamp = Date.parse(dateString);

    // Check if the parsed result is NaN
    if (isNaN(timestamp)) {
      return false;
    }

    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Check if the Date object is valid
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Formats data strings into a pretty string representation
   *
   * @param rowData table cell data value
   * @param field Name of record field
   * @returns formatted data string ( can be original value )
   */
  formatDataStrings(rowData: any, field?: string): string {
    field;
    // Check if rowData is a string that can be parsed into a date
    if (
      typeof rowData === 'string' &&
      !isNaN(Date.parse(rowData)) &&
      this.isValidDate(rowData)
    ) {
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
    if (typeof rowData === 'string') {
      return rowData;
    } else if (rowData === false) {
      return 'False';
    } else if (rowData === true) {
      return 'True';
    } else if (rowData instanceof Array) {
      return rowData.join(', ');
    } else if (rowData instanceof Object) {
      let objectString = '';
      for (const field in rowData) {
        objectString += `${field}: ${rowData[field]}\n`;
      }
      return objectString;
    }
    return rowData ? JSON.stringify(rowData) : '';
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
    this.emailDistributionList = {
      name: '',
      to: [],
      cc: [],
      bcc: [],
    };
    this.tabs = [
      {
        title: `Block 1`,
        content: `Block 1 Content`,
        active: true,
        index: 0,
        blockHeaderCount: 1,
      },
    ];
  }

  /**
   * Adds an email distribution list with the provided data.
   *
   * @param data The notification data to be added.
   * @param applicationId The application id of the email notification.
   * @returns A query result after adding the email distribution list.
   */
  addDistributionList(data: any, applicationId?: string): Observable<any> {
    return this.apollo.query<any>({
      query: ADD_DISTRIBUTION_LIST,
      variables: {
        distributionList: data,
        applicationId,
      },
    });
  }

  /**
   * sending query to endpoint
   *
   * @param queryData - Preview Data payload
   * @returns rest post to end point.
   */
  getPreviewDataSet(queryData: any): Observable<any> {
    const url = `${this.restService.apiUrl}/notification/preview-dataset`;
    return this.http.post<any>(url, queryData, {
      headers: { responseType: 'text/html' },
    });
  }

  /**
   * Adds a custom template to the distribution list.
   *
   * @param templateInfo - Information about the custom template to be added.
   * @returns {Observable<any>} An observable that resolves with the result of the query.
   */
  addCustomTemplate(templateInfo: any): Observable<any> {
    return this.apollo.query<any>({
      query: ADD_CUSTOM_TEMPLATE,
      variables: {
        customTemplate: templateInfo,
      },
    });
  }

  /**
   * Fetches Resource data
   *
   * @param resourceId Resource Id of Dataset
   * @returns resource data
   */
  fetchResourceData(resourceId: string) {
    return this.apollo.query<ResourceQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: resourceId,
      },
    });
  }

  /**
   * Edit a custom template to the distribution list.
   *
   * @param customTemplate - Information about the custom template to be edit.
   * @param id string
   * @returns {Observable<any>} An observable that resolves with the result of the query.
   */
  editCustomTemplate(customTemplate: any, id: string): Observable<any> {
    return this.apollo.query<any>({
      query: EDIT_CUSTOM_TEMPLATE,
      variables: {
        editCustomTemplateId: id,
        customTemplate,
      },
    });
  }

  /**
   * Edit a distribution list.
   *
   * @param distributionList dl data
   * @param id string
   * @returns {Observable<any>} An observable that resolves with the result of the query.
   */
  editDistributionList(distributionList: any, id?: string): Observable<any> {
    return this.apollo.query<any>({
      query: EDIT_DISTRIBUTION_LIST,
      variables: {
        editDistributionListId: id,
        distributionList,
      },
    });
  }

  /**
   * Delete the distribution list.
   *
   * @param id string
   * @returns {Observable<any>} An observable that resolves with the result of the query.
   */
  deleteDistributionList(id: string): Observable<any> {
    return this.apollo.query<any>({
      query: EDIT_DISTRIBUTION_LIST,
      variables: {
        editDistributionListId: id,
        distributionList: { isDeleted: 1 },
      },
    });
  }

  /**
   * Delete a custom template to the distribution list.
   *
   * @param id string
   * @returns {Observable<any>} An observable that resolves with the result of the query.
   */
  deleteCustomTemplate(id: string): Observable<any> {
    return this.apollo.query<any>({
      query: EDIT_CUSTOM_TEMPLATE,
      variables: {
        editCustomTemplateId: id,
        customTemplate: { isDeleted: 1 },
      },
    });
  }

  /**
   * Retrieves custom templates from the server.
   *
   * @param id The application ids of the email notifications.
   * @param isFromEmailNotification - Indicates if the templates are related to email notifications. Optional.
   * @returns Observable that resolves with the result of the query.
   */
  getCustomTemplates(id?: string, isFromEmailNotification?: boolean) {
    return this.apollo.query<EmailTemplatesQueryResponse>({
      query: GET_CUSTOM_TEMPLATES,
      variables: {
        applicationId: id,
        isFromEmailNotification,
      },
    });
  }

  /**
   * Get an email distribution lists.
   *
   * @param applicationId The application ids of the email notifications.
   * @param distributionListId The distributionList id to get specific distribution list.
   * @returns Email distribution lists.
   */
  getEmailDistributionList(
    applicationId?: string,
    distributionListId?: string
  ) {
    return this.apollo.query<EmailDistributionListQueryResponse>({
      query: GET_DISTRIBUTION_LIST,
      variables: { applicationId, id: distributionListId },
    });
  }

  /**
   * sending emails to endpoint
   *
   * @param emailData data to be send.
   * @returns rest post to end point.
   */
  sendQuickEmail(emailData: any): Observable<any> {
    const urlWithConfigId = `${this.restService.apiUrl}/notification/send-quick-email`;
    return this.http.post<any>(urlWithConfigId, emailData);
  }

  /**
   *
   * Reset All layout data
   */
  resetAllLayoutData() {
    this.allLayoutdata = {
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
  }

  /**
   * Populate Emails into distributionlist input emails form array using email string array
   *
   * @param dlArray email string array
   * @param input form group array
   */
  populateEmails(dlArray: string[], input: FormArray) {
    input.clear();
    dlArray?.forEach((item: string) => {
      input?.push(new FormControl(item));
    });
  }

  /**
   *
   * validating next button by taking 3 conditions in consideration DL name mandatory, check duplicate name validation and requires To email
   */
  validateNextButton() {
    const isDLNameExists = this.distributionListName?.trim()?.length > 0;
    const isDlDuplicateNm = this.isDLNameDuplicate;
    let isExistsToEmail = false;
    // if (!isExistsToEmail) {
    this.isToValidCheck();
    isExistsToEmail = this.isToValid;
    // }
    //Check To is valid or not (Including filter Emails or Manually added emails)
    // const valid = await this.checkToValid();

    if (isDLNameExists && !isDlDuplicateNm && isExistsToEmail) {
      this.disableSaveAndProceed.next(false);
    } else {
      this.disableFormSteps.next({
        stepperIndex: 2,
        disableAction: true,
      });
      this.disableSaveAndProceed.next(true);
    }
  }

  /**
   * checking that To tab is valid or not
   */
  async isToValidCheck() {
    if (
      this.datasetsForm.getRawValue().emailDistributionList?.to?.inputEmails
        .length >= 0 ||
      (this.datasetsForm.getRawValue().emailDistributionList?.to?.resource !==
        '' &&
        this.datasetsForm.getRawValue().emailDistributionList?.to?.resource !==
          null &&
        this.filterToEmails?.length >= 0)
    ) {
      this.isToValid = true;
    } else {
      this.isToValid = await this.checkToValid();
    }
  }
}
