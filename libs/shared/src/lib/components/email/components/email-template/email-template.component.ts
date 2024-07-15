import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EmailService } from '../../email.service';
import { FILTER_OPERATORS } from '../../filter/filter.const';
import { Apollo } from 'apollo-angular';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { emailRegex } from '../../constant';
import { FieldStore } from '../../models/email.const';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

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

  /**
   * Event Emitted for no email
   */
  @Output() noEmail = new EventEmitter();

  /** List of emails for back loading. */
  @Input() emailBackLoad: string[] | undefined;

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
  public segmentList = ['Add Manually'];
  /** Time units for filtering. */
  public timeUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];
  /** Show preview for select with filter option  */
  public showPreview = false;
  /** Show preview button for select with fiter option  */
  public showBtnPreview = false;
  /** Array of fields */
  public availableFields: any[] = [];

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
  ) {
    super();
  }

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segment: [this.segmentList[0]], // Set the initial value to the first display type
      datasetSelect: '',
    });

    this.selectedEmails = this.emailBackLoad;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
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
      // const { dataList, resource, dataSetFields, dataSetResponse } =
      //   dataSet.cacheData;

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
    this.showBtnPreview = false;
    if (this.selectedDataset !== null && this.activeSegmentIndex === 1) {
      this.bindDataSetDetails(this.selectedDataset);
    }
    if (this.activeSegmentIndex === 2) {
      if (this.selectedEmails.length == 0) {
        this.noEmail.emit(false);
      } else {
        if (this.datasetFilterInfo?.controls?.length > 0) {
          this.noEmail.emit(true);
        }
      }
      this.showBtnPreview =
        this.datasetFilterInfo?.controls?.length == 0 ? false : true;
    }
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
   * Remove email Id from the list
   *
   * @param chipIndex chip index
   */
  removeEmailChip(chipIndex: number): void {
    this.selectedEmails.splice(chipIndex, 1);
    this.listChange.emit();
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
    this.emailValidationError = emailRegex.test(element.value)
      ? ''
      : 'Invalid Email Address';
    if (element.value === '') {
      this.emailValidationError = '';
    }
  }
}
