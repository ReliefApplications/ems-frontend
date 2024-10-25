import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { EmailService } from '../../email.service';
import { FILTER_OPERATORS } from '../../filter/filter.const';
import { Apollo } from 'apollo-angular';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { emailRegex } from '../../constant';
import { FieldStore } from '../../models/email.const';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { QueryBuilderService } from './../../../../services/query-builder/query-builder.service';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../../../../services/rest/rest.service';
import { prettifyLabel } from '../../../../../lib/utils/prettify';
import {
  ReferenceDataQueryResponse,
  ReferenceDatasQueryResponse,
} from '../../../../../lib/models/reference-data.model';
import {
  GET_API_CONFIGURATIONS,
  GET_REFERENCE_DATA,
  GET_REFERENCE_DATAS,
} from '../../graphql/queries';
import { ApiConfigurationsQueryResponse } from '../../../../../lib/models/api-configuration.model';

/**
 * Email template to create distribution list
 */
@Component({
  selector: 'shared-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss'],
})
export class EmailTemplateComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy, OnChanges
{
  /** Data set containing emails and records. */
  public dataset?: {
    emails: string[];
    records: any[];
  };

  /** Disable fields */
  @Input() isDisable = false;

  /** records of selected Dataset*/
  public data!: any[];

  /** List of data items. */
  public dataList!: any[];

  /** Fields selected in dataset step for display */
  public selectedFields: any[] = [];

  /** List of emails. */
  public emails: string[] = [];

  /** Selected resource. */
  public resource!: any;

  /** Selected value. */
  public selectedValue!: string;

  /** Cache for filter data. */
  public cacheFilterData!: string;

  /** Selected dataset. */
  public selectedDataset: any | undefined = '';

  /** Emails in the data set. */
  public datasetEmails!: string[];

  /** Fields in the data set. */
  public datasetFields: FieldStore[] = [];

  /** Form group for filter query. */
  public filterQuery: FormGroup | any | undefined;

  /** Selected emails. */
  public selectedEmails: string[] | any = [];

  /** Filter operators. */
  public filterOperators = FILTER_OPERATORS;

  /** Operators for filtering. */
  public operators: { [key: number]: { value: string; label: string }[] } = {};

  /** Form array for filter fields. */
  public filterFields: FormArray | any = new FormArray([]);

  /** Form group for datasets. */
  public datasetsForm: FormGroup | any = this.emailService.datasetsForm;

  /** Flag to control dropdown visibility. */
  public isDropdownVisible = false;

  /** List of data sets. */
  public datasets: any;

  /** Flag to switch between date picker and text expression. */
  public useExpression = false;

  /** Selected field. */
  public selectField = '';

  /** Error message for email validation. */
  public emailValidationError = '';

