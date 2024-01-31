import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { clone } from 'lodash';
import {
  Resource,
  ResourceQueryResponse,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { EmailService } from '../../email.service';
import { FIELD_TYPES, FILTER_OPERATORS } from '../../filter/filter.constant';
import { GET_RESOURCE, GET_RESOURCES } from '../../graphql/queries';
import { Subscription } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
/** Default items per query, for pagination */
let ITEMS_PER_PAGE = 0;
/**
 *
 */
@Component({
  selector: 'shared-dataset-filter',
  templateUrl: './dataset-filter.component.html',
  styleUrls: ['./dataset-filter.component.scss'],
})
export class DatasetFilterComponent implements OnInit, OnDestroy {
  @Input() activeTab: any;
  @Input() tabs: any;
  /** Filter and Fields Form */
  @Input() query: FormGroup | any;
  @Input() queryValue: FormGroup | any;
  showPreview = false;
  private datasetSaveSubscription?: Subscription;
  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  public fetchDataSet: any = this.emailService.fetchDataSet;
  /** FIELD VARIABLES */
  public resource!: Resource;
  public metaData!: any;
  public dataSetResponse: any;
  public dataSetFields!: any[];
  public selectedResourceId!: string;
  public dataList!: { [key: string]: any }[];
  /** FILTER VARIABLES */
  public searchSelectedField = '';
  public searchAvailableField = '';
  public filteredFields: any[] = [];
  public selectedFields!: { name: string; type: string }[];
  public filterFields!: { name: string; type: string }[];
  public availableFields!: { name: string; type: string }[];
  public operators: { [key: number]: { value: string; label: string }[] } = {};
  public showDatasetLimitWarning = false;
  public totalMatchingRecords = 0;
  /** FIELD TAB */
  public currentTabIndex = 0;
  /**  Changes from date picker to text expression */
  public useExpression = false;
  filterOperators = FILTER_OPERATORS;
  /** IN THE LAST TIME UNITS */
  public timeUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];

  @ViewChild('datasetPreview') datasetPreview: any;
  @Output() changeMainTab: EventEmitter<any> = new EventEmitter();
  @Output() navigateToPreview: EventEmitter<any> = new EventEmitter();
  public loading = false;
  fieldOptions: any;
  currentFieldName: any;
  showErrorMessage: any = '';

  /**
   * To use helper functions, Apollo serve
   *
   * @param emailService helper functions
   * @param apollo server
   * @param formGroup Angular form builder
   * @param snackBar snackbar helper function
   */
  constructor(
    public emailService: EmailService,
    private apollo: Apollo,
    private formGroup: FormBuilder,
    public snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    if (this.query.value.name == null) {
      const name = 'Block ' + (this.activeTab.index + 1);
      this.query.controls['name'].setValue(name);
    }
    if (this.query?.value?.resource?.id) {
      ITEMS_PER_PAGE = 70;
      this.getResourceDataOnScroll();
    } else if (
      !this.emailService?.resourcesNameId?.length ||
      (this.query?.value?.cacheData?.resource === undefined &&
        this.query?.value?.resource?.id)
    ) {
      ITEMS_PER_PAGE = 0;
      this.getResourceDataOnScroll();
    } else {
      if (this.query?.value?.resource?.id && this.metaData == undefined) {
        this.selectedResourceId = this.query?.value?.resource?.id;
        this.getResourceData(false);
      }
    }
    this.filteredFields = this.resource?.fields;
    if (this.query?.controls?.cacheData?.value) {
      const {
        dataList,
        resource,
        operators,
        dataSetFields,
        selectedFields,
        availableFields,
        filterFields,
        selectedResourceId,
      } = this.query.controls.cacheData.value;

      this.dataList = dataList;
      this.resource = resource;
      this.operators = operators;
      this.dataSetFields = dataSetFields;
      this.selectedFields = selectedFields;
      this.filterFields = filterFields;
      this.availableFields = availableFields;
      this.selectedResourceId = selectedResourceId;
    }

    this.datasetSaveSubscription = this.emailService.datasetSave.subscribe(
      (save) => {
        if (save) {
          this.getDataSet('preview');
        }
      }
    );
  }

  ngOnDestroy() {
    const cacheData = {
      dataList: this.dataList,
      resource: this.resource,
      operators: this.operators,
      dataSetFields: this.dataSetFields,
      selectedFields: this.selectedFields,
      availableFields: this.availableFields,
      filterFields: this.filterFields,
      dataSetResponse: this.dataSetResponse,
      selectedResourceId: this.selectedResourceId,
    };
    this.query.controls.cacheData.setValue(cacheData);

    if (this.datasetSaveSubscription) {
      this.datasetSaveSubscription.unsubscribe();
    }
  }

  /**
   * Handles Filter, Field, Style Tab selection changes
   *
   * @param event The tab selected
   */
  onTabSelect(event: any): void {
    const newIndex = event.index;
    const previousIndex = this.currentTabIndex;
    const filterTabIndex = 0;
    const fieldsTabIndex = 1;

    // Check if the current active tab is "Filter" and the selected tab is "Fields"
    if (newIndex === fieldsTabIndex && previousIndex === filterTabIndex) {
      this.getDataSet('filter');
    }
    this.currentTabIndex = newIndex;
  }

  /**
   * To fetch Resource Data On Scroll
   */
  getResourceDataOnScroll() {
    if (ITEMS_PER_PAGE > -1) {
      ITEMS_PER_PAGE =
        ITEMS_PER_PAGE > -1 ? ITEMS_PER_PAGE + 15 : ITEMS_PER_PAGE;
      this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
        query: GET_RESOURCES,
        variables: {
          first: ITEMS_PER_PAGE,
          sortField: 'name',
        },
      });
      if (this.resourcesQuery && ITEMS_PER_PAGE > -1) {
        this.loading = true;
        this.resourcesQuery.valueChanges.subscribe(({ data }) => {
          this.loading = false;
          ITEMS_PER_PAGE =
            ITEMS_PER_PAGE > data?.resources?.totalCount ? -1 : ITEMS_PER_PAGE;
          const resources =
            data?.resources?.edges?.map((edge) => edge.node) || [];
          this.emailService.resourcesNameId = resources.map((element) => {
            return { id: element?.id?.toString(), name: element?.name };
          });

          // Edit Mode data
          if (this.query?.value?.resource?.id) {
            this.selectedResourceId = this.query?.value?.resource?.id;
            const found = this.emailService.resourcesNameId.some(
              (resource) => resource.id === this.selectedResourceId
            );

            // Keeps scrolling until name is found
            if (!found && ITEMS_PER_PAGE !== -1) {
              this.getResourceDataOnScroll();
            }
            const resources =
              data?.resources?.edges?.map((edge) => edge.node) || [];
            this.emailService.resourcesNameId = resources.map((element) => {
              return { id: element?.id?.toString(), name: element?.name };
            });
            this.getResourceData(false);
          }
        });
      }
    }
  }

  /**
   * To fetch resource details
   *
   * @param fromHtml - If state is in edit mode then false else true if new notification (means Event from UI)
   */
  getResourceData(fromHtml: boolean) {
    this.availableFields = [];
    this.selectedFields = [];
    this.filterFields = [];
    fromHtml ? this.query.controls.fields.setValue([]) : '';
    this.showDatasetLimitWarning = false;
    this.emailService.disableSaveAndProceed.next(false);
    this.currentTabIndex = 0;
    if (this.selectedResourceId && this.emailService?.resourcesNameId?.length) {
      this.query.controls.resource.setValue(
        this.emailService.resourcesNameId.find(
          (element) => element.id === this.selectedResourceId
        )
      );
      this.resource = {};
      this.loading = true;
      this.showErrorMessage = '';
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: this.selectedResourceId,
          },
        })
        .subscribe((res) => {
          this.loading = false;
          this.resource = res.data.resource;
          this.metaData = res.data?.resource?.metadata;
          if (this.metaData?.length) {
            this.metaData.forEach((field: any) => {
              if (
                field &&
                !['matrix', 'matrixdynamic', 'matrixdropdown'].includes(
                  field.type
                )
              ) {
                if (field) {
                  if (field.name === 'createdBy' && field.fields?.length) {
                    field.fields.forEach((obj: any) => {
                      obj.name = '_createdBy.user.' + obj.name;
                      this.availableFields.filter((x) => x.name == obj.name)
                        .length === 0
                        ? this.availableFields.push(clone(obj))
                        : '';
                      obj.name = 'createdBy.' + obj.name.split('.')[2];
                      this.filterFields.push(obj);
                    });
                  } else if (
                    field.name === 'lastUpdatedBy' &&
                    field.fields?.length
                  ) {
                    field.fields.forEach((obj: any) => {
                      obj.name = '_lastUpdatedBy.user.' + obj.name;
                      this.availableFields.filter((x) => x.name == obj.name)
                        .length === 0
                        ? this.availableFields.push(clone(obj))
                        : '';
                      obj.name = 'lastUpdatedBy.' + obj.name.split('.')[2];
                      this.filterFields.push(obj);
                    });
                  } else if (
                    field.name === 'lastUpdateForm' &&
                    field.fields?.length
                  ) {
                    field.fields.forEach((obj: any) => {
                      obj.name = '_lastUpdateForm.' + obj.name;
                      this.availableFields.filter((x) => x.name == obj.name)
                        .length === 0
                        ? this.availableFields.push(clone(obj))
                        : '';
                      obj.name = 'lastUpdateForm.' + obj.name.split('.')[1];
                      this.filterFields.push(obj);
                    });
                  } else if (field.name === 'form' && field.fields?.length) {
                    field.fields.forEach((obj: any) => {
                      obj.name = '_form.' + obj.name;
                      this.availableFields.filter((x) => x.name == obj.name)
                        .length === 0
                        ? this.availableFields.push(clone(obj))
                        : '';
                      obj.name = 'form.' + obj.name.split('.')[1];
                      this.filterFields.push(obj);
                    });
                  } else if (field.type === 'resource') {
                    field.fields.forEach((obj: any) => {
                      obj.name = `${field.name}.${obj.name}`;
                      obj.type = 'resource';
                      this.availableFields.filter((x) => x.name == obj.name)
                        .length === 0
                        ? this.availableFields.push(clone(obj))
                        : '';
                      this.filterFields.push(obj);
                    });
                  } else {
                    this.availableFields =
                      this.availableFields == undefined
                        ? []
                        : this.availableFields;
                    this.filterFields =
                      this.filterFields == undefined ? [] : this.filterFields;
                    this.availableFields.filter((x) => x.name == field.name)
                      .length === 0 &&
                    this.selectedFields.filter((x) => x.name == field.name)
                      .length === 0
                      ? this.availableFields.push(clone(field))
                      : '';
                    this.filterFields.push(clone(field));
                  }
                  this.availableFields.sort((a, b) =>
                    a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
                  );
                }
              }
            });

            //Checking Edit mode data
            if (
              this.query?.controls?.fields?.value &&
              (this.selectedFields === undefined ||
                this.selectedFields.length === 0)
            ) {
              this.selectedFields =
                this.selectedFields === undefined ? [] : this.selectedFields;
              this.selectedFields =
                this.query?.controls?.fields?.value?.length > 0
                  ? this.query?.controls?.fields?.value
                  : this.selectedFields;
              this.query?.controls?.fields?.value?.forEach((fieldEle: any) => {
                this.addSelectedFields(fieldEle);
              });
            }

            if (this.query?.controls?.filter?.value) {
              this.query?.controls?.filter?.value?.filters?.forEach(
                (fValue: any, fIndex: number) => {
                  this.setField(fValue.field, fIndex);
                }
              );
            }
          }
          if (
            this.query?.value?.resource !== null &&
            !this.resource?.fields?.length
          ) {
            this.showErrorMessage = "Selected form doesn't contain any fields";
          }
        });
    } else {
      this.showErrorMessage = "Selected form doesn't contain any fields";
    }
  }

  /**
   * Retrieves the field type of the field.
   *
   * @param fieldIndex - Index of the field in graphql.
   * @returns field type
   */
  getFieldType(fieldIndex: number): string | undefined {
    const fieldControl = this.datasetFilterInfo.at(fieldIndex);
    const fieldName = fieldControl ? fieldControl.value : null;
    const field = fieldName
      ? this.resource?.metadata?.find(
          (data: any) => data.name === fieldName.field
        )
      : null;
    return field ? field.type : '';
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
    const operatorControl = this.datasetFilterInfo
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
    const operatorControl = this.datasetFilterInfo
      .at(fieldIndex)
      .get('operator');
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
   * Grabs filter row values.
   *
   *  @returns FormGroup
   */
  get getNewFilterFields(): FormGroup {
    return this.formGroup.group({
      field: [],
      operator: ['eq'],
      value: [],
      hideEditor: false,
      inTheLast: this.formGroup.group({
        number: [1],
        unit: ['days'],
      }),
    });
  }

  /**
   * Grabs the data from each dataset filter row.
   *
   * @returns Form array of dataset filters
   */
  get datasetFilterInfo(): FormArray {
    return this.query.get('filter').get('filters') as FormArray;
  }

  /**
   * To add new dataset filter in the form
   */
  addNewDatasetFilter(): void {
    this.datasetFilterInfo.push(this.getNewFilterFields);
  }

  /**
   * Remove filter at index
   *
   * @param index filter index
   */
  deleteDatasetFilter(index: number): void {
    this.datasetFilterInfo.removeAt(index);
    if (this.operators?.[index]) {
      delete this.operators[index];
    }

    //Updated Object key number as Operators missing in filter when we try to delete few of the filters
    const new_Operators: any[] = [];
    Object.keys(this.operators)
      .filter((op: any) => parseInt(op) < index)
      .forEach((ele: any) => {
        new_Operators[ele] = this.operators[ele];
      });
    Object.keys(this.operators)
      .filter((op: any) => parseInt(op) > index)
      .forEach((ele: any) => {
        if (parseInt(ele) !== 0) {
          const old_key = parseInt(ele);
          const new_key = old_key - 1;
          new_Operators[new_key] = this.operators[old_key];
        } else {
          new_Operators[ele] = this.operators[ele];
        }
      });
    this.operators = new_Operators;
  }

  /**
   * To add the selective fields in the layout
   *
   * @param inputString string
   * @returns modifiedSegments
   */
  removeUserString(inputString: any): any {
    if (inputString !== undefined) {
      const segments: string[] = inputString.split('.');
      const modifiedSegments: string[] = segments.map((segment) =>
        segment === 'user' ? '-' : segment
      );
      return modifiedSegments.join('.');
    }
  }

  /**
   * On the operator change
   *
   * @param selectedOperator string
   * @param filterData any
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
   * Sets field input box values.
   *
   * @param event field name
   * @param fieldIndex filter row index
   */
  public setField(event: any, fieldIndex: number) {
    const name = event?.target?.value || event;
    const fields = clone(this.metaData);
    const field = fields.find(
      (x: { name: any }) => x.name === name.split('.')[0]
    );
    let type: { operators: any; editor: string; defaultOperator: string } = {
      operators: undefined,
      editor: '',
      defaultOperator: '',
    };
    if (field) {
      const fieldType = FIELD_TYPES.find(
        (x) =>
          x.editor ===
          (field.type === 'datetime-local' ? 'datetime' : field.type || 'text')
      );
      if (fieldType) {
        type = {
          ...fieldType,
          ...field.filter,
        };
      }
      const fieldOperator = FILTER_OPERATORS.filter((x) =>
        type?.operators?.includes(x.value)
      );
      this.operators = {
        ...(this.operators && { ...this.operators }),
        [fieldIndex]: fieldOperator,
      };
    }
  }

  /**
   * To add the selective fields in the layout
   *
   * @param field string
   */
  addSelectedFields(field: any): void {
    const fieldExists = clone(this.query.value.fields) || [];
    const fieldExistsArray = fieldExists?.map((ele: any) => ele?.name);
    if (!fieldExistsArray.includes(field.name)) {
      fieldExists.push(field);
      this.query.controls.fields.setValue(fieldExists);
      this.selectedFields = fieldExists;
    }
    // Removes the selected field from the available fields list
    this.availableFields = this.availableFields
      .filter((f: { name: string }) => f.name !== field.name)
      .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1));
  }

  /**
   * This function removes selected fields from the block table.
   *
   * @param field The name of the field to remove.
   */
  removeSelectiveFields(field: any): void {
    const fieldExists = this.query.controls.fields.value || [];
    const index = fieldExists.findIndex(
      (f: { name: string }) => f.name === field.name
    );
    if (index !== -1) {
      fieldExists.splice(index, 1);
      this.query.controls.fields.setValue(fieldExists);
      this.selectedFields = fieldExists;
    }
    // Adds the deselected field back to the available fields list
    this.availableFields.push(field);

    this.availableFields.sort((a, b) =>
      a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
    );
  }

  /**
   * To get data set for the applied filters.
   *
   * @param tabName - The name of the tab for which to get the data set.
   */
  getDataSet(tabName?: any): void {
    if (
      this.query.controls['name'].value !== null &&
      this.query.controls['name'].value !== ''
    ) {
      if (this.query.get('filter') && this.query.get('filter').get('filters')) {
        const filtersArray = this.query
          .get('filter')
          .get('filters') as FormArray;

        // Iterate over the filters and update the value for 'inthelast' operators
        filtersArray.controls.forEach(
          (filterControl: AbstractControl, filterIndex: number) => {
            const filterFormGroup = filterControl as FormGroup;
            const operatorControl = filterFormGroup.get('operator');

            if (operatorControl && operatorControl.value === 'inthelast') {
              const inTheLastGroup = filterFormGroup.get(
                'inTheLast'
              ) as FormGroup;
              if (inTheLastGroup) {
                const inTheLastNumberControl = inTheLastGroup.get('number');
                const inTheLastUnitControl = inTheLastGroup.get('unit');

                if (inTheLastNumberControl && inTheLastUnitControl) {
                  const days = this.emailService.convertToMinutes(
                    inTheLastNumberControl.value,
                    inTheLastUnitControl.value
                  );
                  filterFormGroup.get('value')?.setValue(days);
                  this.queryValue[this.activeTab.index].filter.filters[
                    filterIndex
                  ].value = days;
                }
              }
            }
          }
        );
      }

      if (tabName == 'filter') {
        // this.datasetPreview.selectTab(1);
        const query = this.queryValue[this.activeTab.index];
        query.pageSize = 1;
        query.tabIndex = this.activeTab.index;
        this.loading = true;
        this.fetchDataSet(query).subscribe(
          (res: any) => {
            this.loading = false;
            this.totalMatchingRecords = res?.data?.dataSet?.totalCount;
            if (res?.data?.dataSet?.totalCount <= 50) {
              this.datasetPreview.selectTab(1);
              this.showDatasetLimitWarning = false;
              this.emailService.disableSaveAndProceed.next(false);
            } else {
              this.showDatasetLimitWarning = true;
              this.emailService.disableSaveAndProceed.next(true);
            }
          },
          (error: any) => {
            this.loading = false;
            this.showDatasetLimitWarning = false;
            this.emailService.disableSaveAndProceed.next(true);
            this.snackBar.openSnackBar(
              error?.message ?? 'Something Went Wrong',
              { error: true }
            );
          }
        );
      }
      if (
        tabName == 'fields' &&
        this.showPreview == false &&
        this.tabs.findIndex((x: any) => x.content == this.activeTab.content) <
          this.tabs.length - 1
      ) {
        this.changeMainTab.emit(
          this.tabs.findIndex((x: any) => x.content == this.activeTab.content) +
            1
        );
      }
      let allPreviewData: any = [];
      if (tabName == 'preview') {
        let count = 0;
        for (const query of this.queryValue) {
          if (count == 0) {
            this.loading = true;
          }
          query.tabIndex = count;
          count++;
          query.pageSize = 50;
          this.fetchDataSet(query).subscribe(
            (res: { data: { dataSet: any } }) => {
              if (res?.data?.dataSet) {
                this.dataSetResponse = res?.data?.dataSet;
                this.dataList = res?.data?.dataSet.records?.map(
                  (record: any) => {
                    const flattenedObject = this.flattenRecord(record);

                    delete flattenedObject.data;

                    const flatData = Object.fromEntries(
                      Object.entries(flattenedObject).filter(
                        ([, value]) => value !== null && value !== undefined
                      )
                    );

                    return flatData;
                  }
                );
                if (this.dataList?.length) {
                  const tempIndex = res?.data?.dataSet?.tabIndex;
                  this.dataSetFields = [
                    ...new Set(
                      this.queryValue[tempIndex].fields
                        .map((data: any) => data.name)
                        .flat()

                      // this.dataList
                      //   .map((data: { [key: string]: any }) =>
                      //     Object.keys(data)
                      //   )
                      //   .flat()
                    ),
                  ];
                }
                allPreviewData.push({
                  dataList: this.dataList,
                  dataSetFields: this.dataSetFields,
                  tabIndex: res?.data?.dataSet?.tabIndex,
                  tabName:
                    res?.data?.dataSet?.tabIndex < this.queryValue.length
                      ? this.queryValue[res.data.dataSet.tabIndex].name
                      : '',
                });
                if (this.tabs.length == allPreviewData.length) {
                  allPreviewData = allPreviewData.sort(
                    (a: any, b: any) => a.tabIndex - b.tabIndex
                  );
                  this.loading = false;
                  this.navigateToPreview.emit(allPreviewData);
                  this.emailService.setAllPreviewData(allPreviewData);
                }
              }
            }
          );
        }
      }
    } else {
      this.query.controls['name'].markAsTouched();
    }
    this.emailService.selectedDataSet = '';
    this.emailService.toEmailFilter = '';
    this.emailService.ccEmailFilter = '';
    this.emailService.bccEmailFilter = '';
  }

  /**
   * Update input type of date editor.
   */
  public changeEditor(): void {
    this.useExpression = !this.useExpression;
  }

  /**
   * Flattens the given record object into a single level object.
   *
   * @param record The record to flatten.
   * @returns The flattened record.
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
}
