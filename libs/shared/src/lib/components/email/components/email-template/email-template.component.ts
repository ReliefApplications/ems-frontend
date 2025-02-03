import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { emailRegex } from '../../constant';
import { FieldStore } from '../../models/email.const';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { firstValueFrom, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { QueryBuilderService } from './../../../../services/query-builder/query-builder.service';
import { RestService } from '../../../../services/rest/rest.service';
import { prettifyLabel } from '../../../../../lib/utils/prettify';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonServicesService } from '../../../../services/common-services/common-services.service';
import { GET_CS_USER_FIELDS } from '../../graphql/queries';

/** Recipients type */
enum RecipientsType {
  manual = 'manual',
  resource = 'resource',
  commonServices = 'commonServices',
  combination = 'combination',
}

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
  public previewHTML: any = '';
  /** Total matching records */
  public totalMatchingRecords = 0;
  /** Checks if to is valid for distribution list */
  public distributionListValid!: boolean;
  /** List of display types */
  public segmentList = [
    RecipientsType.manual,
    RecipientsType.resource,
    RecipientsType.combination,
    RecipientsType.commonServices,
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
  /** Show NonEmail Fields Alert */
  public nonEmailFieldsAlert = false;
  /** Actual resourceFields data  */
  public resourceFields: any = [];
  /** Actual referenceFields common service data  */
  public commonServiceFields: any = [];
  /** Expand for "To" list items. */
  isExpandedPreview = false;
  /** Expand for "To" list items. */
  isPreviewEmail = true;
  /** DL preview emails  */
  previewDLEmails: any = [];
  /** accordion items */
  public accordionItems = [
    RecipientsType.manual,
    RecipientsType.resource,
    RecipientsType.commonServices,
  ];
  /** accordion expandedIndex */
  expandedIndex = 0;
  /** Form group for Common service filter query. */
  public dlCommonQuery!: FormGroup | any;
  /** Common service Query filter Preview HTML */
  public previewCommonHTML: any = '';

  /**
   * Composite filter group.
   *
   * @param fb Angular form builder
   * @param emailService helper functions
   * @param snackbar snackbar helper function
   * @param translate i18 translate service
   * @param queryBuilder Shared query builder service
   * @param formBuilder Angular form builder
   * @param restService rest service
   * @param sanitizer html sanitizer
   * @param cs Common Services connection
   */
  constructor(
    private fb: FormBuilder,
    public emailService: EmailService,
    public snackbar: SnackbarService,
    public translate: TranslateService,
    public queryBuilder: QueryBuilderService,
    public formBuilder: FormBuilder,
    private restService: RestService,
    private sanitizer: DomSanitizer,
    private cs: CommonServicesService
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
    this.setCommonServiceFields();

    this.distributionListValid =
      (this.emailService.isToValid &&
        (this.type === 'bcc' || this.type === 'cc')) ||
      this.type === 'to';

    this.dlQuery = this.distributionList.get('query') as FormGroup;
    this.dlCommonQuery = this.distributionList.get(
      'commonServiceFilter'
    ) as FormGroup;
    if (this.distributionList.controls.resource?.value && !this.resource) {
      this.selectedResourceId = this.distributionList.controls.resource.value;
      this.segmentForm.get('dataType')?.setValue('Resource');
      this.getResourceData(false);
    }
    this.distributionList.controls.resource.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          this.activeSegmentIndex === 1
        ) {
          this.resetFilters(this.dlCommonQuery);
        }
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
          this.availableFields = [];
          this.selectedFields = [];
          if (this.resource?.fields) {
            this.resource.fields = [];
          }
        }
      });

    this.dlCommonQuery
      .get('filter.filters')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (
          this.activeSegmentIndex === 3 &&
          value?.filter((x: any) => x?.field || x?.value)?.length > 0
        ) {
          this.emailService.validateNextButton();
        } else {
          this.activeSegmentIndex === 3
            ? this.emailService.disableSaveAndProceed.next(true)
            : '';
        }
      });
    this.selectedEmails = this.distributionList.get('inputEmails') as FormArray;

    const hasSelectedEmails = this.selectedEmails.value.length > 0;
    const hasFields = this.dlQuery.get('fields')?.value.length > 0;
    const useCommonServices = this.dlCommonQuery.get('filter.filters')
      ?.value?.[0]?.field
      ? true
      : false;
    this.type === 'to' ? (this.emailService.isToValid = false) : '';

    if (
      (hasSelectedEmails && hasFields) ||
      (hasSelectedEmails && useCommonServices) ||
      (hasFields && useCommonServices)
    ) {
      this.updateSegmentOptions(RecipientsType.combination);
    } else if (useCommonServices && !hasSelectedEmails) {
      this.updateSegmentOptions(RecipientsType.commonServices);
    } else if (
      !hasSelectedEmails &&
      (hasFields || this.selectedResourceId !== '')
    ) {
      this.updateSegmentOptions(RecipientsType.resource);
    } else {
      this.updateSegmentOptions(RecipientsType.manual);
    }
  }

  /**
   * Get the user table fields from common service
   */
  public async getUserTableFields() {
    // Fetch the user table fields from the getFilterData
    await firstValueFrom(this.cs.graphqlRequest(GET_CS_USER_FIELDS))
      .then(({ data }) => {
        const fields = data.__type.fields
          .filter((f: any) => f.type.kind === 'SCALAR')
          .map((f: any) => f.name);
        this.emailService.userTableFields = fields;
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error, fail to fetch user table fields: ', error);
      });
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

      //clear DLCommon Query
      this.resetFilters(this.dlCommonQuery);
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

      //clear DLCommon Query
      this.resetFilters(this.dlCommonQuery);
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
    } else if (value === 'Select from Common Services') {
      // Clear the input emails form array
      while (this.selectedEmails.length !== 0) {
        this.selectedEmails.removeAt(0);
      }
      this.selectedEmails.reset();
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
      //Clear the Select with filter data
      this.resetFilters(this.dlQuery);
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
      this.showDatasetLimitWarning = fromHTML
        ? false
        : this.showDatasetLimitWarning;
    } else if (newIndex >= 0) {
      if (isValid) {
        this.type === 'to' ? (this.emailService.isToValid = true) : '';
        this.emailService.disableSaveAsDraft.next(false);
      } else {
        this.emailService.validateNextButton();
      }
    }
    if (this.currentTabIndex !== event) {
      if (
        this.expandedIndex === 2 ||
        (this.activeSegmentIndex === 3 && event === 1)
      ) {
        this.previewDLEmails = [];
        fromHTML ? this.getCommonServiceDataSet() : '';
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
        this.previewDLEmails = [];

        this.restService
          .post('/notification/preview-dataset', objPreview)
          .subscribe(
            async (response: any) => {
              this.showPreview = true;
              this.emailService.filterToEmails =
                this.type === 'to' ? [] : this.emailService.filterToEmails;
              // Navigates straight to preview tab if didn't fail before
              if (response.count <= 50) {
                this.showDatasetLimitWarning = false;
              }
              this.onTabSelect(2, false);
              this.showPreview = true;
              if (response.count <= 50) {
                // this.showDatasetLimitWarning = false;
              } else {
                this.totalMatchingRecords = response.count;
                this.showDatasetLimitWarning = true;
              }
              await this.checkFilter();
              if (this.type === 'to') {
                this.previewDLEmails = this.emailService.filterToEmails;
              }
              if (this.type === 'cc') {
                this.previewDLEmails = this.emailService.filterCCEmails;
              }
              if (this.type === 'bcc') {
                this.previewDLEmails = this.emailService.filterBCCEmails;
              }
              this.isPreviewEmail =
                this.previewDLEmails?.length > 0 ? true : false;
              this.previewHTML = window.atob(response.tableHtml);
              if (this.tblPreview?.nativeElement) {
                setTimeout(() => {
                  this.previewHTML = this.sanitizer.bypassSecurityTrustHtml(
                    this.previewHTML
                  );
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
      if (
        this.emailService.isToValid &&
        this.emailService.distributionListName?.trim()?.length > 0 &&
        this.emailService.isDLNameDuplicate
      ) {
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
    return this.selectedEmails?.controls?.map(
      (control: AbstractControl) => control.value
    );
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

      let commonServiceData: any = [];
      if (this.dlCommonQuery?.getRawValue()) {
        commonServiceData = Object.assign(
          this.dlCommonQuery?.getRawValue(),
          {}
        );
        commonServiceData?.filter?.filters?.forEach((ele: any) => {
          if (
            this.emailService.commonServiceFields.filter(
              (x: any) => x.key === ele.field
            ).length > 0
          ) {
            ele.field = this.emailService.commonServiceFields.filter(
              (x: any) => x.key === ele.field
            )?.[0].label;
          }
        });
      }

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

      firstValueFrom(
        this.restService.post(
          '/notification/preview-resource-emails/',
          objPreview
        )
      )
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
            if (this.type === 'cc') {
              this.emailService.filterCCEmails =
                response?.cc?.length > 0 ? response?.cc : [];
            }
            if (this.type === 'bcc') {
              this.emailService.filterBCCEmails =
                response?.bcc?.length > 0 ? response?.bcc : [];
            }
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
    // this.commonServiceFields = [];
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
      const formArray = this.selectedEmails as FormArray;
      formArray.clear();
      this.previewDLEmails = [];
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
    if (this.activeSegmentIndex === 3) {
      const formArray = this.selectedEmails as FormArray;
      formArray.clear();
      this.previewDLEmails = [];

      //Reseting Add manually opyion Data
      this.dlQuery?.get('name')?.setValue('');
      this.resource = null;
      this.resetFilters(this.dlQuery);
      this.distributionList.get('resource').setValue('');

      this.onTabSelect(0, false);
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
          // console.log(this.dlQuery.get('fields')?.value);
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
    if (this.activeSegmentIndex === 0) {
      this.dlQuery?.get('name')?.setValue('');
      this.resource = null;
      this.resetFilters(this.dlQuery);
      this.resetFilters(this.dlCommonQuery);
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

  /**
   * To get data set for the applied filters.
   *
   */
  getCommonServiceDataSet() {
    const commonServiceData: any = this.emailService.setCommonServicePayload(
      cloneDeep(this.dlCommonQuery?.getRawValue()?.filter)
    );
    this.loading = true;
    this.restService
      .post('/notification/preview-common-services-users', commonServiceData)
      .subscribe(
        async (response: any) => {
          this.showPreview = true;
          this.onTabSelect(1, false);
          this.previewDLEmails = response;
          this.isPreviewEmail = this.previewDLEmails?.length > 0 ? true : false;
          this.loading = false;
        },
        (error: string) => {
          console.error('Error:', error);
          this.loading = false;
        }
      );
  }

  /**
   * Set the common service fields.
   *
   */
  async setCommonServiceFields() {
    if (this.emailService?.userTableFields?.length === 0) {
      await this.getUserTableFields();
    }

    this.emailService.commonServiceFields?.forEach((ele: any) => {
      this.commonServiceFields.push({
        graphQLFieldName: ele,
        name: ele.key,
        kind: 'SCALAR',
        type: 'checkbox',
        editor: 'select',
        isCommonService: true,
      });
    });

    this.emailService.userTableFields?.forEach((ele: any) => {
      this.commonServiceFields.push({
        graphQLFieldName: ele,
        name: ele,
        kind: 'SCALAR',
        type: 'text',
        editor: 'text',
        isCommonService: true,
      });
    });
  }

  /**
   * Expand see more email list dropdown for "To".
   */
  toggleExpandPreview() {
    this.isExpandedPreview = !this.isExpandedPreview;
  }

  /**
   * On Panel expand getting index of the expanded Panel
   *
   * @param index Selected Panel index
   */
  onExpand(index: any) {
    this.expandedIndex = index;

    //intiating onTabselection method call for common service filter in use combination
    if (this.expandedIndex === 2) {
      this.onTabSelect(0, false);
    }
  }
}