  /** It is for previously selected Dataset*/
  public prevDataset!: any | undefined;
  /** Show preview for select with filter option  */
  public showPreview = false;
  /** Array of fields */
  public availableFields: any[] = [];
  /** Selected resource ID */
  public selectedResourceId = '';
  /** Flag to indicate if the resource has been populated. */
  public resourcePopulated = false;
  /** Flag to indicate if the dataset limit warning should be shown. */
  public showDatasetLimitWarning = false;
  /** Current tab index. */
  public currentTabIndex = 0;
  /** Form group for filter query. */
  public dlQuery!: FormGroup | any;
  /** Form group for segment */
  public segmentForm!: FormGroup;
  /** Index of active segment. */
  public activeSegmentIndex = 0;
  /** List of selected item indexes. */
  public selectedItemIndexes: number[] | any[] = [];
  /** Flag to indicate if all items are selected. */
  public isAllSelected = false;
  /** Loading status. */
  public loading = false;
  /** Query filter Preview HTML */
  public previewHTML = '';
  /** Total matching records */
  public totalMatchingRecords = 0;
  /** Checks if to is valid for distribution list */
  public distributionListValid!: boolean;
  /** List of display types */
  public segmentList = [
    'Add Manually',
    'Select With Filter',
    'Use Combination',
  ];
  /** Time units for filtering. */
  public timeUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];
  /** List of emails for back loading. */
  @Input() distributionList: FormGroup | any;
  /** Specifies if To, CC or BCC */
  @Input() type: string | any;
  /** Existing ID. */
  @Input() existingId = '';
  /** Event Emitted for no email */
  @Output() noEmail = new EventEmitter();
  /** Event emitter for list change. */
  @Output() listChange = new EventEmitter<void>();
  /** Reference to tblPreview element. */
  @ViewChild('tblPreview', { static: false })
  tblPreview!: ElementRef<any>;
  /** Flag to show the Child fields limit warning. */
  public showFieldsWarning = false;
  /** Flag for data is Resource or Reference data */
  public isReferenceData = false;
  /** List of data types */
  public dataTypeList: any = ['Resource', 'Reference Data'];
  /** List of Reference  types */
  public refernceData: any = [];
  /** Show NonEmail Fields Alert */
  public nonEmailFieldsAlert = false;
  /** Actual resourceFields data  */
  public resourceFields: any = [];

  /**
   * Composite filter group.
   *
   * @param fb Angular form builder
   * @param emailService helper functions
   * @param apollo Apollo server
   * @param snackbar snackbar helper function
   * @param translate i18 translate service
   * @param queryBuilder Shared query builder service
   * @param formBuilder Angular form builder
   * @param http Http client
   * @param restService rest service
   */
  constructor(
    private fb: FormBuilder,
    public emailService: EmailService,
    private apollo: Apollo,
    public snackbar: SnackbarService,
    public translate: TranslateService,
    public queryBuilder: QueryBuilderService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private restService: RestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segment: [this.segmentList[0]], // Set the initial value to the first display type
      datasetSelect: '',
      dataType: null,
    });
    this.segmentForm.get('segment')?.valueChanges.subscribe((value: any) => {
      this.clearUnusedValues(value);
    });
    if (this.isDisable) {
      this.segmentForm?.get('segment')?.disable();
      this.segmentForm?.get('dataType')?.disable();
      this.distributionList?.get('reference')?.disable();
    }

    this.distributionListValid =
      (this.emailService.isToValid &&
        (this.type === 'bcc' || this.type === 'cc')) ||
      this.type === 'to';

    this.dlQuery = this.distributionList.get('query') as FormGroup;

    if (this.distributionList.controls.resource?.value && !this.resource) {
      this.selectedResourceId = this.distributionList.controls.resource.value;
      this.segmentForm.get('dataType')?.setValue('Resource');
      this.getResourceData(false);
    } else if (this.distributionList.controls.reference?.value) {
      this.segmentForm.get('dataType')?.setValue('Reference Data');
      this.onDataTypeChange('Reference Data', true);
    }
    this.distributionList.controls.resource.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          this.selectedResourceId !== value
        ) {
          this.selectedResourceId = value;
          if (this.resource?.fields) {
            this.resource.fields = [];
          }
          this.getResourceData(true);
        } else if (value === null) {
          this.selectedResourceId = value;
          this.clearUnusedValues(this.segmentList[this.activeSegmentIndex]);
        }
      });
    this.selectedEmails = this.distributionList.get('inputEmails') as FormArray;

    const hasSelectedEmails = this.selectedEmails.value.length > 0;
    const hasFields = this.dlQuery.get('fields')?.value.length > 0;
    this.type === 'to' ? (this.emailService.isToValid = false) : '';

    if (hasSelectedEmails && hasFields) {
      this.updateSegmentOptions('Use Combination');
    } else if (
      !hasSelectedEmails &&
      (hasFields || this.selectedResourceId !== '')
    ) {
      this.updateSegmentOptions('Select With Filter');
    } else {
      this.updateSegmentOptions('Add Manually');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isDisable'] &&
      changes['isDisable'].previousValue !== changes['isDisable'].currentValue
    ) {
      if (this.isDisable) {
        this.segmentForm?.get('segment')?.disable();
        this.segmentForm?.get('dataType')?.disable();
        this.distributionList?.get('reference')?.disable();
      } else {
        this.segmentForm?.get('segment')?.enable();
        this.segmentForm?.get('dataType')?.enable();
        this.distributionList?.get('reference')?.enable();
      }
    }
  }

  /**
   * Clear unused values for segments
   *
   * @param value form value
   */
  clearUnusedValues(value: string) {
    if (value === 'Add Manually' && this.dlQuery) {
      const fields = this.dlQuery?.get('fields') as FormArray;
      fields?.clear();

      const filter = this.dlQuery?.get('filter') as FormGroup;
      const filters = filter?.get('filters') as FormArray;
      filters?.clear();

      this.distributionList.get('resource')?.setValue('');
      this.dlQuery?.get('name')?.setValue('');
      this.resource = null;
      this.emailService.isToValidCheck();
    } else if (value === 'Select With Filter') {
      // Clear the input emails form array
      while (this.selectedEmails.length !== 0) {
        this.selectedEmails.removeAt(0);
      }
      this.selectedEmails.reset();
      if (this.type) {
        let type = this.type == 'to' ? 'To' : this.type == 'cc' ? 'Cc' : 'Bcc';
        if (this.emailService.emailDistributionList[type]) {
          this.emailService.emailDistributionList[type].inputEmails = this
            .emailService.emailDistributionList[type]?.inputEmails
            ? []
            : this.emailService.emailDistributionList[type].inputEmails;
        }

        type = this.type == 'To' ? 'to' : this.type == 'Cc' ? 'cc' : 'bcc';
        if (this.emailService.emailDistributionList[type]) {
          this.emailService.emailDistributionList[type].inputEmails = this
            .emailService.emailDistributionList[type]?.inputEmails
            ? []
            : this.emailService.emailDistributionList[type].inputEmails;
        }
      }
      this.emailService.isToValidCheck();
    } else if (value === 'Use Combination') {
      if (
        this.emailService.datasetsForm.getRawValue().emailDistributionList?.to
          ?.inputEmails?.length > 0 ||
        (this.emailService.datasetsForm.getRawValue().emailDistributionList.to
          .resource !== null &&
          this.emailService.datasetsForm.getRawValue().emailDistributionList.to
            .resource !== '')
      ) {
        this.emailService.isToValid = true;
      } else {
        this.emailService.isToValid = false;
      }
    }
    this.emailService.validateNextButton();
  }

  /**
   * Update segment options based on the form value
   *
   * @param segmentValue form value
   */
  updateSegmentOptions(segmentValue: string) {
    this.segmentForm.get('segment')?.setValue(segmentValue);
    this.onSegmentChange(segmentValue);
  }

  /**
   * Gets resource data.
   *
   * @param fromHtml if called from email-template HTML or not
   */
  getResourceData(fromHtml: boolean): void {
    this.resourceFields = [];
    this.loading = true;
    this.availableFields = [];
    if (fromHtml) {
      this.distributionList.controls.query.value.fields = [];
      this.distributionList.controls.query.get('fields').value = [];
      this.selectedFields = [];
      this.filterFields = [];
    }
    this.showDatasetLimitWarning = false;
    this.type === 'to' ? (this.emailService.isToValid = false) : '';
    this.emailService.disableSaveAndProceed.next(true);
    this.emailService.disableSaveAsDraft.next(false);
    this.currentTabIndex = 0;
    if (fromHtml) {
      this.resetFilters(this.distributionList.get('query'));
    }
    if (this.selectedResourceId) {
      this.emailService
        .fetchResourceData(this.selectedResourceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          const queryTemp: any = data.resource;
          this.resourceFields = queryTemp?.fields;
          const newData = this.queryBuilder.getFields(queryTemp.queryName);
          if (this.distributionList.controls.query.get('name') === null) {
            this.distributionList.controls.query.addControl(
              'name',
              new FormControl('')
            );
          }
          this.distributionList.controls.query
            .get('name')
            .setValue(queryTemp.queryName);
          this.availableFields = newData;
          this.filterFields = cloneDeep(newData);
          this.loading = false;
          this.resourcePopulated = true;
          this.resource = data.resource;
        });
    } else {
      this.loading = false;
    }
  }

  /**
   * Handles Filter, Field, Style Tab selection changes
   *
   * @param event The tab selected
   * @param fromHTML If state is in edit mode then false else true if new notification (means Event from UI)
   */
  onTabSelect(event: any, fromHTML: boolean): void {
    const newIndex = event;
    const previewTabIndex = 2;
    const isValid =
      this.dlQuery.get('fields')?.value.length > 0 &&
      !this.showDatasetLimitWarning &&
      this.emailService.distributionListName?.length > 0 &&
      !this.distributionListValid;

    //if new tab is preview, get preview data
    if (fromHTML && newIndex === previewTabIndex) {
      if (isValid) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
      }
      this.currentTabIndex === newIndex ? this.getDataSet('preview') : '';
    } else if (newIndex >= 0) {
      if (isValid) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
        this.emailService.disableSaveAsDraft.next(false);
      }
    }
    // if (!this.showDatasetLimitWarning) {
    this.currentTabIndex = newIndex;
    // }
  }

  /**
   * To get data set for the applied filters.
   *
   * @param tabName - The name of the tab for which to get the data set.
   */
  async getDataSet(tabName?: any): Promise<void> {
    if (
      this.dlQuery.controls['name'].value !== null &&
      this.dlQuery.controls['name'].value !== ''
    ) {
      if (tabName == 'fields') {
        if (
          this.distributionList.get('resource').value === null ||
          this.distributionList.get('resource').value === ''
        ) {
          //For refernce data selection needs to skip filter tab
          this.onTabSelect(2, false);
        } else {
          this.onTabSelect(1, false);
        }
      }
      if (tabName == 'filter') {
        this.onTabSelect(2, false);
      }
      // const allPreviewData: any = [];
      if (tabName == 'preview') {
        this.loading = true;

        let objPreview: any = {};
        this.emailService.convertFields(
          this.distributionList.getRawValue().query?.fields,
          this.availableFields
        );
        objPreview = {
          resource: this.resource?.id ?? '',
          reference: this.distributionList.get('reference')?.value ?? '',
          name: 'Distribution List Preview',
          query: {
            name: this.dlQuery?.get('name').value,
            filter: this.distributionList.getRawValue().query?.filter, // this.dlQuery.get('filter').value,
            fields: this.distributionList.getRawValue().query?.fields,
            sort: {
              field: '',
              order: 'asc',
            },
            style: [],
            pageSize: 10,
            template: '',
          },
        };

        this.previewHTML = '';

        this.http
          .post(
            `${this.restService.apiUrl}/notification/preview-dataset`,
            objPreview
          )
          .subscribe(
            async (response: any) => {
              this.showPreview = true;
              this.emailService.filterToEmails =
                this.type === 'to' ? [] : this.emailService.filterToEmails;
              // Navigates straight to preview tab if didn't fail before

              this.onTabSelect(2, false);
              this.showPreview = true;
              if (response.count <= 50) {
                this.showDatasetLimitWarning = false;
              } else {
                this.totalMatchingRecords = response.count;
                this.showDatasetLimitWarning = true;
              }
              await this.checkFilter();

              this.previewHTML = window.atob(response.tableHtml);
              if (this.tblPreview?.nativeElement) {
                setTimeout(() => {
                  this.tblPreview.nativeElement.innerHTML = this.previewHTML;
                }, 0);
              }

              this.loading = false;
            },
            (error: string) => {
              console.error('Error:', error);
              this.loading = false;
            }
          );
      }
    }
  }

  /**
   * Retrieves Fields Form array
   *
   * @returns FormArray of fields
   */
  getFieldsArray() {
    const formArray = this.distributionList.controls.query.get(
      'fields'
    ) as FormArray;
    formArray.controls.forEach((field: any) => {
      if (!field.value.name) {
        const tempMatchedData = this.availableFields.find(
          (x: any) => prettifyLabel(x.name) === field.value.label
        );
        if (tempMatchedData) {
          const updatedField = {
            ...field.value,
            name: tempMatchedData.name,
            type: tempMatchedData.type.name,
          };
          field.patchValue(updatedField);
        }
        // if (
        //   this.selectedFields?.length > 0 &&
        //   !this.nonEmailFieldsAlert &&
        //   this.selectedFields?.length !==
        //     this.distributionList.controls.query.get('fields')?.value.length &&
        //   tempMatchedData.type.name?.toLowerCase()?.trim() !== 'email'
        // ) {
        //   this.nonEmailFieldsAlert = true;
        // }
      }
    });

    this.selectedFields =
      this.distributionList.controls.query.get('fields')?.value;

    if (
      this.distributionList
        .getRawValue()
        .query.fields?.filter((x: any) => x?.fields?.length === 0).length > 0
    ) {
      this.showFieldsWarning = true;
    } else {
      this.showFieldsWarning = false;
    }

    if (this.selectedFields?.length === 0 || this.showFieldsWarning) {
      this.emailService.disableSaveAndProceed.next(true);
    } else {
      if (this.emailService.isToValid) {
        this.emailService.disableSaveAndProceed.next(false);
      }
    }
    return formArray;
  }

  /**
   * Returns an array of strings representing the values of each control in the
   * selectedEmails FormArray.
   *
   * @returns An array of strings representing the values of each control
   * in the selectedEmails FormArray.
   */
  get inputEmails(): string[] {
    return this.selectedEmails.controls.map(
      (control: AbstractControl) => control.value
    );
  }

  /**
   * Resets the state `showDatasetLimitWarning` when the close button is clicked.
   */
  closeWarningMessage(): void {
    this.showDatasetLimitWarning = false;
  }

  /**
   * Reinitialises and resets Distribution List Filter values
   *
   * @param query - Dataset Form Group
   */
  resetFilters(query: FormGroup) {
    this.resourceFields = [];
    const fields = query.get('fields') as FormArray;
    fields.clear();

    const filter = query.get('filter') as FormGroup;
    const filters = filter.get('filters') as FormArray;
    filters.clear();
    filters.push(this.emailService.getNewFilterFields);

    query.get('name')?.setValue('');
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.distributionList.controls[formField]?.value) {
      this.distributionList.controls[formField].setValue(null);
      this.distributionList.controls.resource.value = null;
    }
    this.resetFilters(this.distributionList.get('query'));
    this.resource.fields = [];
    this.selectedResourceId = '';
    event.stopPropagation();
  }

  /**
   *
   * Checking Email input is valid or not
   *
   * @returns Returns true if email is valid
   */
  async isEmailInputValid(): Promise<boolean> {
    const inputsValid = this.selectedEmails.length > 0;
    if (this.segmentForm.get('segment')?.value === 'Add Manually') {
      return inputsValid;
    } else {
      const valid = await this.checkFilter();
      if (this.segmentForm.get('segment')?.value === 'Select With Filter') {
        return valid;
      } else {
        if (this.resource) {
          return valid && inputsValid;
        } else {
          return inputsValid;
        }
      }
    }
  }

  /**
   *
   * Checks if distribution filters are emails
   *
   * @returns returns true if filter has email
   */
  checkFilter(): Promise<boolean> {
    return new Promise((resolve) => {
      let objPreview: any = {};
      this.emailService.convertFields(
        this.distributionList.getRawValue().query?.fields,
        this.availableFields
      );
      objPreview = {
        emailDistributionList: cloneDeep(
          this.emailService.datasetsForm
            .get('emailDistributionList')
            ?.getRawValue()
        ),
      };
      objPreview.emailDistributionList.to = {
        resource: this.resource?.id ?? '',
        reference: this.distributionList?.get('reference')?.value ?? '',
        query: {
          name: this.dlQuery?.get('name').value,
          filter: this.dlQuery.get('filter').value,
          fields: this.distributionList.getRawValue().query?.fields,
        },
        inputEmails: [],
      };

      this.http
        .post(
          `${this.restService.apiUrl}/notification/preview-distribution-lists/`,
          objPreview
        )
        .toPromise()
        .then((response: any) => {
          if (this.type === 'to') {
            this.emailService.filterToEmails =
              response?.to?.length > 0 ? response?.to : [];
            if (
              response?.to?.length > 0 &&
              response?.name?.length > 0 &&
              !this.emailService.isDLNameDuplicate
            ) {
              this.emailService.isToValid = true;
            } else {
              // Check if To is use combination
              if (
                this.segmentForm.get('segment')?.value === 'Use Combination'
              ) {
                if (
                  this.emailService.emailDistributionList?.to?.inputEmails
                    ?.length > 0
                ) {
                  this.emailService.isToValid = true;
                }
              } else {
                // False if returned emails are not correct
                this.emailService.isToValid = false;
              }
            }
            if (response?.to?.length === 0) {
              this.emailService.isToValid = true;
            }
            this.emailService.validateNextButton();
          } else if (this.type === 'cc' || this.type === 'bcc') {
            this.emailService.validateNextButton();
          }
          resolve(response?.to.length > 0);
        })
        .catch((error) => {
          console.error(error);
          this.emailService.filterToEmails =
            this.type === 'to' ? [] : this.emailService.filterToEmails;
          resolve(false);
        });
    });
  }

  override async ngOnDestroy(): Promise<void> {
    super.ngOnDestroy();
    this.clearUnusedValues(this.segmentForm.get('segment')?.value);
    if (this.type === 'to') {
      const valid = await this.isEmailInputValid();
      if (valid) {
        this.emailService.isToValid = true;
      } else {
        this.emailService.isToValid = false;
      }
    }

    this.emailService.setDistributionList();
  }

  /**
   * To bind the dataset details
   *
   * @param dataset data of the data set
   */
  bindDataSetDetails(dataset: any): void {
    this.noEmail.emit(false);
    this.selectedItemIndexes = [];
    this.isAllSelected = false;
    this.dataList = [];
    this.resource = [];
    this.datasetFields = [];
    if (dataset === undefined) {
      this.dataList = [];
      this.resource = [];
      this.datasetFields = [];
      return;
    }
    if (
      this.activeSegmentIndex !== 2 &&
      dataset.cacheData !== undefined &&
      Object.keys(dataset?.cacheData).length &&
      dataset?.cacheData?.datasetResponse
    ) {
      this.dataList = [];
      this.resource = [];
      this.datasetFields = [];
      this.selectedFields = [];
      this.loading = true;

      const { dataList, resource, datasetResponse } = dataset.cacheData;
      this.dataList = dataList;
      this.resource = resource;
      this.dataset = datasetResponse;
      this.datasetEmails = datasetResponse?.records
        ?.map((record: { email: string }) => record.email)
        ?.filter(Boolean)
        ?.flat();
      this.prevDataset = this.selectedDataset;
      this.emailService.setSelectedDataSet(dataset);
      this.loading = false;
    }
  }

  /**
   * Handles on display change event to set index
   *
   * @param event What is being displayed
   */
  onSegmentChange(event: any): void {
    this.noEmail.emit(false);
    const segment = event?.target?.value || event;
    this.activeSegmentIndex = this.segmentList.indexOf(segment);
    this.showPreview = false;
    const hasEmails = this.selectedEmails?.value?.length > 0;
    let isValid =
      ((this.dlQuery.get('fields')?.value.length > 0 &&
        !this.showDatasetLimitWarning) ||
        hasEmails) &&
      this.emailService.datasetsForm?.value?.emailDistributionList?.name
        ?.length > 0 &&
      !this.emailService.isDLNameDuplicate &&
      this.distributionListValid;

    if (this.activeSegmentIndex === 0) {
      //Add Manually
      if (this.selectedEmails?.value?.length === 0 && this.type === 'to') {
        this.emailService.isToValid = false;
        isValid = false;
      }
      if (isValid) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
        this.emailService.disableSaveAsDraft.next(false);
      }

      this.type === 'to' ? (this.emailService.toDLHasFilter = false) : '';
    }
    if (this.activeSegmentIndex === 1) {
      if (isValid) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
        this.emailService.disableSaveAsDraft.next(false);
      }

      this.type === 'to' ? (this.emailService.toDLHasFilter = true) : '';
    }
    if (this.activeSegmentIndex === 2) {
      if (isValid) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
        this.emailService.disableSaveAsDraft.next(false);
      }

      this.type === 'to' ? (this.emailService.toDLHasFilter = true) : '';
    }
  }

  /**
   *
   *
   * @returns Form array
   */
  get datasetFilterInfo(): FormArray {
    return this.dlQuery.get('filters') as FormArray;
  }

  /**
   * Remove email Id from the list
   *
   * @param chipIndex chip index
   */
  async removeEmailChip(chipIndex: number): Promise<void> {
    this.selectedEmails.removeAt(chipIndex);
    this.listChange.emit();
    if (
      this.selectedEmails.length < 1 &&
      this.segmentForm.get('segment')?.value === 'Add Manually'
    ) {
      this.type === 'to' ? (this.emailService.isToValid = false) : '';
      this.emailService.validateNextButton();
    } else {
      this.emailService.isToValidCheck();
      this.emailService.validateNextButton();
    }
  }

  /**
   * To add the selected emails manually
   *
   * @param element Input Element
   */
  addEmailManually(element: HTMLInputElement): void {
    // Check if email already exists
    const emailDuplicate = this.selectedEmails.controls.some(
      (control: AbstractControl) =>
        control.value.toLowerCase().trim() ===
        element.value.toLowerCase().trim()
    );

    if (emailRegex.test(element.value) && !emailDuplicate) {
      this.selectedEmails.push(this.formBuilder.control(element.value));
      if (
        this.distributionListValid &&
        (this.segmentForm.get('segment')?.value === 'Add Manually' ||
          (this.segmentForm.get('segment')?.value === 'Use Combination' &&
            !this.resource)) &&
        this.emailService.datasetsForm?.value?.emailDistributionList?.name
          ?.length > 0 &&
        !this.emailService.isDLNameDuplicate
      ) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
      } else if (
        this.segmentForm.get('segment')?.value === 'Use Combination' &&
        this.resource &&
        this.distributionListValid &&
        this.emailService.datasetsForm?.value?.emailDistributionList?.name
          ?.length > 0 &&
        !this.emailService.isDLNameDuplicate
      ) {
        if (
          this.dlQuery.get('fields')?.value.length > 0 ||
          (this.dlQuery.get('fields')?.value.length > 0 &&
            this.dlQuery.get('filter').get('filters').length > 0 &&
            this.emailService.datasetsForm?.value?.emailDistributionList?.name
              ?.length > 0)
        ) {
          console.log(this.dlQuery.get('fields')?.value);
        } else if (this.dlQuery.get('filter').get('filters').length > 0) {
          this.type === 'to' ? (this.emailService.isToValid = false) : '';
        }
      }

      element.value = '';
      this.emailValidationError = '';
      this.listChange.emit();
    } else if (!emailRegex.test(element.value)) {
      this.snackbar.openSnackBar(
        this.translate.instant('components.customNotifications.errors.email'),
        {
          error: true,
        }
      );

      this.emailValidationError = '';
    } else if (emailDuplicate) {
      this.snackbar.openSnackBar(
        this.translate.instant(
          'components.customNotifications.errors.duplicate'
        ),
        {
          error: true,
        }
      );

      this.emailValidationError = '';
    }
  }

  /**
   * Validates the email address entered in the input element.
   *
   * @param element email string
   */
  validateEmail(element: HTMLInputElement): void {
    this.emailValidationError = emailRegex.test(element.value)
      ? ''
      : 'Invalid Email Address';
    if (element.value === '') {
      this.emailValidationError = '';
    }
  }

  /**
   * Resets the state `showFieldsWarning` when the close button is clicked.
   */
  closeFieldsWarningMessage(): void {
    this.showFieldsWarning = false;
  }

  /**
   * Bind the reference data if reference data checkbox is checked.
   *
   * @param event selected Datatype Id
   * @param isEdit if edit mode, then true else false
   */
  onDataTypeChange(event: any, isEdit?: boolean) {
    // this.resetQuery(this.segmentForm.get('query'));
    this.availableFields = [];
    this.selectedFields = [];
    if (event?.toLowerCase() === 'resource') {
      this.refernceData = [];
      this.distributionList.get('reference')?.setValue(null);
    } else {
      !isEdit ? this.distributionList.get('resource')?.setValue(null) : '';
      this.resource = !isEdit ? null : this.resource;
      this.getRefernceData();
    }
  }

  /**
   * Bind the reference data if reference data checkbox is checked.
   *
   * @param refernceId selected refernce Id
   */
  getRefernceData(refernceId?: any): void {
    this.loading = true;
    this.apollo
      .watchQuery<ApiConfigurationsQueryResponse>({
        query: GET_API_CONFIGURATIONS,
        variables: {
          first: 10,
          afterCursor: '',
          filter: {
            filters: [],
            logic: 'and',
          },
          sortField: undefined,
          sortOrder: undefined,
        },
      })
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          if (
            data?.apiConfigurations?.edges?.filter(
              (x) =>
                x?.node?.status === 'active' &&
                x?.node?.authType == 'serviceToService'
            )
          ) {
            const configurations = data?.apiConfigurations.edges.filter(
              (x) =>
                x.node.status === 'active' &&
                x.node.authType == 'serviceToService'
            );
            this.apollo
              .watchQuery<ReferenceDatasQueryResponse>({
                query: GET_REFERENCE_DATAS,
                variables: {
                  first: 10,
                  afterCursor: '',
                  filter: {
                    filters: [],
                    logic: 'and',
                  },
                  sortField: undefined,
                  sortOrder: undefined,
                },
              })
              .valueChanges.pipe(takeUntil(this.destroy$))
              .subscribe(
                ({ data }) => {
                  this.loading = false;
                  if (data?.referenceDatas) {
                    const refernceData: any = data.referenceDatas.edges
                      .map((x: any) => x.node)
                      .filter((x: any) =>
                        configurations
                          .map((x: any) => x?.node?.id)
                          .includes(x.apiConfiguration?.id)
                      );
                    this.refernceData = refernceData;
                    if (
                      refernceId ||
                      this.distributionList.controls.reference?.value
                    ) {
                      this.getSelectedReferenceData(
                        refernceId ??
                          this.distributionList.controls.reference?.value
                      );
                    }
                  }
                },
                (err) => {
                  this.snackbar.openSnackBar(err.message, { error: true });
                  this.loading = false;
                }
              );
          }
        },
        error: (err) => {
          this.snackbar.openSnackBar(err.message, { error: true });
          this.loading = false;
        },
      });
  }

  /**
   * Bind the reference data if reference data checkbox is checked.
   *
   * @param event get selected Id of refernce data
   * @param fromHTML Method call isfrom UI
   */
  getSelectedReferenceData(event: any, fromHTML?: boolean) {
    // this.resetQuery(this.query.get('query'));
    if (this.refernceData.filter((x: any) => x.id === event).length > 0) {
      this.dlQuery
        ?.get('name')
        .setValue(
          this.refernceData.filter((x: any) => x.id === event)?.[0].name
        );
    }
    this.availableFields = [];
    this.selectedFields = [];
    if (fromHTML) {
      const fields = this.dlQuery.get('fields') as FormArray;
      fields.clear();
    }
    this.loading = true;
    this.apollo
      .watchQuery<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id: event,
        },
      })
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.loading = false;
          if (data?.referenceData?.fields) {
            const refernceFields: any = [];
            data.referenceData.fields.forEach((ele: any) => {
              const eleType = this.getEditorType(ele.type);
              refernceFields.push({
                graphQLFieldName: ele.graphQLFieldName,
                name: ele.name,
                kind: 'SCALAR',
                type: eleType,
                editor: eleType,
              });
            });
            this.availableFields = refernceFields;
          }
        },
        error: (err) => {
          this.snackbar.openSnackBar(err.message, { error: true });
          this.loading = false;
        },
      });
  }

  /**
   * get the editor type name.
   *
   * @param type send the type name
   * @returns type name
   */
  getEditorType(type: any) {
    switch (type) {
      case 'string':
        return 'text';
      case 'integer':
        return 'numeric';
      case 'number':
        return 'numeric';
      case 'boolean':
        return 'boolean';
      case 'object':
        return '';
      case 'array':
        return 'dropdown';
      default:
        return 'text';
    }
  }

  /**
   * Resets the state `nonemailfields` when the close button is clicked.
   */
  closeNonEmailFieldsAlert(): void {
    this.nonEmailFieldsAlert = false;
  }

  /**
   * Emitted event from the tab-fields component
   *
   * @param event - emitted data
   */
  setNonEmailFields(event: any) {
    const matchedData =
      this.resourceFields.filter(
        (x: any) => x?.name.toLowerCase() == event?.name?.toLowerCase()
      ).length > 0
        ? this.resourceFields.filter(
            (x: any) => x?.name.toLowerCase() == event?.name?.toLowerCase()
          )?.[0].type
        : '';
    if (!this.nonEmailFieldsAlert && matchedData !== 'email') {
      this.nonEmailFieldsAlert = true;
    }
  }
}
