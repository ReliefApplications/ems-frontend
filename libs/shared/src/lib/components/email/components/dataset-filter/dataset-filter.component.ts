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
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
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
  public resource!: Resource;
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
  previewHTML = '';
  /** Flag to show the Child fields limit warning. */
  public showFieldsWarning = false;

  /**
   * To use helper functions, Apollo serve
   *
   * @param emailService helper functions
   * @param apollo server
   * @param formGroup Angular form builder
   * @param snackBar snackbar helper function
   * @param queryBuilder Shared query builder service
   * @param gridService Shared grid service
   * @param http Backend http client
   * @param restService rest service
   * @param sanitizer html sanitizer
   */
  constructor(
    public emailService: EmailService,
    private apollo: Apollo,
    private formGroup: FormBuilder,
    public snackBar: SnackbarService,
    public queryBuilder: QueryBuilderService,
    public gridService: GridService,
    private http: HttpClient,
    private restService: RestService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.query.controls.resource.value && !this.resource) {
      this.selectedResourceId = this.query.controls.resource.value;
      this.getResourceData(false);
    }
    this.query.controls.resource.valueChanges
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
    // this.query.get('individualEmail').disable();
    this.separateEmail = this.emailService.updateSeparateEmail(
      this.activeTab.index
    );
    if (this.query.value.name == null) {
      const name = 'Block ' + this.activeTab.blockHeaderCount;
      this.query.controls['name'].setValue(name);
    }

    if (this.query?.value?.resource) {
      this.selectedResourceId = this.query?.value?.resource;
      this.getResourceData(false);
    }

    this.filteredFields = this.resource?.fields;
    if (this.query.controls.query.get('cacheData')?.value) {
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
    // Saves Dataset form form when called.
    // this.datasetSaveSubscription = this.emailService.datasetSave.subscribe(
    //   (save) => {
    //     if (save) {
    //       this.getDataSet('preview');
    //     }
    //   }
    // );
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
    const previewTabIndex = 2;
    const isValid =
      this.query.get('query').get('fields')?.value.length > 0 &&
      !this.showDatasetLimitWarning &&
      !this.showFieldsWarning;
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
          this.availableFields = newData;
          this.availableFieldsIndividualEmail = cloneDeep(newData);
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
                    this.onTabSelect(2, false);
                    this.showPreview = true;
                    if (response.count <= 50) {
                      this.showDatasetLimitWarning = false;
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
                      this.previewHTML = previewRes;
                      const previewHTML = document.getElementById(
                        'tblPreview'
                      ) as HTMLInputElement;
                      if (previewHTML) {
                        previewHTML.innerHTML = this.previewHTML;
                      }
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
      this.query.controls['name'].markAsTouched();
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

    return formArray;
    console.log(this.query.getRawValue());
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
    if (this.query.controls[formField]?.value) {
      this.query.controls[formField].setValue(null);
      this.query.controls.resource.value = null;
    }
    this.resetQuery(this.query.get('query'));
    this.resource.fields = [];
    this.selectedResourceId = '';
    event.stopPropagation();
  }

  /**
   * Resets the state `showFieldsWarning` when the close button is clicked.
   */
  closeFieldsWarningMessage(): void {
    this.showFieldsWarning = false;
  }
}
