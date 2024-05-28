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
  FormGroup,
} from '@angular/forms';
import { clone } from 'lodash';
import { EmailService } from '../../email.service';
import {
  FIELD_TYPES,
  FILTER_OPERATORS,
  TYPE_LABEL,
} from '../../filter/filter.constant';
import { ResourceQueryResponse } from '../../../../models/resource.model';
import { GET_RESOURCE } from '../../graphql/queries';
import { Apollo } from 'apollo-angular';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { emailRegex, selectFieldTypes } from '../../constant';
import { FieldStore } from '../../models/email.const';

/**
 * Email template to create distribution list
 */
@Component({
  selector: 'shared-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss'],
})
export class EmailTemplateComponent implements OnInit, OnDestroy {
  /** Data set containing emails and records. */
  public dataset?: {
    emails: string[];
    records: any[];
  };

  /** records of selected Dataset*/
  public data!: any[];

  /** List of data items. */
  public dataList!: any[];

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
  public datasetFields!: string[];

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

  /** Function to filter data. */
  public filterData = this.emailService.filterData;

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

  /** It is for previously selcted Dataset*/
  public prevDataset!: any | undefined;

  /** Event emitter for loading emails. */
  @Output() emailLoad = new EventEmitter<{
    emails: string[];
    emailFilter: any;
  }>();

  /**
   * Event Emitted for no email
   */
  @Output() noEmail = new EventEmitter();

  /** List of emails for back loading. */
  @Input() emailBackLoad: string[] | undefined;

  /** Email filter form group. */
  @Input() emailFilter: FormGroup | undefined;

  /** Event emitter for list change. */
  @Output() listChange = new EventEmitter<void>();

  /** Existing ID. */
  @Input() existingId = '';
  /** Form group for segment */
  public segmentForm!: FormGroup;

  /** Index of active segment. */
  public activeSegmentIndex = 0;

  /** Segment buttons for selection. */
  public segmentButtons = [
    'Add Manually',
    'Select From List',
    'Select With Filter',
  ];

  /** List of selected item indexes. */
  public selectedItemIndexes: number[] | any[] = [];

  /** Flag to indicate if all items are selected. */
  public isAllSelected = false;

  /** Loading status. */
  public loading = false;

  /** List of display types */
  public segmentList = [
    'Add Manually',
    'Select From List',
    'Select With Filter',
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
   * Composite filter group.
   *
   * @param fb Angular form builder
   * @param emailService helper functions
   * @param apollo Apollo server
   * @param snackbar snackbar helper function
   * @param translate i18 translate service
   */
  constructor(
    private fb: FormBuilder,
    public emailService: EmailService,
    private apollo: Apollo,
    public snackbar: SnackbarService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segment: [this.segmentList[0]], // Set the initial value to the first display type
      datasetSelect: '',
    });

    this.datasetsForm?.value?.datasets?.forEach((eleDataset: any) => {
      eleDataset.cacheData = {};
    });

