import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
  implements OnInit, OnDestroy
{
  /** Data set containing emails and records. */
  public dataset?: {
    emails: string[];
    records: any[];
  };

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
  /** Send individual email check */
  public individualEmail = false;
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
  /**
   * Event Emitted for no email
   */
  @Output() noEmail = new EventEmitter();

  /** List of emails for back loading. */
  @Input() distributionList: FormGroup | any;

  /** Specifies if To, CC or BCC */
  @Input() type: string | any;

  /** Event emitter for list change. */
  @Output() listChange = new EventEmitter<void>();

  /** Existing ID. */
  @Input() existingId = '';

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
    });

    this.dlQuery = this.distributionList.get('query') as FormGroup;

    if (this.distributionList.controls.resource.value && !this.resource) {
      this.selectedResourceId = this.distributionList.controls.resource.value;
      this.getResourceData(false);
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
        }
      });
    this.selectedEmails = this.distributionList.get('inputEmails') as FormArray;

    // Check if send seperate email is active
    if (this.emailService.datasetsForm?.get('datasets')?.value) {
      for (const dataset of this.emailService.datasetsForm.get('datasets')
        ?.value ?? []) {
        if (dataset.individualEmail) {
          this.individualEmail = true;
          break;
        }
      }
    }

    const hasSelectedEmails = this.selectedEmails.value.length > 0;
    const hasFields = this.dlQuery.get('fields')?.value.length > 0;
    this.emailService.disableSaveAndProceed.next(true);
    this.emailService.disableSaveAsDraft.next(true);
    if (this.individualEmail) {
      this.selectedEmails.setValue([]);
      this.updateSegmentOptions('Select With Filter');
    } else if (hasSelectedEmails && hasFields) {
      this.updateSegmentOptions('Use Combination');
    } else if (!hasSelectedEmails && hasFields) {
      this.updateSegmentOptions('Select With Filter');
    } else {
      this.updateSegmentOptions('Add Manually');
    }
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
    this.loading = true;
    this.availableFields = [];
    if (fromHtml) {
      this.distributionList.controls.query.value.fields = [];
      this.distributionList.controls.query.get('fields').value = [];
      this.selectedFields = [];
      this.filterFields = [];
    }
    this.showDatasetLimitWarning = false;
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
      this.emailService.distributionListName.length > 0;
    // Checks if entry is valid
    if (
      newIndex === previewTabIndex &&
      this.currentTabIndex !== previewTabIndex
    ) {
      this.getDataSet('preview', true);
    }
    //if new tab is preview, get preview data
    if (fromHTML && newIndex === previewTabIndex) {
      if (isValid) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
      this.getDataSet('preview');
    } else if (newIndex >= 0) {
      if (isValid) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
    }
    if (!this.showDatasetLimitWarning) {
      this.currentTabIndex = newIndex;
    }
  }

  /**
   * To get data set for the applied filters.
   *
   * @param tabName - The name of the tab for which to get the data set.
   * @param validCheck - Check if data needs validation
   */
  getDataSet(tabName?: any, validCheck?: boolean): void {
    if (
      this.dlQuery.controls['name'].value !== null &&
      this.dlQuery.controls['name'].value !== ''
    ) {
      if (tabName == 'fields') {
        this.onTabSelect(1, false);
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
          resource: this.resource.id ?? '',
          name: 'Distribution List Preview',
          query: {
            name: this.dlQuery?.get('name').value,
            filter: this.dlQuery.get('filter').value,
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
            (response: any) => {
              this.showPreview = true;
              // Navigates straight to preview tab if didn't fail before
              if (validCheck) {
                if (response.count <= 50) {
                  validCheck = false;
                } else {
                  this.onTabSelect(this.currentTabIndex, false);
                  this.totalMatchingRecords = response.count;
                  this.showDatasetLimitWarning = true;
                }
              }
              if (!validCheck) {
                this.onTabSelect(2, false);
                this.showPreview = true;
                if (response.count <= 50) {
                  this.showDatasetLimitWarning = false;
                  this.previewHTML = window.atob(response.tableHtml);
                  const previewHTML = document.getElementById(
                    'tblPreview'
                  ) as HTMLInputElement;
                  if (previewHTML) {
                    previewHTML.innerHTML = this.previewHTML;
                  }
                } else {
                  this.previewHTML = '';
                  this.totalMatchingRecords = response.count;
                  this.showDatasetLimitWarning = true;
                }
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
      }
    });

    this.selectedFields =
      this.distributionList.controls.query.get('fields')?.value;
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.segmentForm.get('segment')?.value === 'Add Manually') {
      const fields = this.dlQuery.get('fields') as FormArray;
      fields.clear();

      const filter = this.dlQuery.get('filter') as FormGroup;
      const filters = filter.get('filters') as FormArray;
      filters.clear();
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
    this.activeSegmentIndex = this.individualEmail
      ? 1
      : this.segmentList.indexOf(segment);
    this.showPreview = false;
    const hasEmails = this.selectedEmails?.value?.length > 0;
    const isValid =
      ((this.dlQuery.get('fields')?.value.length > 0 &&
        !this.showDatasetLimitWarning) ||
        hasEmails) &&
      this.emailService.distributionListName.length > 0;

    if (this.activeSegmentIndex === 0) {
      if (isValid) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
    }
    if (this.activeSegmentIndex === 1) {
      if (isValid) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
    }
    if (this.activeSegmentIndex === 2) {
      if (isValid) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
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
  removeEmailChip(chipIndex: number): void {
    this.selectedEmails.removeAt(chipIndex);
    this.listChange.emit();
  }

  /**
   * To add the selected emails manually
   *
   * @param element Input Element
   */
  addEmailManually(element: HTMLInputElement): void {
    // Check if email already exists
    const emailDuplicate = this.selectedEmails.controls.some(
      (control: AbstractControl) => control.value === element.value
    );

    if (emailRegex.test(element.value) && !emailDuplicate) {
      this.selectedEmails.push(this.formBuilder.control(element.value));
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
}
