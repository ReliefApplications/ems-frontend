import { GridService } from './../../../../services/grid/grid.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { clone, cloneDeep } from 'lodash';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { EmailService } from '../../email.service';
import {
  FIELD_TYPES,
  FILTER_OPERATORS,
  TYPE_LABEL,
} from '../../filter/filter.const';
import { GET_RESOURCES } from '../../graphql/queries';
import { Subscription, takeUntil } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { FieldStore } from '../../models/email.const';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { prettifyLabel } from '../../../../utils/prettify';
import { HttpClient } from '@angular/common/http';
import { RestService } from 'libs/shared/src/lib/services/rest/rest.service';
/** Default items per query, for pagination */
let ITEMS_PER_PAGE = 0;

/**
 * Component for filtering, selecting fields and styling block data sets.
 */
@Component({
  selector: 'shared-dataset-filter',
  templateUrl: './dataset-filter.component.html',
  styleUrls: ['./dataset-filter.component.scss'],
})
export class DatasetFilterComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Active tab in the component. */
  @Input() activeTab: any;
  /** Array of tabs in the component. */
  @Input() tabs: any;
  /** Query FormGroup used for filtering. */
  @Input() query: FormGroup | any;
  /** Value of the query FormGroup. */
  @Input() queryValue: FormGroup | any;
  /** Flag to control the visibility of the preview. */
  showPreview = false;
  /** Subscription to dataset saving. */
  private datasetSaveSubscription?: Subscription;
  /** GraphQL query reference for fetching resources. */
  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  /** Method to fetch data sets. */
  public fetchDataSet: any = this.emailService.fetchDataSet;
  /** Selected resource. */
  public resource!: Resource;
  /** Metadata of the selected resource. */
  public metaData!: any;
  /** Response of the data set. */
  public datasetResponse: any;
  /** Fields of the data set. */
  public datasetFields!: any[];
  /** Selected resource ID. */
  public selectedResourceId!: string;
  /** List of data. */
  public dataList!: { [key: string]: any }[];
  /** Selected search field. */
  public searchSelectedField = '';
  /** Available search field. */
  public searchAvailableField = '';
  /** Filtered fields for search. */
  public filteredFields: any[] = [];
  /** Selected fields for filtering. */
  public selectedFields: any[] = [];
  /** Fields for filtering. */
  public filterFields: any[] = [];
  /** Available fields for filtering. */
  public availableFields: any[] = [];
  /** Operators for filtering. */
  public operators: { [key: number]: { value: string; label: string }[] } = {};
  /** Flag to show the dataset limit warning. */
  public showDatasetLimitWarning = false;
  /** Total number of matching records. */
  public totalMatchingRecords = 0;
  /** Current tab index. */
  public currentTabIndex = 0;
  /** Flag to switch between date picker and text expression. */
  public useExpression = false;
  /** Filter operators from filter constant */
  filterOperators = FILTER_OPERATORS;
  /** Flag for sending individual emails */
  public separateEmail = false;
  /** Disabled fields list */
  public disabledFields: string[] = [];
  /** Disabled fields type list */
  public disabledTypes: string[] = [];
  /** Type labels */
  public TYPE_LABEL = TYPE_LABEL;
  /** Time units for filtering. */
  public timeUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];
  /** Dataset preview ViewChild. */
  @ViewChild('datasetPreview') datasetPreview: any;
  /** Event emitter for changing the main tab. */
  @Output() changeMainTab: EventEmitter<any> = new EventEmitter();
  /** Navigate to dataset preview screen emitter */
  @Output() navigateToPreview: EventEmitter<any> = new EventEmitter();
  /** Loading status. */
  public loading = false;
  /** Field options. */
  fieldOptions: any;
  /** Current field name. */
  currentFieldName: any;
  /** Validation error message */
  showErrorMessage: any = '';
  /** Index of current highlighted field from selected field list */
  selectedFieldIndex: number | null = null;
  /** Index of current highlighted field from available field list */
  availableFieldIndex: number | null = null;
  /** Resource Populated Check */
  resourcePopulated = false;
  /** Checks if data is fully loaded */
  loadingCheck = true;
  /** Meta query reference for fetching metadata. */
  private metaFieldList!: any;
  /** Metadata fields for the grid. */
  private metaFields: any;

  /**
   * To use helper functions, Apollo serve
   *
   * @param emailService helper functions
   * @param apollo server
   * @param formGroup Angular form builder
   * @param snackBar snackbar helper function
   * @param queryBuilder Shared query builder service
   * @param gridService Shared grid service
   * @param http
   * @param restService
   */
  constructor(
    public emailService: EmailService,
    private apollo: Apollo,
    private formGroup: FormBuilder,
    public snackBar: SnackbarService,
    public queryBuilder: QueryBuilderService,
    public gridService: GridService,
    private http: HttpClient,
    private restService: RestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.query.controls.query
      .get('resource')
      .valueChanges.pipe(takeUntil(this.destroy$))
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
    this.query.controls.name.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data === null) {
          this.emailService.title.next(this.activeTab.title);
        } else {
          this.emailService.title.next(data);
        }
        this.emailService.index.next(this.activeTab.index);
      });
    // this.query.get('individualEmail').disable();
    this.separateEmail = this.emailService.updateSeparateEmail(
      this.activeTab.index
    );
    if (this.query.value.name == null) {
      const name = 'Block ' + (this.activeTab.index + 1);
      this.query.controls['name'].setValue(name);
    }
    if (this.query.controls.query.get('resource')?.id) {
      ITEMS_PER_PAGE = 400;
      this.getResourceDataOnScroll();
    } else if (
      !this.emailService?.resourcesNameId?.length ||
      (this.query?.get('query')?.value?.cacheData?.resource === undefined &&
        this.query?.get('query')?.value?.resource?.id)
    ) {
      ITEMS_PER_PAGE = 0;
      this.getResourceDataOnScroll();
    } else {
      if (
        this.query?.get('query')?.value?.resource?.id &&
        this.metaData == undefined
      ) {
        this.selectedResourceId = this.query?.get('query')?.value?.resource?.id;
        this.getResourceData(false);
      }
    }
    this.filteredFields = this.resource?.fields;
    if (this.query.controls.query.get('cacheData').value) {
      const {
        dataList,
        resource,
        operators,
        datasetFields,
        selectedFields,
        availableFields,
        filterFields,
        selectedResourceId,
      } = this.query.controls.query.get('cacheData').value;

      this.dataList = dataList;
      this.resource = resource;
      this.operators = operators;
      this.datasetFields = datasetFields;
      this.selectedFields = selectedFields;
      this.filterFields = filterFields;
      this.availableFields = availableFields;
      this.selectedResourceId = selectedResourceId;
    }
    // Saves Dataset form form when called.
    this.datasetSaveSubscription = this.emailService.datasetSave.subscribe(
      (save) => {
        if (save) {
          this.getDataSet('preview');
        }
      }
    );
  }

  override ngOnDestroy() {
    const cacheData = {
      dataList: this.dataList,
      resource: this.resource,
      operators: this.operators,
      datasetFields: this.datasetFields,
      selectedFields: this.selectedFields,
      availableFields: this.availableFields,
      filterFields: this.filterFields,
      datasetResponse: this.datasetResponse,
      selectedResourceId: this.selectedResourceId,
    };
    this.query.controls.query.get('cacheData')?.setValue(cacheData);

    // Safely destroys dataset save subscription
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
    const newIndex = event;
    // const previousIndex = this.currentTabIndex;
    // const filterTabIndex = 0;
    // const fieldsTabIndex = 1;

    // // Check if the current active tab is "Filter" and the selected tab is "Fields"
    // if (newIndex === fieldsTabIndex && previousIndex === filterTabIndex) {
    //   this.getDataSet('filter');
    // }
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
        this.loadingCheck = true;
        this.resourcesQuery.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ data }) => {
            this.loading = false;
            this.loadingCheck = false;
            ITEMS_PER_PAGE =
              ITEMS_PER_PAGE > data?.resources?.totalCount
                ? -1
                : ITEMS_PER_PAGE;
            const resources =
              data?.resources?.edges?.map((edge) => edge.node) || [];
            this.emailService.resourcesNameId = resources.map((element) => {
              return { id: element?.id?.toString(), name: element?.name };
            });

            // Edit Mode data
            if (this.query?.get('query')?.value?.resource?.id) {
              this.selectedResourceId =
                this.query?.get('query')?.value?.resource?.id;
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
    this.resourcePopulated = false;
    this.loading = true;
    this.loadingCheck = true;
    this.availableFields = [];
    this.selectedFields = [];
    this.filterFields = [];
    if (fromHtml) {
      this.query.controls.query.value.fields = [];
      this.query.controls.query.get('fields').value = [];
    }
    this.showDatasetLimitWarning = false;
    this.emailService.disableSaveAndProceed.next(true);
    this.emailService.disableSaveAsDraft.next(false);
    this.disabledFields = [];
    this.disabledTypes = [];
    this.currentTabIndex = 0;
    this.resetQuery(this.query.get('query'));
    if (this.selectedResourceId && this.emailService?.resourcesNameId?.length) {
      // this.query.controls.resource.setValue(
      //   this.emailService.resourcesNameId.find(
      //     (element) => element.id === this.selectedResourceId
      //   )
      // );
      this.emailService
        .fetchResourceData(this.selectedResourceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          const queryTemp: any = data.resource;
          const newData = this.queryBuilder.getFields(queryTemp.queryName);
          this.query.controls.query.get('name').setValue(queryTemp.queryName);
          this.availableFields = newData;
          this.filterFields = cloneDeep(newData);
          this.loading = false;
          this.resourcePopulated = true;
          this.resource = data.resource;
          this.metaData = data?.resource?.metadata;
        });
      // let fields: any[] | undefined = [];
      // this.emailService
      //   .fetchResourceMetaData(this.selectedResourceId)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe(({ data }) => {
      //     fields = data?.resource?.metadata;
      //     this.resource = {};
      //     this.loading = true;
      //     this.loadingCheck = true;
      //     this.showErrorMessage = '';
      //     this.apollo
      //       .query<ResourceQueryResponse>({
      //         query: GET_RESOURCE,
      //         variables: {
      //           id: this.selectedResourceId,
      //         },
      //       })
      //       .pipe(takeUntil(this.destroy$))
      //       .subscribe(({ data }) => {
      //         this.loading = false;
      //         this.loadingCheck = false;
      //         this.resource = data.resource;
      //         this.metaData = data?.resource?.metadata;
      //         if (this.metaData?.length) {
      //           this.metaData.forEach((field: any) => {
      //             if (
      //               field &&
      //               !['matrix', 'matrixdynamic', 'matrixdropdown'].includes(
      //                 field.type
      //               )
      //             ) {
      //               if (field) {
      //                 if (
      //                   field.name === FIELD_NAME.createdBy &&
      //                   field.fields?.length
      //                 ) {
      //                   field.fields.forEach((obj: any) => {
      //                     obj.name =
      //                       `_${FIELD_NAME.createdBy}.user.` +
      //                       `${obj.name === 'id' ? '_id' : obj.name}`;
      //                     this.availableFields.filter((x) => x.name == obj.name)
      //                       .length === 0
      //                       ? this.availableFields.push(clone(obj))
      //                       : '';
      //                     obj.name =
      //                       `${FIELD_NAME.createdBy}.` + obj.name.split('.')[2];
      //                     this.filterFields.push(obj);
      //                   });
      //                 } else if (
      //                   field.name === FIELD_NAME.lastUpdatedBy &&
      //                   field.fields?.length
      //                 ) {
      //                   field.fields.forEach((obj: any) => {
      //                     obj.name =
      //                       `_${FIELD_NAME.lastUpdatedBy}.user.` +
      //                       `${obj.name === 'id' ? '_id' : obj.name}`;
      //                     this.availableFields.filter((x) => x.name == obj.name)
      //                       .length === 0
      //                       ? this.availableFields.push(clone(obj))
      //                       : '';
      //                     obj.name =
      //                       `${FIELD_NAME.lastUpdatedBy}.` +
      //                       obj.name.split('.')[2];
      //                     this.filterFields.push(obj);
      //                   });
      //                 } else if (
      //                   field.name === 'lastUpdateForm' &&
      //                   field.fields?.length
      //                 ) {
      //                   field.fields.forEach((obj: any) => {
      //                     obj.name = '_lastUpdateForm.' + obj.name;
      //                     this.availableFields.filter((x) => x.name == obj.name)
      //                       .length === 0
      //                       ? this.availableFields.push(clone(obj))
      //                       : '';
      //                     obj.name = 'lastUpdateForm.' + obj.name.split('.')[1];
      //                     this.filterFields.push(obj);
      //                   });
      //                 } else if (
      //                   field.name === 'form' &&
      //                   field.fields?.length
      //                 ) {
      //                   field.fields.forEach((obj: any) => {
      //                     obj.name = '_form.' + obj.name;
      //                     this.availableFields.filter((x) => x.name == obj.name)
      //                       .length === 0
      //                       ? this.availableFields.push(clone(obj))
      //                       : '';
      //                     obj.name = 'form.' + obj.name.split('.')[1];
      //                     this.filterFields.push(obj);
      //                   });
      //                 } else if (field.type === TYPE_LABEL.resource) {
      //                   if (field.fields) {
      //                     field.fields.forEach((obj: any) => {
      //                       obj.parentName = field.name;
      //                       if (
      //                         obj.name === FIELD_NAME.createdBy ||
      //                         obj.name === FIELD_NAME.lastUpdatedBy
      //                       ) {
      //                         const obj1 = cloneDeep(obj);
      //                         obj1.childName = `${field.name} - _${obj.name}.user.username`;
      //                         obj1.name = `${field.name} - _${obj.name}.user.username`;
      //                         obj1.parentName = field.name;
      //                         obj1.type = 'text';
      //                         this.availableFields.filter(
      //                           (x) => x.name == obj1.name
      //                         ).length === 0
      //                           ? this.availableFields.push(obj1)
      //                           : '';

      //                         // Create and push the second object
      //                         const obj2 = cloneDeep(obj);
      //                         obj2.name = `${field.name} - _${obj.name}.user._id`;
      //                         obj2.childName = `${field.name} - _${obj.name}.user._id`;
      //                         obj2.parentName = field.name;
      //                         obj2.type = 'text';
      //                         this.availableFields.filter(
      //                           (x) => x.name == obj2.name
      //                         ).length === 0
      //                           ? this.availableFields.push(obj2)
      //                           : '';

      //                         // Create and push the third object
      //                         const obj3 = cloneDeep(obj);
      //                         obj3.name = `${field.name} - _${obj.name}.user.name`;
      //                         obj3.childName = `${field.name} - _${obj.name}.user.name`;
      //                         obj3.parentName = field.name;
      //                         obj3.type = 'text';
      //                         this.availableFields.filter(
      //                           (x) => x.name == obj3.name
      //                         ).length === 0
      //                           ? this.availableFields.push(obj3)
      //                           : '';
      //                         obj.fields = [];
      //                         obj.fields?.filter((x: any) => x.name == obj.name)
      //                           .length === 0
      //                           ? obj.fields.push(clone(obj1))
      //                           : '';
      //                         obj.fields?.filter((x: any) => x.name == obj.name)
      //                           .length === 0
      //                           ? obj.fields.push(clone(obj2))
      //                           : '';
      //                         obj.fields?.filter((x: any) => x.name == obj.name)
      //                           .length === 0
      //                           ? obj.fields.push(clone(obj3))
      //                           : '';
      //                         obj.childName = field.name + ' - ' + obj.name;
      //                         obj.name = field.name + ' - ' + obj.name;
      //                       } else {
      //                         obj.childName = field.name + ' - ' + obj.name;
      //                         obj.name = field.name + ' - ' + obj.name;
      //                         this.availableFields.filter(
      //                           (x) => x.name == obj.name
      //                         ).length === 0
      //                           ? this.availableFields.push(clone(obj))
      //                           : '';
      //                       }
      //                     });
      //                   } else {
      //                     this.availableFields.filter(
      //                       (x) => x.name == field.name
      //                     ).length === 0
      //                       ? this.availableFields.push(clone(field))
      //                       : '';
      //                   }

      //                   this.filterFields.push(field);
      //                 } else if (field.type === TYPE_LABEL.resources) {
      //                   this.availableFields.filter((x) => x.name == field.name)
      //                     .length === 0
      //                     ? this.availableFields.push(clone(field))
      //                     : '';
      //                   this.filterFields.push(field);
      //                 } else {
      //                   const metaField = fields?.find(
      //                     (x: any) => x.name === field.name
      //                   );
      //                   // Map Select Data to select fields if it exists
      //                   field.options = metaField.options;
      //                   field.multiSelect = metaField.multiSelect;
      //                   field.fields = metaField.fields ?? null;
      //                   field.select = metaField.editor === 'select';
      //                   this.availableFields.filter((x) => x.name == field.name)
      //                     ? this.availableFields.push(clone(field))
      //                     : '';
      //                   this.filterFields.push(clone(field));
      //                 }
      //               }
      //               this.availableFields = this.availableFields ?? [];
      //               this.filterFields = this.filterFields ?? [];
      //               this.availableFields?.sort((a, b) =>
      //                 a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
      //               );
      //             } else {
      //               this.disabledFields.push(field.name);
      //               this.disabledTypes.push(field.type);
      //               this.disabledTypes = [...new Set(this.disabledTypes)];
      //             }
      //           });

      //           //Checking Edit mode data
      //           if (
      //             this.query?.controls?.fields?.value &&
      //             (this.selectedFields === undefined ||
      //               this.selectedFields.length === 0)
      //           ) {
      //             this.selectedFields =
      //               this.selectedFields === undefined
      //                 ? []
      //                 : this.selectedFields;
      //             this.selectedFields =
      //               this.query?.controls?.fields?.value?.length > 0
      //                 ? this.query?.controls?.fields?.value
      //                 : this.selectedFields;
      //             this.query?.controls?.fields?.value?.forEach(
      //               (fieldEle: any) => {
      //                 this.populateFields(fieldEle);
      //               }
      //             );
      //           }

      //           if (this.query?.controls?.filter?.value) {
      //             this.query?.controls?.filter?.value?.filters?.forEach(
      //               (fValue: any, fIndex: number) => {
      //                 this.setField(fValue.field, fIndex);
      //                 this.emailService.disableSaveAndProceed.next(false);
      //               }
      //             );
      //           }
      //         }
      //         this.resourcePopulated = true;
      //       });
      //   });
    } else {
      this.loading = false;
    }
  }

  /**
   * Reinitialises and resets Dataset Form values
   *
   * @param query - Dataset Form Group
   */
  resetQuery(query: FormGroup) {
    const fields = query.get('fields') as FormArray;
    fields.clear();

    const filter = query.get('filter') as FormGroup;
    const filters = filter.get('filters') as FormArray;
    filters.clear();
    filters.push(this.getNewFilterFields);

    query.get('name')?.setValue('');
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
    let field = fieldName
      ? this.resource?.metadata?.find(
          (data: any) => data.name === fieldName.field.split('.')[0]
        )
      : null;
    if (field && field?.type === TYPE_LABEL.resources) {
      field = fieldName
        ? field.fields?.find(
            (data: any) => data.name === fieldName.field.split('.')[1]
          )
        : null;
    }
    if (field && field.type === TYPE_LABEL.resource) {
      if (field.fields) {
        field = field?.fields?.find(
          (x: { name: any }) =>
            x.name.split(' - ')[1] === fieldName.field.split('.')[1]
        );
      }
    }
    if (field && (field as FieldStore)?.select) {
      return 'select';
    }

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
      (fieldType === TYPE_LABEL.date ||
        fieldType === TYPE_LABEL.datetime ||
        fieldType === TYPE_LABEL.datetime_local) &&
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
   * Checks if the selected field is a select field.
   *
   * @param fieldIndex The index of the field in the dataset filter.
   * @returns Returns true if the field is a select field, otherwise false.
   */
  isSelectField(fieldIndex: number): boolean {
    return this.getFieldType(fieldIndex) === 'select';
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
    return this.query.controls.query.get('filter').get('filters') as FormArray;
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
   * Maps operator to the correct operator value,
   * and enables or disables value input box.
   *
   * @param selectedOperator Filter Operator that has been selected
   * @param filterData Filter form data.
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
    let field = fields.find(
      (x: { name: any }) => x.name === name.split('.')[0]
    );
    if (field && field.type === TYPE_LABEL.resources) {
      const child = name.split('.')[1];
      if (field.fields) {
        field = field?.fields.find((x: { name: any }) => x.name === child);
      }
    }

    if (field && field.type === TYPE_LABEL.resource) {
      if (field.fields) {
        field =
          field?.fields.find(
            (x: { name: any }) => x.name.split(' - ')[1] === name.split('.')[1]
          ) ?? field;
      }
    }
    let type: { operators: any; editor: string; defaultOperator: string } = {
      operators: undefined,
      editor: '',
      defaultOperator: '',
    };
    if (field) {
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
   * Retrieves field using index
   *
   * @param fieldIndex filter row index
   * @returns field object
   */
  getField(fieldIndex: number): any {
    const fieldControl = this.datasetFilterInfo.at(fieldIndex);
    const fieldName = fieldControl ? fieldControl.value : null;
    let field: any = fieldName
      ? this.resource?.metadata?.find(
          (data: any) => data.name === fieldName.field.split('.')[0]
        )
      : null;
    if (field && field?.type === TYPE_LABEL.resources) {
      field = fieldName
        ? field.fields?.find(
            (data: any) => data.name === fieldName.field.split('.')[1]
          )
        : null;
    }
    if (field && field.type === TYPE_LABEL.resource) {
      if (field.fields) {
        field = field?.fields?.find(
          (x: { name: any }) =>
            x.name.split(' - ')[1] === fieldName.field.split('.')[1]
        );
      }
    }

    /* Reference data - options manipulation */

    if (fieldName?.field?.includes('.')) {
      const fieldParts = fieldName?.field?.split('.');
      const optionsKey = fieldParts[fieldParts.length - 1];
      field.options = field?.fields
        ? field.fields.filter((x: any) => x.name === optionsKey)[0].options
        : null;
    }
    return field ?? '';
  }

  /**
   * To add the selective fields in the layout
   *
   * @param field to be added to list
   */
  populateFields(field: any): void {
    const fieldExists = clone(this.query?.get('query')?.value?.fields) || [];
    const fieldExistsArray = fieldExists?.map((ele: any) => ele?.name);
    if (!fieldExistsArray.includes(field.name)) {
      fieldExists.push(field);
      this.query.controls.query.get('fields').setValue(fieldExists);
      this.selectedFields = fieldExists;
    }
    // Removes the selected field from the available fields list
    this.availableFields = this.availableFields
      .filter((f: { name: string }) => f.name !== field.name)
      .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1));
    this.emailService.setEmailFields(this.selectedFields);
  }

  /**
   * Adds field from available field to selected field list.
   */
  addSelectedField(): void {
    if (this.availableFieldIndex !== null) {
      this.emailService.disableSaveAndProceed.next(
        !(
          this.totalMatchingRecords <= 50 &&
          this.query?.controls['name'].value !== ''
        )
      );
      this.emailService.disableSaveAsDraft.next(
        !(
          this.totalMatchingRecords <= 50 &&
          this.query?.controls['name'].value !== ''
        )
      );
      const field = this.availableFields[this.availableFieldIndex];
      this.selectedFields.push(field);
      this.availableFields.splice(this.availableFieldIndex, 1);
      this.availableFields = this.availableFields.sort((a, b) =>
        a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
      );
      this.availableFieldIndex = null;
      this.selectedFieldIndex = this.selectedFields.length - 1;
      this.query.controls.query.get('fields').setValue(this.selectedFields);
      this.emailService.setEmailFields(this.selectedFields);
    }
  }

  /**
   * This function removes selected fields from the block table.
   *
   * @param index index of field to remove
   */
  removeSelectiveFields(index: number | null): void {
    if (index !== null) {
      const field = this.selectedFields[index];
      const fieldExists = this.query.controls.query.get('fields').value || [];
      const fieldIndex = fieldExists.findIndex(
        (f: { name: string }) => f.name === field.name
      );
      if (fieldIndex !== -1) {
        fieldExists.splice(fieldIndex, 1);
        this.query.controls.query.get('fields').setValue(fieldExists);
        this.selectedFields = fieldExists;
      }
      // Remove the field from the selectedFields array
      this.selectedFields = this.selectedFields.filter(
        (f: { name: string }) => f.name !== field.name
      );
      if (this.selectedFields.length) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      } else {
        this.emailService.disableSaveAndProceed.next(true);
        this.emailService.disableSaveAsDraft.next(true);
      }
      // Adds the deselected field back to the available fields list
      this.availableFields.push(field);
      this.availableFields = this.availableFields.sort((a, b) =>
        a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
      );

      // Set the availableFieldsIndex to the index of the field in the availableFields list
      this.availableFieldIndex = this.availableFields.findIndex(
        (f) => f.name === field.name
      );
      this.selectedFieldIndex = null; // Reset the selected field index
      this.emailService.setEmailFields(this.selectedFields);
    }
  }

  /**
   * Moves all selected fields back into available fields list.
   */
  removeAllSelectedFields(): void {
    this.emailService.disableSaveAndProceed.next(true);
    this.emailService.disableSaveAsDraft.next(true);
    this.availableFields = [
      ...this.availableFields,
      ...this.selectedFields.map((field: FieldStore) =>
        JSON.parse(JSON.stringify(field))
      ),
    ];
    this.selectedFields = [];
    this.availableFields.sort((a, b) =>
      a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
    );
    this.query.controls.query.get('fields').setValue(this.selectedFields);
    this.emailService.setEmailFields(this.selectedFields);
  }

  /**
   * Moves all available fields into selected fields list.
   */
  addAllAvailableFields(): void {
    this.selectedFields = [
      ...this.selectedFields,
      ...this.availableFields.map((field) => JSON.parse(JSON.stringify(field))),
    ];
    if (
      this.query?.controls['name'].value !== '' &&
      !this.showDatasetLimitWarning
    ) {
      this.emailService.disableSaveAndProceed.next(false);
      this.emailService.disableSaveAsDraft.next(false);
    }
    this.availableFields = [];
    this.query.controls.query.get('fields').setValue(this.selectedFields);
    this.emailService.setEmailFields(this.selectedFields);
  }

  /**
   * Moves field up in selected fields list.
   *
   * @param index of field to be moved up
   */
  moveUp(index: number | null): void {
    if (index && index > 0) {
      const field = this.selectedFields[index];
      this.selectedFields.splice(index, 1);
      this.selectedFields.splice(index - 1, 0, field);
      this.selectedFieldIndex = index - 1;
      this.query.controls.query.get('fields').setValue(this.selectedFields);
    }
  }

  /**
   * Moves field down in selected fields list.
   *
   * @param index of field to be moved down.
   */
  moveDown(index: number | null): void {
    if (index !== null && index < this.selectedFields.length - 1) {
      const field = this.selectedFields[index];
      this.selectedFields.splice(index, 1);
      this.selectedFields.splice(index + 1, 0, field);
      this.selectedFieldIndex = index + 1;
      this.query.controls.query.get('fields').setValue(this.selectedFields);
    }
  }

  /**
   * Moves field in selected fields list to top of list.
   *
   * @param index of field to be moved to top.
   */
  moveTop(index: number | null): void {
    if (index !== null && index > 0) {
      const field = this.selectedFields[index];
      this.selectedFields.splice(index, 1);
      this.selectedFields.splice(0, 0, field);
      this.selectedFieldIndex = 0;
      this.query.controls.query.get('fields').setValue(this.selectedFields);
    }
  }

  /**
   * Moves field in selected fields list to bottom of list.
   *
   * @param index of field to be moved to bottom.
   */
  moveBottom(index: number | null): void {
    if (index !== null) {
      const field = this.selectedFields[index];
      this.selectedFields.splice(index, 1);
      this.selectedFields.push(field);
      this.selectedFieldIndex = this.selectedFields.length - 1;
      this.query.controls.query.get('fields').setValue(this.selectedFields);
    }
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
      // if (this.query.get('filter') && this.query.get('filter').get('filters')) {
      //   const filtersArray = this.query
      //     .get('filter')
      //     .get('filters') as FormArray;

      //   // Iterate over the filters and update the value for 'inthelast' operators
      //   filtersArray.controls.forEach(
      //     (filterControl: AbstractControl, filterIndex: number) => {
      //       const filterFormGroup = filterControl as FormGroup;
      //       const operatorControl = filterFormGroup.get('operator');

      //       if (operatorControl && operatorControl.value === 'inthelast') {
      //         const inTheLastGroup = filterFormGroup.get(
      //           'inTheLast'
      //         ) as FormGroup;
      //         if (inTheLastGroup) {
      //           const inTheLastNumberControl = inTheLastGroup.get('number');
      //           const inTheLastUnitControl = inTheLastGroup.get('unit');

      //           if (inTheLastNumberControl && inTheLastUnitControl) {
      //             const days = this.emailService.convertToMinutes(
      //               inTheLastNumberControl.value,
      //               inTheLastUnitControl.value
      //             );
      //             // Sets filter value to the in the last filter converted to minutes.
      //             filterFormGroup.get('value')?.setValue(days);
      //             this.queryValue[this.activeTab.index].filter.filters[
      //               filterIndex
      //             ].value = days;
      //           }
      //         }
      //       }
      //     }
      //   );
      // }

      if (tabName == 'filter') {
        if (this.selectedFields.length) {
          this.emailService.disableSaveAndProceed.next(false);
          this.emailService.disableSaveAsDraft.next(false);
        } else {
          this.emailService.disableSaveAndProceed.next(true);
          this.emailService.disableSaveAsDraft.next(true);
        }
        this.onTabSelect(1);
        // const query = this.queryValue[this.activeTab.index];
        // query.pageSize = 1;
        // query.tabIndex = this.activeTab.index;
        // this.loading = true;
        // this.loadingCheck = false;
        // /**
        //  Fetches the data records for selected fields
        // (by default its all records in the resource).
        //  */
        // this.fetchDataSet(query)
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe(
        //     (res: any) => {
        //       this.loading = false;
        //       this.loadingCheck = false;
        //       this.totalMatchingRecords = res?.data?.dataset?.totalCount;
        //       if (this.totalMatchingRecords <= 50) {
        //         this.datasetPreview.selectTab(1);
        //         this.showDatasetLimitWarning = false;
        //         if (this.selectedFields.length) {
        //           this.emailService.disableSaveAndProceed.next(false);
        //           this.emailService.disableSaveAsDraft.next(false);
        //         } else {
        //           this.emailService.disableSaveAndProceed.next(true);
        //           this.emailService.disableSaveAsDraft.next(true);
        //         }
        //       } else {
        //         this.showDatasetLimitWarning = true;
        //         this.emailService.disableSaveAndProceed.next(true);
        //         this.emailService.disableSaveAsDraft.next(true);
        //       }
        //     },
        //     (error: any) => {
        //       this.loading = false;
        //       this.loadingCheck = false;
        //       this.showDatasetLimitWarning = false;
        //       this.emailService.disableSaveAndProceed.next(true);
        //       this.emailService.disableSaveAsDraft.next(true);
        //       this.snackBar.openSnackBar(
        //         error?.message ?? 'Something Went Wrong',
        //         { error: true }
        //       );
        //     }
        //   );
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
      // const allPreviewData: any = [];
      if (tabName == 'preview') {
        for (const query of this.queryValue) {
          let objPreview: any = {};
          query.query.fields.forEach((ele: any) => {
            const tempMatchedData = this.availableFields.find(
              (x) => prettifyLabel(x.name) === ele.label
            );
            if (tempMatchedData) {
              ele.name = tempMatchedData.name;
              ele.type = tempMatchedData.type.name;
            }
          });
          objPreview = {
            resource: {
              id: this.resource.id ?? '',
              name: this.resource.name ?? '',
            },
            name: query?.name,
            query: {
              name: query.query?.name,
              filter: query.query.filter,
              fields: query.query.fields,
              sort: {
                field: '',
                order: 'asc',
              },
              style: [],
              pageSize: 10,
              template: '',
            },
          };

          // objPreview = {
          //   resource: {
          //     id: '66448d06055578cf76222207',
          //     name: 'A Local GraphQL',
          //   },
          //   name: 'Block 1',
          //   query: {
          //     name: 'allALocalGraphQls',
          //     template: '',
          //     filter: {
          //       logic: 'and',
          //       filters: [
          //         {
          //           logic: 'and',
          //           filters: [],
          //         },
          //       ],
          //     },
          //     pageSize: 10,
          //     fields: [
          //       {
          //         name: 'checkbox',
          //         type: 'JSON',
          //         kind: 'SCALAR',
          //         label: 'Checkbox',
          //         width: null,
          //         format: null,
          //       },
          //       {
          //         name: 'countries',
          //         type: 'JSON',
          //         kind: 'SCALAR',
          //         label: 'Countries',
          //         width: null,
          //         format: null,
          //       },
          //     ],
          //     sort: {
          //       field: '',
          //       order: 'asc',
          //     },
          //     style: [],
          //   },
          // };
          this.http
            .post(
              `${this.restService.apiUrl}/notification/preview-dataset`,
              objPreview,
              { responseType: 'text' }
            )
            .subscribe(
              (response) => {
                console.log(response);
                (
                  document.getElementById('tblPreview') as HTMLInputElement
                ).innerHTML = response;
                // this.navigateToPreview.emit(response);
              },
              (error) => {
                console.error('Error:', error);
              }
            );
        }
        // let count = 0;
        // for (const query of this.queryValue) {
        //   query.fields.forEach((x: any) => {
        //     /**
        //      * Converts the resource field name to parents name
        //      * so the resource parent is converted back to an object.
        //      */
        //     if (x.parentName) {
        //       const child = x.name;
        //       x.childName = child.split(' - ')[1];
        //       x.name = x.parentName;
        //       x.childType = x.type;
        //       x.type = TYPE_LABEL.resource;
        //     }
        //   });

        //   if (count == 0) {
        //     this.loading = true;
        //     this.loadingCheck = false;
        //   }
        //   const resourceInfo = {
        //     id: query.resource.id,
        //     name: query.resource.name,
        //   };
        //   query.tabIndex = count;
        //   count++;
        //   query.pageSize = 50;
        //   this.fetchDataSet(query)
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((res: { data: { dataset: any } }) => {
        //       if (res?.data?.dataset) {
        //         this.datasetResponse = res?.data?.dataset;
        //         this.dataList = res?.data?.dataset.records?.map(
        //           (record: any) => {
        //             const flattenedObject = this.emailService.flattenRecord(
        //               record,
        //               resourceInfo,
        //               query
        //             );
        //             query.fields.forEach((x: any) => {
        //               /**
        //                * Converts the resource field name back to {resourceName} - {resourceField}
        //                * so the field can be mapped to the correct data.
        //                */
        //               if (x.parentName) {
        //                 x.name = `${x.parentName} - ${x.childName}`;
        //                 x.type = x.childType;
        //               }
        //             });

        //             delete flattenedObject.data;

        //             const flatData = Object.fromEntries(
        //               Object.entries(flattenedObject).filter(
        //                 ([, value]) => value !== null && value !== undefined
        //               )
        //             );

        //             return flatData;
        //           }
        //         );
        //         if (this.dataList?.length) {
        //           const tempIndex = res?.data?.dataset?.tabIndex;
        //           this.datasetFields = [
        //             ...new Set(
        //               this.queryValue[tempIndex].fields
        //                 .map((data: any) => data.name)
        //                 .flat()
        //             ),
        //           ];
        //         }
        //         allPreviewData.push({
        //           dataList: this.dataList,
        //           datasetFields: this.datasetFields,
        //           tabIndex: res?.data?.dataset?.tabIndex,
        //           tabName:
        //             res?.data?.dataset?.tabIndex < this.queryValue.length
        //               ? this.queryValue[res.data.dataset.tabIndex].name
        //               : '',
        //         });
        //         if (this.tabs.length == allPreviewData.length) {
        //           allPreviewData = allPreviewData.sort(
        //             (a: any, b: any) => a.tabIndex - b.tabIndex
        //           );
        //           this.loading = false;
        //           this.navigateToPreview.emit(allPreviewData);
        //           this.emailService.setAllPreviewData(allPreviewData);
        //         }
        //       }
        //     });
        // }
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
   * Resets the state `showDatasetLimitWarning` when the close button is clicked.
   */
  closeWarningMessage(): void {
    this.showDatasetLimitWarning = false;
  }

  /**
   * Update input type of date editor.
   */
  public changeEditor(): void {
    this.useExpression = !this.useExpression;
  }

  /**
   * Updating the separate email boolean flag on change
   */
  // onChangeSeparateEmail() {
  //   this.emailService.setSeparateEmail(
  //     this.separateEmail,
  //     this.activeTab.index
  //   );
  // }

  changeBlockTitle() {
    this.emailService.disableSaveAndProceed.next(
      !(
        this.totalMatchingRecords <= 50 &&
        this.query?.controls['name'].value !== ''
      )
    );
    this.emailService.disableSaveAsDraft.next(
      !(
        this.totalMatchingRecords <= 50 &&
        this.query?.controls['name'].value !== ''
      )
    );
  }

  /**
   *To set the send attachment filters.
   */
  onChangeSendAttachment(): void {
    if (this.query.controls.isMoreData.value) {
      this.query.controls.query
        .get('sendAsAttachment')
        .setValue(!this.query.controls.query.get('sendAsAttachment').value);
    }
  }

  /**
   * Create Fields array
   */
  getFieldsArray() {
    const formArray = this.query.controls.query.get('fields') as FormArray;
    // this.selectedFields.forEach((item: any) => {
    //   // For an array of strings, create a FormControl for each string
    //   formArray.push(this.formGroup.control(item));
    // });
    this.selectedFields = this.query.controls.query.get('fields')?.value;
    return formArray;
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    const query = this.query.controls.query;
    if (query.get(formField)?.value) {
      query.get(formField)?.setValue(null);
      query.get('resource').value = null;
    }
    this.resetQuery(this.query.get('query'));
    this.resource.fields = [];
    this.selectedResourceId = '';
    event.stopPropagation();
  }
}
