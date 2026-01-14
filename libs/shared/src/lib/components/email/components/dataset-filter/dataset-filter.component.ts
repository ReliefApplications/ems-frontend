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
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { QueryRef } from 'apollo-angular';
import { cloneDeep } from 'lodash';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { EmailService } from '../../email.service';
import { FILTER_OPERATORS, TYPE_LABEL } from '../../filter/filter.const';
import { Subscription, takeUntil } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../../../../services/rest/rest.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { prettifyLabel } from '../../../../../lib/utils/prettify';
import {
  Application,
  ApplicationService,
  ContentType,
  Page,
} from '../../../../../index';
import { ReferenceData } from '../../../../models/reference-data.model';
import { ReferenceDataService } from '../../../../services/reference-data/reference-data.service';
import { FormBuilderService } from '../../../../services/form-builder/form-builder.service';
import { Dialog } from '@angular/cdk/dialog';
import { Model } from 'survey-core';
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
  /** Selected resource. */
  public resource: Resource | null = null;
  /** Response of the data set. */
  public datasetResponse: any;
  /** Fields of the data set. */
  public datasetFields!: any[];
  /** Selected resource ID. */
  public selectedResourceId: string | null = null;
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
  public availableFields: any = [];
  /** Available fields for individual Emails. */
  public availableFieldsIndividualEmail: any[] = [];
  /** Selected fields for individual Emails. */
  public selectedFieldsIndividualEmail: any[] = [];
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
  /** Resource Populated Check */
  resourcePopulated = false;
  /** Preview HTML */
  previewHTML: any = '';
  /** Flag to show the Child fields limit warning. */
  public showFieldsWarning = false;
  /** Flag for data is Resource or Reference data */
  public isReferenceData = false;
  /** List of data types */
  public dataTypeList: any = ['Resource', 'Reference Data'];
  /** Currently selected reference data */
  public referenceData: ReferenceData | null = null;
  /** Survey model for variable inputs */
  public referenceInputsSurvey: Model | null = null;
  /** Reference data loading flag */
  public referenceDataLoading = false;
  /** Available pages from the application */
  public pages: any[] = [];
  /** Flag to show the Child fields limit warning. */
  public showFieldsWarning_SSE = false;

  /**
   * Reference variable mapping control helper
   *
   * @returns reference data mapping control if available
   */
  get referenceMappingControl(): FormControl | null {
    return (
      (this.query?.get('referenceDataVariableMapping') as FormControl) || null
    );
  }

  /**
   * To use helper functions, Apollo serve
   *
   * @param emailService helper functions
   * @param snackBar snackbar helper function
   * @param queryBuilder Shared query builder service
   * @param gridService Shared grid service
   * @param http Backend http client
   * @param restService rest service
   * @param sanitizer html sanitizer
   * @param applicationService application service
   * @param referenceDataService reference data service
   * @param formBuilderService form builder service
   * @param dialog dialog service
   */
  constructor(
    public emailService: EmailService,
    public snackBar: SnackbarService,
    public queryBuilder: QueryBuilderService,
    public gridService: GridService,
    private http: HttpClient,
    private restService: RestService,
    private sanitizer: DomSanitizer,
    public applicationService: ApplicationService,
    private referenceDataService: ReferenceDataService,
    private formBuilderService: FormBuilderService,
    private dialog: Dialog
  ) {
    super();
  }

  ngOnInit(): void {
    const application = this.applicationService.application.getValue();
    this.pages = this.getPages(application);
    const dataTypeControl = this.query.get('dataType');
    const selectedDataType = dataTypeControl?.value ?? this.dataTypeList[0];
    if (!dataTypeControl?.value) {
      dataTypeControl?.setValue(selectedDataType, { emitEvent: false });
    }
    this.isReferenceData = selectedDataType === this.dataTypeList[1];

    dataTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.isReferenceData = value === this.dataTypeList[1];
        if (this.isReferenceData) {
          this.query.get('resource')?.setValue(null, { emitEvent: false });
          this.resource = null;
          this.availableFields = [];
          this.selectedFields = [];
          this.selectedFieldsIndividualEmail = [];
          this.referenceInputsSurvey = null;
          this.resetQuery(this.query.get('query'));
          if (!this.query.get('referenceDataVariableMapping')?.value) {
            this.query.get('referenceDataVariableMapping')?.setValue('{}');
          }
          const referenceId = this.query.get('reference')?.value;
          if (referenceId) {
            this.loadReferenceData(referenceId as string);
          }
          this.emailService.disableSaveAndProceed.next(true);
        } else {
          this.query.get('reference')?.setValue(null, { emitEvent: false });
          this.referenceData = null;
          this.referenceInputsSurvey = null;
          this.query
            .get('referenceDataVariableMapping')
            ?.setValue(null, { emitEvent: false });
          this.query
            .get('referenceDataInputConfig')
            ?.setValue(null, { emitEvent: false });
          this.query
            .get('referenceDataInputs')
            ?.setValue(null, { emitEvent: false });
          if (this.query.controls.resource.value) {
            this.selectedResourceId = this.query.controls.resource.value;
            this.getResourceData(false);
          }
        }
      });

    if (
      this.query.controls.resource.value &&
      !this.resource &&
      !this.isReferenceData
    ) {
      this.selectedResourceId = this.query.controls.resource.value;
      this.getResourceData(false);
    }
    this.query.controls.resource.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (this.isReferenceData) return;
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
          this.availableFields = [];
          this.selectedFields = [];
          if (this.resource?.fields) {
            this.resource.fields = [];
          }
        }
      });
    const referenceControl = this.query.get('reference');
    referenceControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (!this.isReferenceData) return;
        if (value) {
          this.loadReferenceData(value);
        } else {
          this.referenceData = null;
          this.referenceInputsSurvey = null;
          this.updateReferenceDataValidity();
        }
      });
    this.query.controls.name.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.activeTab = this.tabs.filter((x: any) => x.active)?.[0];
        if (data === null) {
          this.emailService.title.next(this.activeTab.title);
        } else {
          this.emailService.title.next(data);
        }
        this.emailService.index.next(this.activeTab.index);
      });
    this.query.controls?.navigateSettings?.controls?.field?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.query.controls['navigateToPage'].setValue(true);
        } else {
          this.query.controls['navigateToPage'].setValue(false);
        }
      });
    // this.query.get('individualEmail').disable();
    this.separateEmail = this.emailService.updateSeparateEmail(
      this.activeTab.index
    );
    if (!this.query.value.name) {
      const name = 'Block ' + this.activeTab.blockHeaderCount;
      this.query.controls['name'].setValue(name);
    }

    if (this.query?.value?.resource && !this.isReferenceData) {
      this.selectedResourceId = this.query?.value?.resource;
      this.getResourceData(false);
    }

    if (this.isReferenceData && this.query?.value?.reference) {
      this.loadReferenceData(this.query.value.reference);
    }

    this.filteredFields = this.resource?.fields;
    if (
      !this.isReferenceData &&
      this.query.controls.query.get('cacheData')?.value
    ) {
      const {
        dataList,
        resource,
        operators,
        datasetFields,
        selectedFields,
        availableFields,
        filterFields,
        selectedResourceId,
        availableFieldsIndividualEmail,
      } = this.query.controls.query.get('cacheData').value;

      this.dataList = dataList;
      this.resource = resource;
      this.operators = operators;
      this.datasetFields = datasetFields;
      this.selectedFields = selectedFields;
      this.filterFields = filterFields;
      this.availableFields = availableFields;
      this.availableFieldsIndividualEmail = availableFieldsIndividualEmail;
      this.selectedResourceId = selectedResourceId;
    }

    this.setFieldsValidity();
    if (this.isReferenceData) {
      this.updateReferenceEmailValidation();
    }

    // Check for individual email checkbox value
    this.query.controls.individualEmail.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (this.isReferenceData) {
          if (
            value === true &&
            (this.query.get('individualEmailFields') as FormArray).length === 0
          ) {
            this.addReferenceEmailField();
          }
          this.updateReferenceEmailValidation();
          return;
        }
        if (
          value === true &&
          this.selectedFieldsIndividualEmail?.length === 0 &&
          this.resource
        ) {
          this.onTabSelect(4, false);
          this.emailService.disableSaveAndProceed.next(true);
        } else if (this.resource) {
          this.onTabSelect(0, false);
        }
      });
  }

  /**
   * Checks if object and list have children set
   */
  setFieldsValidity() {
    this.showFieldsWarning = false;
    this.query.getRawValue().query?.fields.forEach((field: any) => {
      if (field.kind == 'OBJECT' || field.kind == 'LIST') {
        if (field.fields == undefined || field.fields.length == 0) {
          this.showFieldsWarning = true;
        }
      }
    });
  }

  override ngOnDestroy() {
    if (!this.resource) {
      if (this.query?.get('individualEmail') === true) {
        this.query?.get('individualEmail').setValue(false);
      }
    }
    // Delete cache data
    if (this.query?.get('cacheData')) {
      this.query.get('cacheData').reset();
      this.query.get('cacheData').clearValidators();
      this.query.get('cacheData').clearAsyncValidators();
      this.query.removeControl('cacheData');
    }

    // Safely destroys dataset save subscription
    if (this.datasetSaveSubscription) {
      this.datasetSaveSubscription.unsubscribe();
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
    const previewTabIndex =
      this.isReferenceData && this.query.get('individualEmail')?.value ? 4 : 3;

    if (this.isReferenceData) {
      this.showDatasetLimitWarning = false;
      this.currentTabIndex = newIndex;
      if (
        fromHTML &&
        newIndex === previewTabIndex &&
        this.query.value.reference
      ) {
        this.getDataSet('preview');
      }
      return;
    }

    const isSeparateEmailValid =
      (this.query.get('individualEmail').value === true &&
        this.selectedFieldsIndividualEmail.length > 0) ||
      this.query.get('individualEmail').value === false;
    const isValid =
      this.query.get('query').get('fields')?.value.length > 0 &&
      !this.showDatasetLimitWarning &&
      !this.showFieldsWarning &&
      isSeparateEmailValid;
    // Checks if entry is valid
    // if (
    //   newIndex === previewTabIndex &&
    //   this.currentTabIndex !== previewTabIndex
    // ) {
    //   this.getDataSet('preview', true);
    // }
    //if new tab is preview, get preview data
    this.showDatasetLimitWarning = fromHTML
      ? false
      : this.showDatasetLimitWarning;
    if (fromHTML && newIndex === previewTabIndex) {
      if (isValid) {
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
      this.currentTabIndex !== newIndex ? this.getDataSet('preview') : '';
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
   * To fetch resource details
   *
   * @param fromHtml - If state is in edit mode then false else true if new notification (means Event from UI)
   */
  getResourceData(fromHtml: boolean) {
    this.resourcePopulated = false;
    this.loading = true;
    this.availableFields = [];
    this.availableFieldsIndividualEmail = [];
    if (fromHtml) {
      this.query.controls.query.value.fields = [];
      this.query.controls.query.get('fields').value = [];
      this.selectedFields = [];
      this.selectedFieldsIndividualEmail = [];
      this.filterFields = [];
    }
    this.showDatasetLimitWarning = false;
    this.emailService.disableSaveAndProceed.next(true);
    this.emailService.disableSaveAsDraft.next(false);
    this.currentTabIndex = 0;
    if (fromHtml) {
      this.resetQuery(this.query.get('query'));
    }
    if (this.selectedResourceId) {
      // Show tabs while loading to avoid empty UI
      this.resourcePopulated = true;
      this.emailService
        .fetchResourceData(this.selectedResourceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          const queryTemp: any = data.resource;
          const newData = this.queryBuilder.getFields(queryTemp.queryName);
          if (this.query.controls.query.get('name') === null) {
            this.query.controls.query.addControl('name', new FormControl(''));
          }
          this.query.controls.query.get('name').setValue(queryTemp.queryName);
          this.availableFields = newData || [];
          this.availableFieldsIndividualEmail = cloneDeep(newData || []);
          this.filterFields = cloneDeep(newData || []);
          this.loading = false;
          this.resourcePopulated = true;
          this.resource = data.resource;
        });
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
    filters.push(this.emailService.getNewFilterFields);

    query.get('name')?.setValue('');
  }

  /**
   * Loads reference data metadata and builds survey for inputs.
   *
   * @param referenceId Reference data id
   */
  async loadReferenceData(referenceId: string) {
    this.referenceDataLoading = true;
    try {
      this.referenceData = await this.referenceDataService.loadReferenceData(
        referenceId
      );
      this.buildReferenceInputsSurvey(
        this.query.get('referenceDataInputConfig')?.value
      );
    } catch (err) {
      console.error(err);
      this.referenceData = null;
    } finally {
      this.referenceDataLoading = false;
      this.updateReferenceDataValidity();
    }
  }

  /**
   * Opens Survey builder to configure variable inputs.
   */
  openReferenceInputBuilder(): void {
    import(
      '../../../dashboard-filter/filter-builder-modal/filter-builder-modal.component'
    ).then(({ FilterBuilderModalComponent }) => {
      const dialogRef = this.dialog.open(FilterBuilderModalComponent, {
        data: {
          surveyStructure: this.query.get('referenceDataInputConfig')?.value,
        },
        autoFocus: false,
      });
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value) {
          this.query.get('referenceDataInputConfig')?.setValue(value);
          this.buildReferenceInputsSurvey(value);
        }
      });
    });
  }

  /**
   * Build survey instance for variable inputs.
   *
   * @param structure Survey JSON definition
   */
  buildReferenceInputsSurvey(structure?: any): void {
    if (!structure) {
      this.referenceInputsSurvey = null;
      this.updateReferenceDataValidity();
      return;
    }
    try {
      const surveyStructure =
        typeof structure === 'string' ? structure : JSON.stringify(structure);
      const survey = this.formBuilderService.createSurvey(surveyStructure);
      const currentInputs = this.query.get('referenceDataInputs')?.value;
      if (currentInputs) {
        survey.data = currentInputs;
      }
      survey.onValueChanged.add(() => {
        this.query
          .get('referenceDataInputs')
          ?.setValue({ ...(survey.data as any) });
        this.updateReferenceDataValidity();
      });
      this.referenceInputsSurvey = survey;
      this.updateReferenceDataValidity();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Update save/proceed availability for reference data datasets.
   */
  updateReferenceDataValidity(): void {
    if (!this.isReferenceData) return;
    const hasReference = !!this.query.get('reference')?.value;
    const mappingControl = this.query.get('referenceDataVariableMapping');
    const mappingValid = mappingControl ? mappingControl.valid : true;
    const isValid = hasReference && mappingValid;
    this.emailService.disableSaveAndProceed.next(!isValid);
    this.emailService.disableSaveAsDraft.next(false);
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
    this.datasetFilterInfo.push(this.emailService.getNewFilterFields);
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
   * To get data set for the applied filters.
   *
   * @param tabName - The name of the tab for which to get the data set.
   * @param validCheck - Check if data needs validation
   */
  getDataSet(tabName?: any, validCheck?: boolean): void {
    if (
      this.query.controls['name'].value !== null &&
      this.query.controls['name'].value !== ''
    ) {
      if (this.isReferenceData) {
        if (tabName === 'preview' && this.query.value.reference) {
          this.loading = true;
          const objPreview: any = {
            resource: '',
            reference: this.query.get('reference')?.value || '',
            name: this.query.get('name')?.value,
            query: this.query.get('query')?.value,
            referenceDataVariableMapping: this.query.get(
              'referenceDataVariableMapping'
            )?.value,
            referenceDataInputConfig: this.query.get('referenceDataInputConfig')
              ?.value,
            referenceDataInputs: this.query.get('referenceDataInputs')?.value,
            navigateSettings: this.query.value.navigateSettings,
            navigateToPage: this.query.value.navigateToPage,
          };

          this.http
            .post(
              `${this.restService.apiUrl}/notification/preview-dataset`,
              objPreview
            )
            .subscribe(
              (response: any) => {
                const previewRes = window.atob(response.tableHtml);
                setTimeout(() => {
                  this.previewHTML =
                    this.sanitizer.bypassSecurityTrustHtml(previewRes);
                }, 100);

                const datasetEntry = {
                  dataList: response,
                  datasetFields:
                    this.referenceData?.fields?.map((f: any) => f.name) || [],
                  tabIndex: this.activeTab?.index,
                  tabName: this.activeTab?.title,
                };
                this.emailService.setAllPreviewData([datasetEntry]);

                this.loading = false;
              },
              (error: string) => {
                console.error('Error:', error);
                this.loading = false;
              }
            );
        }
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
        return;
      }
      if (tabName == 'fields') {
        this.onTabSelect(1, false);
        if (this.selectedFields.length) {
          this.emailService.disableSaveAndProceed.next(false);
          this.emailService.disableSaveAsDraft.next(false);
        } else {
          this.emailService.disableSaveAndProceed.next(true);
          this.emailService.disableSaveAsDraft.next(false);
        }
      }
      if (
        tabName == 'filter' &&
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
        this.loading = true;
        const currentQuery = this.queryValue?.filter(
          (x: any) => x?.name === this.activeTab?.title
        );
        for (const query of currentQuery) {
          let objPreview: any = {};

          objPreview = {
            resource: this.resource?.id ?? '',
            reference: '',
            name: query?.name,
            query: {
              name: query.query?.name,
              filter: query.query.filter,
              fields: this.query.getRawValue().query?.fields,
              sort: {
                field: '',
                order: 'asc',
              },
              style: [],
              pageSize: 10,
              template: '',
            },
            navigateSettings: this.query.value.navigateSettings,
            navigateToPage: this.query.value.navigateToPage,
          };

          // TODO: Somehow make this go down recursively instead of just checking for just the child
          this.showFieldsWarning = false;
          this.query.getRawValue().query?.fields.forEach((field: any) => {
            if (field.kind == 'OBJECT' || field.kind == 'LIST') {
              if (field.fields == undefined || field.fields.length == 0) {
                this.showFieldsWarning = true;
              }
            }
          });

          this.previewHTML = '';
          if (!this.showFieldsWarning) {
            this.http
              .post(
                `${this.restService.apiUrl}/notification/preview-dataset`,
                objPreview
              )
              .subscribe(
                (response: any) => {
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
                    if (response.count <= 50) {
                      this.showDatasetLimitWarning = false;
                    }
                    this.onTabSelect(3, false);
                    if (response.count <= 50) {
                      // this.showDatasetLimitWarning = false;
                      let allPreviewData: any = [];
                      allPreviewData.push({
                        dataList: response,
                        datasetFields: this.query
                          .getRawValue()
                          .query.fields.map((x: any) => x.name),
                        tabIndex: this.activeTab.index,
                        tabName: this.activeTab.title,
                      });
                      if (this.tabs.length == allPreviewData.length) {
                        allPreviewData = allPreviewData.sort(
                          (a: any, b: any) => a.tabIndex - b.tabIndex
                        );
                        this.loading = false;
                        this.emailService.setAllPreviewData(allPreviewData);
                      }
                    } else {
                      this.totalMatchingRecords = response.count;
                      this.showDatasetLimitWarning = true;
                    }

                    const previewRes = window.atob(response.tableHtml);
                    if (previewRes.includes(this.activeTab.title)) {
                      setTimeout(() => {
                        this.previewHTML =
                          this.sanitizer.bypassSecurityTrustHtml(previewRes);
                      }, 100);
                    }
                  }

                  // this.navigateToPreview.emit(response);
                  this.loading = false;
                },
                (error: string) => {
                  console.error('Error:', error);
                  this.loading = false;
                }
              );
          } else {
            this.loading = false;
          }
        }
      }
    } else {
      // TODO: Somehow make this go down recursively instead of just checking for just the child
      this.showFieldsWarning_SSE = false;
      this.query.getRawValue().query?.fields.forEach((field: any) => {
        if (field.kind == 'OBJECT' || field.kind == 'LIST') {
          if (field.fields == undefined || field.fields.length == 0) {
            this.showFieldsWarning_SSE = true;
          }
        }
      });
    }
    this.emailService.selectedDataSet = '';
  }

  /**
   * Sanitize HTML
   *
   * @param elementId element Id of div
   * @param htmlContent html content
   */
  sanitizeAndSetInnerHTML(elementId: string, htmlContent: string): void {
    const sanitizedHtml: SafeHtml =
      this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    this.previewHTML = sanitizedHtml as string;
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
      this.query.controls['sendAsAttachment'].setValue(
        !this.query.controls.sendAsAttachment.value
      );
    }
  }

  /**
   * Retrieves Individual Email Fields
   *
   * @returns FormArray of fields
   */
  getIndividualEmailFieldsArray() {
    if (this.isReferenceData) {
      const formArray = this.query.get('individualEmailFields') as FormArray;
      this.selectedFieldsIndividualEmail = formArray?.value || [];
      this.updateReferenceEmailValidation();
      return formArray;
    }

    const formArray = this.query.get('individualEmailFields') as FormArray;
    formArray.controls.forEach((field: any) => {
      if (!field.value.name) {
        const tempMatchedData = this.availableFieldsIndividualEmail.find(
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

    this.selectedFieldsIndividualEmail = this.query.get(
      'individualEmailFields'
    )?.value;

    if (
      this.selectedFieldsIndividualEmail.length > 0 &&
      this.query.get('individualEmail').value === true
    ) {
      if (
        this.query
          ?.get('individualEmailFields')
          ?.getRawValue()
          ?.filter((x: any) => x?.fields?.length === 0).length > 0
      ) {
        this.emailService.disableSaveAndProceed.next(true);
        this.showFieldsWarning_SSE = true;
      } else {
        this.showFieldsWarning_SSE = false;
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
    } else if (this.query.get('individualEmail').value === true) {
      this.emailService.disableSaveAndProceed.next(true);
    }

    return formArray;
  }

  /**
   * Adds a reference data email path input.
   */
  addReferenceEmailField(): void {
    const formArray = this.query.get('individualEmailFields') as FormArray;
    formArray.push(new FormControl('', Validators.required));
    this.updateReferenceEmailValidation();
  }

  /**
   * Removes a reference data email path input.
   *
   * @param index Control index to remove
   */
  removeReferenceEmailField(index: number): void {
    const formArray = this.query.get('individualEmailFields') as FormArray;
    if (index >= 0 && index < formArray.length) {
      formArray.removeAt(index);
    }
    this.updateReferenceEmailValidation();
  }

  /**
   * Validates reference data separate email configuration.
   */
  updateReferenceEmailValidation(): void {
    if (!this.isReferenceData) return;
    const formArray = this.query.get('individualEmailFields') as FormArray;
    const isSeparate = this.query.get('individualEmail').value === true;
    const hasPath =
      formArray?.controls?.some(
        (ctrl: AbstractControl) =>
          ctrl.value !== null && ctrl.value?.toString().trim().length > 0
      ) || false;

    if (isSeparate && !hasPath) {
      this.emailService.disableSaveAndProceed.next(true);
      this.emailService.disableSaveAsDraft.next(false);
    } else if (isSeparate) {
      this.emailService.disableSaveAndProceed.next(false);
      this.emailService.disableSaveAsDraft.next(false);
    }
  }

  /**
   * Retrieves Fields Form array
   *
   * @returns FormArray of fields
   */
  getFieldsArray() {
    const formArray = this.query.controls.query.get('fields') as FormArray;
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

    this.selectedFields = this.query.controls.query.get('fields')?.value;
    if (this.selectedFields.length > 0) {
      this.onTabSelect(this.currentTabIndex, true);
      this.showDatasetLimitWarning = false;
      if (
        this.query
          ?.getRawValue()
          ?.query?.fields?.filter((x: any) => x?.fields?.length === 0).length >
        0
      ) {
        this.emailService.disableSaveAndProceed.next(true);
        this.showFieldsWarning = true;
      } else {
        this.showFieldsWarning = false;
        this.emailService.disableSaveAndProceed.next(false);
        this.emailService.disableSaveAsDraft.next(false);
      }
    } else {
      this.emailService.disableSaveAndProceed.next(true);
    }
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
    const control = this.query.get(formField);
    if (control?.value) {
      control.setValue(null);
    }
    if (formField === 'resource') {
      this.query.controls.resource.value = null;
      this.resetQuery(this.query.get('query'));
      if (this.resource) {
        this.resource.fields = [];
      }
      this.selectedResourceId = '';
    }
    if (formField === 'reference') {
      this.referenceData = null;
      this.referenceInputsSurvey = null;
      this.query.get('referenceDataVariableMapping')?.setValue('{}');
      this.query.get('referenceDataInputConfig')?.setValue(null);
      this.query.get('referenceDataInputs')?.setValue(null);
      this.updateReferenceDataValidity();
    }
    event.stopPropagation();
  }

  /**
   * Resets the state `showFieldsWarning` when the close button is clicked.
   */
  closeFieldsWarningMessage(): void {
    this.showFieldsWarning = false;
  }

  /**
   * Get available pages from app
   *
   * @param application application
   * @returns list of pages and their url
   */
  private getPages(application: Application | null) {
    return (
      application?.pages?.map((page: any) => ({
        id: page.id,
        name: page.name,
        urlParams: this.getPageUrlParams(application, page),
        placeholder: `{{page(${page.id})}}`,
      })) || []
    );
  }

  /**
   * Get page url params
   *
   * @param application application
   * @param page page to get url from
   * @returns url of the page
   */
  private getPageUrlParams(application: Application, page: Page): string {
    const applicationPath =
      this.applicationService.getApplicationPath(application);
    return page.type === ContentType.form
      ? `${applicationPath}/${page.type}/${page.id}`
      : `${applicationPath}/${page.type}/${page.content}`;
  }
}