    this.selectedEmails = this.emailBackLoad;
    this.datasets = this.datasetsForm.value.datasets;
    this.datasets?.forEach((ele: any) => {
      ele.blockName = ele.resource.name;
      // ele.name = ele.resource.name;
    });
    this.prepareDatasetFilters();
    if (this.emailFilter) {
      this.filterQuery = this.emailFilter;
      this.filterFields = this.filterQuery.get('filters') as FormArray;
      this.emailFilter.value?.filters.forEach((obj: any, index: number) => {
        this.setField(obj?.field, index);
      });
    }
    this.filterFields = this.filterQuery.get('filters') as FormArray;
  }

  /**
   * Retrieves the field type of the field.
   *
   * @param fieldIndex - Index of the field in graphql.
   * @returns field type
   */
  getFieldType(fieldIndex: number): string {
    const fieldControl = this.filterQuery.get('filters').at(fieldIndex);
    const fieldName = fieldControl ? fieldControl.value : null;
    let field = fieldName
      ? this.resource?.metadata?.find(
          (data: any) => data.name === fieldName.field
        )
      : null;
    if (field?.options === undefined) {
      field =
        this.emailService.fields.filter(
          (x: any) => x.name == fieldName.field.split('.')[0]
        ).length > 0
          ? this.emailService.fields.filter(
              (x: any) => x.name == fieldName.field.split('.')[0]
            )[0]
          : field;
    }
    // return field ? field.type : '';
    field = this.checkFieldDetails(field, fieldName);
    if (field && (field as FieldStore)?.select) {
      return 'select';
    }

    return field ? field.type : '';
  }

  /**
   *
   * @param field
   * @param fieldName
   */
  checkFieldDetails(field: any, fieldName: any) {
    if (field) {
      switch (field.type) {
        case TYPE_LABEL.resources:
          field = fieldName
            ? field.fields?.find(
                (data: any) => data.name === fieldName.field.split('.')[1]
              )
            : null;
          break;
        case TYPE_LABEL.resource:
          if (field.fields) {
            field = field?.fields?.find(
              (x: { name: any }) =>
                x.name.split(' - ')[1] === fieldName.field.split('.')[1]
            );
          }
          break;
      }
    }
    return field;
  }

  /**
   * Update input type of date editor.
   */
  public changeEditor(): void {
    this.useExpression = !this.useExpression;
  }

  /**
   *
   * @param field
   */
  getDataList(field: any): any {
    const info = field.resource;
    delete info.__typename;
    const data = this.data?.map((record: any) => {
      const flattenedObject = this.emailService.flattenRecord(
        record,
        info,
        field
      );
      field.fields.forEach((x: any) => {
        /**
         * Converts the resource field name back to {resourceName} - {resourceField}
         * so the field can be mapped to the correct data.
         */
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

    return data;
  }

  /**
   * Checks if the current field is date or time field.
   *
   * @param fieldIndex - Index of the field in graphql.
   * @returns true if the field is date or datetime
   */
  isDateOrDatetimeOperator(fieldIndex: number): boolean {
    const operators = ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'inthelast'];
    const fieldType = this.getFieldType(fieldIndex);
    const operatorControl = this.filterQuery
      .get('filters')
      .at(fieldIndex)
      .get('operator');
    const fieldOperator = operatorControl ? operatorControl.value : null;
    return (
      (fieldType === 'date' ||
        fieldType === 'datetime' ||
        fieldType === 'datetime-local') &&
      operators.includes(fieldOperator)
    );
  }

  /**
   * Checks if the selected field is a select field.
   *
   * @param fieldIndex The index of the field in the dataset filter.
   * @returns Returns true if the field is a select field, otherwise false.
   */
  public isSelectField(fieldIndex: number): boolean {
    return selectFieldTypes.indexOf(this.getFieldType(fieldIndex)) > -1;
  }

  /**
   * Retrieves field using index
   *
   * @param fieldIndex filter row index
   * @returns field object
   */
  getField(fieldIndex: number): any {
    const fieldControl = this.datasetFilterInfo.at(fieldIndex);
    const fieldName = fieldControl ? fieldControl.value : null;
    let field = fieldName
      ? this.resource?.metadata?.find(
          (data: any) => data.name === fieldName.field.split('.')[0]
        )
      : null;
    if (field?.options == undefined) {
      field =
        this.emailService.fields.filter(
          (x: any) => x.name == fieldName.field.split('.')[0]
        ).length > 0
          ? this.emailService.fields.filter(
              (x: any) => x.name == fieldName.field.split('.')[0]
            )[0]
          : field;
    }
    field = this.checkFieldDetails(field, fieldName);
    return field ?? '';
  }

  /**
   * Checks if the selected operator for a field is numeric.
   *
   * @param fieldIndex The index of the field in the dataset filter.
   * @returns Returns true if the operator is numeric, otherwise false.
   */
  isNumericOperator(fieldIndex: number): boolean {
    const operators = [
      'eq',
      'neq',
      'gte',
      'gt',
      'lte',
      'lt',
      'isnull',
      'isnotnull',
    ];
    const operatorControl = this.filterFields.at(fieldIndex).get('operator');
    const fieldOperator = operatorControl ? operatorControl.value : null;
    return (
      this.getFieldType(fieldIndex) === 'numeric' &&
      operators.includes(fieldOperator)
    );
  }

  /**
   * Returns an array of numbers from 1 to 90
   * for the "In the last" dropdown.
   *
   * @returns an array of numbers from 1 to 90.
   */
  getNumbersArray(): number[] {
    return Array.from({ length: 90 }, (_, i) => i + 1);
  }

  /**
   * To bind the dataset details
   *
   * @param dataset data of the data set
   */
  bindDataSetDetails(dataset: any): void {
    if (dataset === undefined) {
      this.dataList = [];
      this.resource = [];
      this.datasetFields = [];
      return;
    }
    if (
      Object.keys(dataset?.cacheData).length &&
      dataset?.cacheData.datasetResponse
    ) {
      this.loading = true;
      // const { dataList, resource, dataSetFields, dataSetResponse } =
      //   dataSet.cacheData;

      const { dataList, resource, datasetResponse } = dataset.cacheData;
      this.dataList = dataList;
      this.resource = resource;
      this.datasetFields = dataset.fields.map((ele: any) => ele.name); //datasetFields;
      this.dataset = datasetResponse;
      this.datasetEmails = datasetResponse?.records
        ?.map((record: { email: string }) => record.email)
        ?.filter(Boolean)
        ?.flat();
      this.emails = [...this.datasetEmails];
      if (this.emails.length === 0) {
        this.noEmail.emit(true);
      } else {
        this.noEmail.emit(false);
      }
      this.prevDataset = this.selectedDataset;
      this.emailService.setSelectedDataSet(dataset);
      this.loading = false;
    } else {
      this.loading = true;
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: dataset.resource.id,
          },
        })
        .subscribe((res) => {
          if (res?.data?.resource) {
            this.resource = res.data?.resource;
            dataset.pageSize = 50;
            this.emailService.fetchDataSet(dataset).subscribe((res) => {
              if (res?.data.dataset) {
                this.dataset = res?.data?.dataset;
                this.datasetEmails = res?.data?.dataset?.emails;
                this.data = res?.data?.dataset.records;
                this.datasetFields = dataset.fields.map((ele: any) => ele.name);
                this.dataList = this.getDataList(dataset);
                this.emails = [...this.datasetEmails];
                dataset.cacheData.datasetResponse = this.dataset;
                dataset.cacheData.dataList = this.dataList;
                dataset.cacheData.datasetFields = this.datasetFields;
                dataset.cacheData.resource = this.resource;

                //Below if condition is assigning the cachedData to the selected Dataset (Reinitializing)
                if (
                  this.datasetsForm.value?.datasets?.filter(
                    (x: any) => x.name === dataset.name
                  )?.length > 0
                ) {
                  this.datasetsForm.value.datasets.filter(
                    (x: any) => x.name === dataset.name
                  )[0].cacheData = dataset.cacheData;
                }
                this.prevDataset = this.selectedDataset;
                this.emailService.setSelectedDataSet(dataset);
              }
              this.loading = false;
            });
          }
        });
    }
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * get the keys of @data
   *
   * @param data datasetFields
   */
  getKeys(data: any) {
    return Object.keys(data);
  }

  /**
   * Operator Change for null and empty values.
   *
   * @param selectedOperator selected operator
   * @param filterData filter form (field, operator, value)
   */
  onOperatorChange(selectedOperator: string, filterData: any) {
    const operator = this.filterOperators.find(
      (x) => x.value === selectedOperator
    );
    if (operator?.disableValue) {
      filterData.get('hideEditor').setValue(true);
    } else {
      filterData.get('hideEditor').setValue(false);
    }
  }

  /**
   * Handles on display change event to set index
   *
   * @param event What is being displayed
   */
  onSegmentChange(event: any): void {
    const segment = event?.target?.value || event;
    this.activeSegmentIndex = this.segmentList.indexOf(segment);
  }

  /**
   * Set field.
   *
   * @param event field name
   * @param fieldIndex Index of field
   */
  public setField(event: any, fieldIndex: number) {
    const name = event?.target?.value || event;
    let fields = clone(this.resource?.metadata);
    if (fields?.options == undefined) {
      fields = this.emailService.fields.filter(
        (x: any) => x.name == name.split('.')[0]
      );
    }
    const field = fields.find(
      (x: { name: any }) => x.name === name.split('.')[0]
    );

    let type: { operators: any; editor: string; defaultOperator: string } = {
      operators: undefined,
      editor: '',
      defaultOperator: '',
    };

    if (field) {
      // Find the field type in FIELD_TYPES array
      const fieldType = FIELD_TYPES.find(
        (x) =>
          x.editor ===
          (field.type === TYPE_LABEL.datetime_local
            ? TYPE_LABEL.datetime
            : field.type || TYPE_LABEL.text)
      );

      if (fieldType) {
        type = {
          ...fieldType,
          ...field.filter,
        };
      }

      // Filter the FILTER_OPERATORS based on the operators allowed for the field type
      const fieldOperator = FILTER_OPERATORS.filter((x) =>
        type.operators.includes(x.value)
      );

      // Map the field index to its corresponding operators
      this.operators = {
        ...(this.operators && { ...this.operators }),
        [fieldIndex]: fieldOperator,
      };
    }
  }

  /**
   * Preparing dataset filters dynamically
   */
  prepareDatasetFilters(): void {
    this.filterQuery = this.fb.group({
      logic: 'and',
      filters: new FormArray([]),
    });
  }

  /**
   * To get the new dataset filter
   *
   *  @returns FormGroup
   */
  get getNewFilterFields(): FormGroup {
    return this.fb.group({
      field: [],
      operator: ['eq'],
      value: [],
      hideEditor: false,
      inTheLast: this.fb.group({
        number: [1],
        unit: ['days'],
      }),
    });
  }

  /**
   * Fetches a value from an object using a dot notation string.
   *
   * @param data - The object from which to fetch the value.
   * @param field - The dot notation string representing the object path.
   * @returns The object, or null if it doesn't exist.
   */
  fetchValue(data: any, field: string) {
    const keys = field.split('.');
    let result = data;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return null;
      }
    }

    return result;
  }

  /**
   * To
   *
   * @returns Form array
   */
  get datasetFilterInfo(): FormArray {
    return this.filterQuery.get('filters') as FormArray;
  }

  /**
   * To add new dataset filter in the form
   */
  addNewDatasetFilter(): void {
    // Filter Form values
    this.filterFields = this.filterQuery.get('filters') as FormArray;
    this.filterFields.push(this.getNewFilterFields);
  }

  /**
   * Remove filter at index
   *
   * @param index filter index
   */
  deleteDatasetFilter(index: number): void {
    this.datasetFilterInfo.removeAt(index);
  }

  /**
   * Remove email Id from the list
   *
   * @param chipIndex chip index
   */
  removeEmailChip(chipIndex: number): void {
    this.selectedEmails.splice(chipIndex, 1);
    this.listChange.emit();
  }

  /**
   * To add the selected emails
   *
   * @param emailIndex index of the email
   */
  addSelectiveEmails(emailIndex: number): void {
    const [email] = this.emails.splice(emailIndex, 1);
    if (!this.selectedEmails.includes(email)) {
      this.selectedEmails.push(email);
    }
    if (this.selectedEmails.length > 0) {
      this.emailLoad.emit({
        emails: this.selectedEmails,
        emailFilter: this.filterQuery,
      });
    }
  }

  /**
   * To add the selected emails manually
   *
   * @param element Input Element
   */
  addEmailManually(element: HTMLInputElement): void {
    if (
      emailRegex.test(element.value) &&
      !this.selectedEmails.includes(element?.value)
    ) {
      this.selectedEmails.push(element.value);
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
    }
  }

  /**
   * Validates the email address entered in the input element.
   *
   * @param element email string
   */
  validateEmail(element: HTMLInputElement): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValidationError = emailRegex.test(element.value)
      ? ''
      : 'Invalid Email Address';
    if (element.value === '') {
      this.emailValidationError = '';
    }
  }

  /**
   * To show/hide the dropdown content
   */
  toggleDropdown() {
    if (this.emails?.length) {
      this.selectedEmails.forEach((email: string) => {
        const indexToRemove = this.emails.indexOf(email);
        if (indexToRemove !== -1) {
          this.emails.splice(indexToRemove, 1);
        }
      });
    }
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  ngOnDestroy(): void {
    this.emailLoad.emit({
      emails: this.selectedEmails,
      emailFilter: this.filterQuery,
    });
  }

  /**
   * selecting all email items from the dataset list
   *
   * @param $event checkbox selection Event
   */
  selectAllEmailItems($event: any): void {
    this.isAllSelected = $event.target.checked;
    if (this.isAllSelected) {
      this.selectedItemIndexes = this.dataList?.map((_, index) => index);
    } else {
      this.selectedItemIndexes = [];
    }
  }

  /**
   * Email select
   *
   * @param rowIndex The index of the row in the table
   * @param $event The event triggered by the checkbox selection
   */
  selectUnselectIndividualEmails(rowIndex: number, $event: any): void {
    if ($event.target.checked) {
      this.selectedItemIndexes.push(rowIndex);
    } else {
      this.selectedItemIndexes = this.selectedItemIndexes?.map(
        (item: number) => {
          if (item !== rowIndex) {
            return item;
          } else {
            return undefined;
          }
        }
      );
    }
    this.isAllSelected = false;
  }

  /**
   * to add all the selected emails into the list
   */
  addSelectedEmails(): void {
    this.selectedItemIndexes?.forEach((indexNum, itemIndex: number) => {
      /* duplicate check */
      if (this.selectedEmails.indexOf(this.emails[itemIndex]) === -1) {
        if (itemIndex !== undefined && this.emails[itemIndex] !== undefined) {
          this.selectedEmails.push(this.emails[itemIndex]);
        }
      }
      const emailData = Object.values(this.data[indexNum]).filter((x: any) =>
        emailRegex.test(x)
      );
      this.selectedEmails = this.selectedEmails.concat(emailData);
    });
    this.selectedEmails = [...new Set(this.selectedEmails)];
    if (this.selectedEmails.length > 0) {
      this.emailLoad.emit({
        emails: this.selectedEmails,
        emailFilter: this.filterQuery,
      });
      this.noEmail.emit(false);
    } else {
      this.noEmail.emit(true);
    }
    this.selectedItemIndexes = [];
    this.isAllSelected = false;
  }

  /**
   * apply filter via dataset filters
   */
  applyFilter(): void {
    const filtersArray = this.filterQuery.get('filters') as FormArray;

    // Iterate over the filters and update the value for 'inthelast' operators
    filtersArray.controls.forEach((filterControl: AbstractControl) => {
      const filterFormGroup = filterControl as FormGroup;
      const operatorControl = filterFormGroup.get('operator');

      if (operatorControl && operatorControl.value === 'inthelast') {
        const inTheLastGroup = filterFormGroup.get('inTheLast') as FormGroup;
        if (inTheLastGroup) {
          const inTheLastNumberControl = inTheLastGroup.get('number');
          const inTheLastUnitControl = inTheLastGroup.get('unit');

          if (inTheLastNumberControl && inTheLastUnitControl) {
            const days = this.emailService.convertToMinutes(
              inTheLastNumberControl.value,
              inTheLastUnitControl.value
            );
            filterFormGroup.get('value')?.setValue(days);
          }
        }
      }
    });

    const filterObject = this.filterQuery.value;

    if (filterObject?.filters?.length && filterObject?.logic) {
      const { logic } = filterObject;
      let emailsList: any;
      if (logic === 'and') {
        emailsList = this.dataset?.records
          ?.map((data) => {
            if (
              filterObject.filters.every((filter: any) =>
                this.filterData(
                  filter.operator,
                  this.fetchValue(data, filter.field.replace(/-/g, '.'))
                    ?.toString()
                    .toLowerCase(),
                  filter?.value?.toLowerCase()
                )
              )
            ) {
              return data.email;
            }
          })
          ?.filter(Boolean);
      } else if (logic === 'or') {
        emailsList = this.dataset?.records
          ?.map((data) => {
            if (
              filterObject.filters.some(
                (filter: any) =>
                  data?.filter?.field &&
                  this.filterData(
                    filter.operator,
                    this.fetchValue(data, filter.field.replace(/-/g, '.'))
                      ?.toString()
                      .toLowerCase(),
                    filter?.value?.toLowerCase()
                  )
              )
            ) {
              return data.email;
            }
          })
          ?.filter(Boolean);
      }

      //Checking email in all Data
      //Checking email in all Data
      this.dataset?.records?.forEach((dataVal: any) => {
        const emailData = Object.values(dataVal).filter((x: any) =>
          emailRegex.test(x)
        );
        emailsList = emailsList.concat(emailData);
      });
      if (emailsList?.length) {
        this.selectedEmails = [
          ...new Set([...this.selectedEmails, ...emailsList]),
        ];
      }
      if (this.selectedEmails.length > 0) {
        this.emailLoad.emit({
          emails: this.selectedEmails,
          emailFilter: this.filterQuery,
        });
        this.noEmail.emit(false);
      } else {
        this.noEmail.emit(true);
      }
    }
  }

  /**
   * To clear the persisted data
   */
  clearDatasetSelection(): void {
    this.dataList = [];
    this.resource = [];
    this.datasetFields = [];
    this.filterFields = new FormArray([]);
    this.noEmail.emit(false);

    const filterConditionCount = this.datasetFilterInfo.controls.length;
    if (filterConditionCount !== 0) {
      for (
        let filterControlIndex = 0;
        filterControlIndex < filterConditionCount;
        filterControlIndex++
      ) {
        /* this should be always first index.
        if we remove element from form array element indexes will be automatically rearranging */
        this.datasetFilterInfo.removeAt(0);
      }
    }
  }
}
