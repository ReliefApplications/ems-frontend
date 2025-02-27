import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EmailService } from '../../email.service';
import { ApplicationService } from '../../../../services/application/application.service';
import { DownloadService } from '../../../../services/download/download.service';
import { UIPageChangeEvent, handleTablePageEvent } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/public-api';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../../../../services/rest/rest.service';
import { cloneDeep } from 'lodash';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 5;
/** Current Distribution list items page size (for pagination) */
const DISTRIBUTION_PAGE_SIZE = 5;

/** Select Distribution component. */
@Component({
  selector: 'app-select-distribution',
  templateUrl: './select-distribution.component.html',
  styleUrls: ['./select-distribution.component.scss'],
})
export class SelectDistributionComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /**
   * Composite email distribution.
   *
   * @param emailService helper functions
   * @param applicationService helper functions
   * @param downloadService helper functions
   * @param snackBar snackbar helper function
   * @param translate translate helper function
   * @param formBuilder form builder helper function
   * @param http http helper function
   * @param restService rest helper function
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    public downloadService: DownloadService,
    public snackBar: SnackbarService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private restService: RestService
  ) {
    super();
    this.getExistingTemplate();
    this.showExistingDistributionList =
      this.emailService.showExistingDistributionList;
  }

  /** Flag indicating whether the email template is shown. */
  public showEmailTemplate = false;
  /** Type of email template. */
  public templateFor = '';
  /** Flag indicating whether existing distribution list is shown. */
  public showExistingDistributionList = false;
  /** Cached distribution list data. */
  cacheDistributionList: any = [];
  /** Distribution lists data. */
  public distributionLists: any = [];
  /** Columns for distribution list. */
  public distributionColumn = ['name', 'createdBy', 'email'];
  /** ID of selected distribution list. */
  public distributionListId = '';
  /** Pagination information for distribution list. */
  public distributionPageInfo = {
    pageIndex: 0,
    pageSize: DISTRIBUTION_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };
  /** Data for filter template. */
  filterTemplateData: any = [];
  /** Actual data for template. */
  templateActualData: any = [];
  /** Flag indicating loading state. */
  public loading = true;
  /** Application ID. */
  public applicationId = '';
  /** Email notifications data. */
  public emailNotifications: any = [];
  /** Pagination information for general page. */
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
    skip: 0,
    limit: DEFAULT_PAGE_SIZE,
  };
  /** Flag indicating loading state. */
  public isLoading = false;
  /** Cached data. */
  public cachedData: any = {};

  /** Checks for valid emails when filtering datasets   */
  public noEmail = {
    to: false,
    cc: false,
    bcc: false,
  };
  /** Store Actual DL name in case of Edit Mode */
  actualDLName = '';

  /** Reference to file upload element. */
  @ViewChild('fileUpload', { static: true }) fileElement:
    | ElementRef
    | undefined;
  /** DL dialog data from Quick Action  */
  @Input() DL_QuickAction: any;

  ngOnInit(): void {
    this.emailService.DL_Data = this.emailService.datasetsForm.get(
      'emailDistributionList'
    );
    this.enableForm('to');
    this.enableForm('cc');
    this.enableForm('bcc');
    if (this.emailService?.editId && this.emailService?.DL_Data?.id) {
      this.distributionListId = this.emailService.DL_Data.id;
      this.emailService.selectedDLName = cloneDeep(
        this.emailService.DL_Data?.name
      );
    }
    if (
      !this.emailService.DL_Data?.get('to.query.filter.logic')?.value?.trim()
    ) {
      this.emailService.DL_Data.get('to.query.filter.logic').setValue('and');
    }
    if (
      !this.emailService.DL_Data?.get('cc.query.filter.logic')?.value?.trim()
    ) {
      this.emailService.DL_Data.get('cc.query.filter.logic').setValue('and');
    }
    if (
      !this.emailService.DL_Data?.get('bcc.query.filter.logic')?.value?.trim()
    ) {
      this.emailService.DL_Data.get('bcc.query.filter.logic').setValue('and');
    }

    if (
      !this.emailService.DL_Data?.get(
        'to.commonServiceFilter.filter.logic'
      )?.value?.trim()
    ) {
      this.emailService.DL_Data.get(
        'to.commonServiceFilter.filter.logic'
      ).setValue('and');
    }
    if (
      !this.emailService.DL_Data?.get(
        'cc.commonServiceFilter.filter.logic'
      )?.value?.trim()
    ) {
      this.emailService.DL_Data.get(
        'cc.commonServiceFilter.filter.logic'
      ).setValue('and');
    }
    if (
      !this.emailService.DL_Data?.get(
        'bcc.commonServiceFilter.filter.logic'
      )?.value?.trim()
    ) {
      this.emailService.DL_Data.get(
        'bcc.commonServiceFilter.filter.logic'
      ).setValue('and');
    }
    if (!this.isAllSeparate()) {
      this.validateDistributionList();
    }
    if (this.emailService.isDLEdit || this.emailService?.editId) {
      this.actualDLName = cloneDeep(this.emailService.distributionListName);
    }
  }

  /**
   * Checks if all datasets are send separate email
   *
   * @returns boolean true if all are send separate
   */
  isAllSeparate(): boolean {
    if (this.emailService.datasetsForm?.get('datasets')?.getRawValue()) {
      let separateEmailCount = 0;
      let datasetsCount = 0;
      for (const dataset of this.emailService.datasetsForm.get('datasets')
        ?.value ?? []) {
        if (
          (dataset.resource || dataset.reference) &&
          dataset.individualEmail
        ) {
          datasetsCount += 1;
          separateEmailCount += 1;
        } else if (dataset.resource || dataset.reference) {
          datasetsCount += 1;
        }
      }

      if (separateEmailCount === datasetsCount && datasetsCount > 0) {
        this.emailService.DL_Data.get('name')?.patchValue('');
        this.emailService.clearDL(
          this.emailService.DL_Data.get('to') as FormGroup
        );
        this.emailService.clearDL(
          this.emailService.DL_Data.get('cc') as FormGroup
        );
        this.emailService.clearDL(
          this.emailService.DL_Data.get('bcc') as FormGroup
        );
        this.emailService.selectedDLName = '';
        this.distributionListId = '';

        this.emailService.isAllSeparateEmail = true;

        return true;
      } else {
        this.emailService.isAllSeparateEmail = false;
        return false;
      }
    }
    return false;
  }

  /**
   * Update the noEmail object
   *
   * @param val the value of emitted dataset email
   * @param type refers to cc,bcc and to
   */
  update(val: any, type: string) {
    if (type === 'to') {
      this.noEmail.to = val;
    }
    if (type === 'cc') {
      this.noEmail.cc = val;
    }
    if (type === 'bcc') {
      this.noEmail.bcc = val;
    }
  }

  /**
   * This method is used to show/hide the existing distribution list.
   */
  toggleDistributionListVisibility(): void {
    this.emailService.showExistingDistributionList =
      !this.emailService.showExistingDistributionList;
    this.showExistingDistributionList =
      this.emailService.showExistingDistributionList;
  }

  /**
   * Name validation.
   *
   * @returns boolean
   */
  isNameDuplicate(): boolean {
    const enteredName = this.emailService.DL_Data?.get('name')
      ?.value?.trim()
      .toLowerCase();
    if (
      this.emailService.selectedDLName?.trim()?.toLowerCase() !==
      enteredName?.trim()?.toLowerCase()
    ) {
      let isDupe =
        this.emailService.distributionListNames.includes(enteredName);
      if (!isDupe && this.emailService?.cacheDistributionList?.length > 0) {
        isDupe = this.emailService.cacheDistributionList
          .map((x: any) => x.name.toLowerCase())
          .includes(enteredName);
      }
      //Check for Edit scenario
      if ((this.emailService.isDLEdit || this.emailService?.editId) && isDupe) {
        isDupe =
          this.actualDLName === this.emailService.distributionListName
            ? false
            : true;
      }

      this.emailService.isDLNameDuplicate = isDupe;
      return isDupe;
    } else {
      return false;
    }
  }

  /**
   * Duplicate Checking.
   *
   */
  triggerDuplicateChecker() {
    const flag = this.isNameDuplicate();
    if (
      // this.emailDistributionList.To.length === 0 ||
      this.emailService.DL_Data.get('name').value.length === 0 ||
      flag
    ) {
      this.emailService.stepperDisable.next({ id: 2, isValid: false });
    } else {
      this.emailService.stepperDisable.next({ id: 2, isValid: true });
      this.emailService.distributionListName =
        this.emailService.DL_Data.get('name').value;
    }
  }

  /**
   * Get existing distribution list template.
   */
  getExistingTemplate() {
    this.loading = true;
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      this.applicationId = res?.id;
    });
    this.isLoading = true;
    this.emailService.getEmailDistributionList(this.applicationId).subscribe({
      next: ({ data }: any) => {
        this.distributionLists =
          data?.emailDistributionLists?.edges?.map(({ node }: any) => {
            this.emailService.distributionListNames.push(
              node?.name?.trim()?.toLowerCase()
            );
            return node;
          }) || [];

        this.cacheDistributionList = this.distributionLists;
        this.emailService.cacheDistributionList = this.cacheDistributionList;
        const existingDataIndex =
          this.emailService.cacheDistributionList.findIndex(
            (x: any) =>
              x?.name?.toLowerCase() ==
              this.emailService.DL_Data?.get('name')
                ?.value?.trim()
                ?.toLowerCase()
          );
        if (existingDataIndex > -1) {
          this.distributionListId =
            this.emailService.cacheDistributionList[existingDataIndex].id;
        }
        this.distributionLists = this.cacheDistributionList.slice(
          this.distributionPageInfo.pageSize *
            this.distributionPageInfo.pageIndex,
          this.distributionPageInfo.pageSize *
            (this.distributionPageInfo.pageIndex + 1)
        );
        this.distributionPageInfo.length = this.cacheDistributionList.length;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.snackBar.openSnackBar(err.message, { error: true });
      },
    });
  }

  /**
   * Select Distribution List table row
   *
   * @param index table row index
   */
  selectDistributionListRow(index: number): void {
    const emailDL = this.emailService.populateDistributionListForm(
      this.distributionLists[index]
    );

    this.emailService.DL_Data.get('name')?.patchValue(
      emailDL.get('name')?.value
    );
    this.emailService.DL_Data.get('id')?.patchValue(emailDL.get('id')?.value);

    this.emailService.clearAndPatch(
      this.emailService.DL_Data.get('to') as FormGroup,
      emailDL.get('to') as FormGroup
    );
    this.emailService.clearAndPatch(
      this.emailService.DL_Data.get('cc') as FormGroup,
      emailDL.get('cc') as FormGroup
    );
    this.emailService.clearAndPatch(
      this.emailService.DL_Data.get('bcc') as FormGroup,
      emailDL.get('bcc') as FormGroup
    );
    // this.emailDistributionList = emailDL;
    this.emailService.selectedDLName = emailDL?.getRawValue()?.name;
    this.distributionListId = this.distributionLists[index]?.id;
    this.showExistingDistributionList = !this.showExistingDistributionList;
    this.validateDistributionList();
    this.emailService.setDistributionList(this.emailService.DL_Data);
  }

  // transformDL() {
  // TODO: DL Transformation
  // }

  /**
   * Download Distribution List Template
   */
  onDownloadTemplate(): void {
    this.downloadService.getFile(
      '/download/templates',
      `text/xlsx;charset=utf-8;`,
      'users_template.xlsx'
    );
  }

  /**
   * Import Distribution List
   *
   * @param event file selection Event
   */
  fileSelectionHandler(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.downloadService
        .uploadFile('upload/distributionList', file)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async ({ to, cc, bcc }) => {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.distributionList.import.loading'
            )
          );
          const toAfterImport: any =
            to?.length > 0
              ? [
                  ...new Set(
                    to.map((email: string) => email.trim().toLowerCase())
                  ),
                ]
              : [];

          const ccAfterImport: any =
            cc?.length > 0
              ? [
                  ...new Set(
                    cc.map((email: string) => email.trim().toLowerCase())
                  ),
                ]
              : [];

          const bccAfterImport: any =
            bcc?.length > 0
              ? [
                  ...new Set(
                    bcc.map((email: string) => email.trim().toLowerCase())
                  ),
                ]
              : [];

          toAfterImport.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            if (
              !this.emailService.DL_Data?.getRawValue()?.to?.inputEmails?.includes(
                email
              )
            ) {
              this.emailService.DL_Data.get('to')
                .get('inputEmails')
                .push(this.formBuilder.control(email.trim()));
            }
          });

          ccAfterImport.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            if (
              !this.emailService.DL_Data?.getRawValue()?.cc?.inputEmails?.includes(
                email
              )
            ) {
              this.emailService.DL_Data.get('cc')
                .get('inputEmails')
                .push(this.formBuilder.control(email.trim()));
            }
          });

          bccAfterImport.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            if (
              !this.emailService.DL_Data?.getRawValue()?.bcc?.inputEmails?.includes(
                email
              )
            ) {
              this.emailService.DL_Data.get('bcc')
                .get('inputEmails')
                .push(this.formBuilder.control(email.trim()));
            }
          });

          this.templateFor = 'to';
          await this.validateDistributionList();

          if (this.fileElement) this.fileElement.nativeElement.value = '';
          event.target.value = null;
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.distributionList.import.success'
            )
          );
        });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.emailService.datasetsForm.setControl(
      'emailDistributionList',
      this.emailService.DL_Data
    );
  }

  /**
   * The distribution list should have at least
   * one To email address and name to proceed with next steps
   */
  validateDistributionList() {
    this.isNameDuplicate();

    //Distribution List name is valid
    this.emailService.distributionListName =
      this.emailService.DL_Data.get('name').value;
    this.emailService.validateNextButton();
  }

  /**
   * Maintains paginator data
   */
  toggleExistingDistributionList() {
    this.showExistingDistributionList = !this.showExistingDistributionList;
    const event: UIPageChangeEvent = {
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      previousPageIndex: 0,
      skip: 0,
      totalItems: this.cacheDistributionList.length,
    };
    this.onExistingList(event);
  }

  /**
   * Maintains distribution page data.
   *
   * @param event The page change event.
   */
  onExistingList(event: UIPageChangeEvent) {
    this.cachedData = handleTablePageEvent(
      event,
      this.pageInfo,
      this.cacheDistributionList
    );
    this.distributionLists = this.cachedData;
  }

  /**
   *
   * click of create New DL , so we are clearingthe data or reseting the form for reuse again
   */
  createNewDL() {
    this.distributionListId = '';
    this.showExistingDistributionList = !this.showExistingDistributionList;
    this.emailService.selectedDLName = '';
    this.emailService.distributionListName = '';
    // this.emailDistributionList.get('name').setValue('');
    this.emailService.datasetsForm
      ?.get('emailDistributionList')
      ?.get('name')
      ?.setValue('');
    this.emailService.datasetsForm
      ?.get('emailDistributionList')
      ?.get('id')
      ?.setValue(null);

    this.clearAllTabsData('to');
    this.clearAllTabsData('cc');
    this.clearAllTabsData('bcc');
    this.emailService.DL_Data = this.emailService.datasetsForm.get(
      'emailDistributionList'
    );
  }

  /**
   *
   *clearing data from to, cc, bcc by passign th tabname
   *
   * @param type - Tab name
   */
  clearAllTabsData(type: any) {
    const form = this.emailService.datasetsForm
      ?.get('emailDistributionList')
      ?.get(type);
    const query = form?.get('query') as FormGroup;
    query.get('name')?.setValue('');
    const fields = form?.get('query')?.get('fields') as FormArray;
    fields.clear();

    const inputEmails = form?.get('inputEmails') as FormArray;
    inputEmails.clear();

    const filter = form?.get('query')?.get('filter') as FormGroup;
    const filters = filter.get('filters') as FormArray;
    filters.clear();

    const csFilter = form
      ?.get('commonServiceFilter')
      ?.get('filter') as FormGroup;
    const csFilters = csFilter.get('filters') as FormArray;
    csFilters.clear();

    form?.get('resource')?.setValue('');

    // Enable changes on the form
    form?.enable();
  }

  /**
   * Enable form To, cc, bcc dropdown
   *
   * @param type tab name
   */
  enableForm(type: string) {
    const form = this.emailService.datasetsForm
      ?.get('emailDistributionList')
      ?.get(type);
    form?.enable();
  }
}
