import {
  Component,
  ElementRef,
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
import { firstValueFrom, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/public-api';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../../../../services/rest/rest.service';

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
  /** Recipients data. */
  public emailDistributionList: FormGroup | any =
    this.emailService.datasetsForm.get('emailDistributionList');
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

  /** Reference to file upload element. */
  @ViewChild('fileUpload', { static: true }) fileElement:
    | ElementRef
    | undefined;

  ngOnInit(): void {
    this.enableForm('to');
    this.enableForm('cc');
    this.enableForm('bcc');
    if (
      this.emailService?.editId &&
      this.emailService?.emailDistributionList?.id
    ) {
      this.distributionListId = this.emailService.emailDistributionList.id;
      this.emailService.selectedDLName =
        this.emailService.emailDistributionList?.name;
    }
    if (
      !this.emailDistributionList?.get('to.query.filter.logic')?.value?.trim()
    ) {
      this.emailDistributionList.get('to.query.filter.logic').setValue('and');
    }
    if (
      !this.emailDistributionList?.get('cc.query.filter.logic')?.value?.trim()
    ) {
      this.emailDistributionList.get('cc.query.filter.logic').setValue('and');
    }
    if (
      !this.emailDistributionList?.get('bcc.query.filter.logic')?.value?.trim()
    ) {
      this.emailDistributionList.get('bcc.query.filter.logic').setValue('and');
    }

    if (
      !this.emailDistributionList
        ?.get('to.commonServiceFilter.filter.logic')
        ?.value?.trim()
    ) {
      this.emailDistributionList
        .get('to.commonServiceFilter.filter.logic')
        .setValue('and');
    }
    if (
      !this.emailDistributionList
        ?.get('cc.commonServiceFilter.filter.logic')
        ?.value?.trim()
    ) {
      this.emailDistributionList
        .get('cc.commonServiceFilter.filter.logic')
        .setValue('and');
    }
    if (
      !this.emailDistributionList
        ?.get('bcc.commonServiceFilter.filter.logic')
        ?.value?.trim()
    ) {
      this.emailDistributionList
        .get('bcc.commonServiceFilter.filter.logic')
        .setValue('and');
    }
    if (!this.isAllSeparate()) {
      this.validateDistributionList();
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
        this.emailDistributionList.get('name')?.patchValue('');
        this.clearDL(this.emailDistributionList.get('to') as FormGroup);
        this.clearDL(this.emailDistributionList.get('cc') as FormGroup);
        this.clearDL(this.emailDistributionList.get('bcc') as FormGroup);
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
    const enteredName = this.emailDistributionList
      ?.get('name')
      ?.value?.trim()
      .toLowerCase();
    if (
      this.emailService.selectedDLName?.trim()?.toLowerCase() !==
      enteredName?.trim()?.toLowerCase()
    ) {
      const isDupe =
        this.emailService.distributionListNames.includes(enteredName);
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
      this.emailDistributionList.get('name').value.length === 0 ||
      flag
    ) {
      this.emailService.stepperDisable.next({ id: 2, isValid: false });
    } else {
      this.emailService.stepperDisable.next({ id: 2, isValid: true });
      this.emailService.distributionListName =
        this.emailDistributionList.get('name').value;
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

        //START :- filter distribution list data according to the Resource
        const allDatasetResources =
          this.emailService.datasetsForm.value.datasets.map(
            (ele: any) => ele.resource
          );
        let filtered_DL = this.distributionLists.filter(
          (x: any) =>
            x.to?.resource === null ||
            x.to?.resource === '' ||
            allDatasetResources.includes(x.to?.resource)
        );
        filtered_DL = filtered_DL.filter(
          (x: any) =>
            x.cc?.resource === null ||
            x.cc?.resource === '' ||
            allDatasetResources.includes(x.cc?.resource)
        );
        filtered_DL = filtered_DL.filter(
          (x: any) =>
            x.bcc?.resource === null ||
            x.bcc?.resource === '' ||
            allDatasetResources.includes(x.bcc?.resource)
        );
        this.distributionLists = filtered_DL;
        // END
        this.cacheDistributionList = this.distributionLists;
        this.emailService.cacheDistributionList = this.cacheDistributionList;
        const existingDataIndex =
          this.emailService.cacheDistributionList.findIndex(
            (x: any) =>
              x?.name?.toLowerCase() ==
              this.emailDistributionList
                ?.get('name')
                ?.value?.trim()
                ?.toLowerCase()
          );
        if (existingDataIndex > -1) {
          this.distributionListId =
            this.emailService.cacheDistributionList[existingDataIndex].id;
          this.emailService.selectedDLName =
            this.emailService.cacheDistributionList[existingDataIndex].name;
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

    this.emailDistributionList
      .get('name')
      ?.patchValue(emailDL.get('name')?.value);
    this.emailDistributionList.get('id')?.patchValue(emailDL.get('id')?.value);
    this.clearAndPatch(
      this.emailDistributionList.get('to') as FormGroup,
      emailDL.get('to') as FormGroup
    );
    this.clearAndPatch(
      this.emailDistributionList.get('cc') as FormGroup,
      emailDL.get('cc') as FormGroup
    );
    this.clearAndPatch(
      this.emailDistributionList.get('bcc') as FormGroup,
      emailDL.get('bcc') as FormGroup
    );
    // this.emailDistributionList = emailDL;
    this.emailService.selectedDLName = emailDL?.getRawValue()?.name;
    this.distributionListId = this.distributionLists[index]?.id;
    this.showExistingDistributionList = !this.showExistingDistributionList;
    this.validateDistributionList();
    this.emailService.setDistributionList(this.emailDistributionList);
  }

  /**
   * Clear distribution list
   *
   * @param targetGroup Form group you want to clear
   */
  clearDL(targetGroup: FormGroup): void {
    this.emailService.filterToEmails = [];
    // Clear 'resource'
    targetGroup.get('resource')?.patchValue('');

    // Clear 'query'
    const targetQuery = targetGroup.get('query') as FormGroup;
    targetQuery.reset();

    // Set 'name'
    targetQuery.get('name')?.setValue('');

    // Set 'filter'
    const targetFilter = targetQuery.get('filter') as FormGroup;
    targetFilter.get('logic')?.setValue('and');
    const targetFiltersArray = targetFilter.get('filters') as FormArray;
    targetFiltersArray.clear();

    // Set 'fields'
    const targetFieldsArray = targetQuery.get('fields') as FormArray;
    targetFieldsArray.clear();

    // Clear 'inputEmails'
    const targetInputEmails = targetGroup.get('inputEmails') as FormArray;
    targetInputEmails.clear();
  }

  /**
   * Clear and patch function
   *
   * @param targetGroup Form group you want to clear and patch
   * @param sourceGroup Form group you are retrieving the values from
   */
  clearAndPatch(targetGroup: FormGroup, sourceGroup: FormGroup): void {
    // Clear 'resource'
    targetGroup.get('resource')?.patchValue(sourceGroup.get('resource')?.value);

    // Clear 'query'
    const targetQuery = targetGroup.get('query') as FormGroup;
    const sourceQuery = sourceGroup.get('query') as FormGroup;
    targetQuery.reset();

    // Set 'name'
    targetQuery.get('name')?.setValue(sourceQuery.get('name')?.value);

    // Set 'filter'
    const targetFilter = targetQuery.get('filter') as FormGroup;
    const sourceFilter = sourceQuery.get('filter') as FormGroup;
    targetFilter.get('logic')?.setValue(sourceFilter.get('logic')?.value);
    const targetFiltersArray = targetFilter.get('filters') as FormArray;
    const sourceFiltersArray = sourceFilter.get('filters') as FormArray;
    targetFiltersArray.clear();
    sourceFiltersArray.controls.forEach((control) => {
      targetFiltersArray.push(this.formBuilder.control(control.value));
    });

    // Set 'fields'
    const targetFieldsArray = targetQuery.get('fields') as FormArray;
    const sourceFieldsArray = sourceQuery.get('fields') as FormArray;
    targetFieldsArray.clear();
    sourceFieldsArray.controls.forEach((control) => {
      if (
        control?.value?.kind === 'LIST' ||
        control?.value?.kind === 'OBJECT'
      ) {
        const fieldsData: any = new FormArray([]);
        control?.value?.fields?.forEach((y: any) => {
          fieldsData.push(
            this.formBuilder.group({
              ...y,
            })
          );
        });
        targetFieldsArray.push(
          this.formBuilder.group({
            ...control.value,
            fields: fieldsData,
          })
        );
      } else {
        targetFieldsArray.push(
          this.formBuilder.group({
            ...control.value,
          })
        );
      }
    });

    // Clear 'inputEmails'
    const targetInputEmails = targetGroup.get('inputEmails') as FormArray;
    const sourceInputEmails = sourceGroup.get('inputEmails') as FormArray;
    targetInputEmails.clear();
    sourceInputEmails.controls.forEach((control) => {
      targetInputEmails.push(this.formBuilder.control(control.value));
    });
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
              !this.emailDistributionList
                ?.getRawValue()
                ?.to?.inputEmails?.includes(email)
            ) {
              this.emailDistributionList
                .get('to')
                .get('inputEmails')
                .push(this.formBuilder.control(email.trim()));
            }
          });

          ccAfterImport.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            if (
              !this.emailDistributionList
                ?.getRawValue()
                ?.cc?.inputEmails?.includes(email)
            ) {
              this.emailDistributionList
                .get('cc')
                .get('inputEmails')
                .push(this.formBuilder.control(email.trim()));
            }
          });

          bccAfterImport.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            if (
              !this.emailDistributionList
                ?.getRawValue()
                ?.bcc?.inputEmails?.includes(email)
            ) {
              this.emailDistributionList
                .get('bcc')
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
      this.emailDistributionList
    );
  }

  /**
   *
   *check for valid email inouts
   *
   * @returns return true or false
   */
  checkToValid(): Promise<boolean> {
    return new Promise((resolve) => {
      this.loading = true;
      // Check if field
      if (
        this.emailDistributionList?.get('to')?.get('query')?.get('name')
          ?.value ||
        this.emailDistributionList?.get('to')?.get('resouce')?.value
      ) {
        if (this.emailService?.filterToEmails?.length === 0) {
          resolve(false);
        }
      }
      if (
        this.emailService.toDLHasFilter &&
        this.emailDistributionList?.get('to')?.get('query')?.get('name')?.value
      ) {
        const query = {
          emailDistributionList: cloneDeep(
            this.emailDistributionList.getRawValue()
          ),
        };
        firstValueFrom(
          this.http.post(
            `${this.restService.apiUrl}/notification/preview-distribution-lists/`,
            query
          )
        )
          .then((response: any) => {
            this.loading = false;
            this.emailService.filterToEmails =
              response?.to?.length > 0 ? response?.to : [];
            if (
              this.emailService?.datasetsForm?.value?.emailDistributionList
                ?.name?.length > 0 &&
              !this.isNameDuplicate() &&
              response?.to.length > 0
            ) {
              this.emailService.disableSaveAndProceed.next(false);
            }
            resolve(response?.to.length > 0);
          })
          .catch((error) => {
            console.error(error);
            // this.emailService.filterToEmails = [];
            resolve(false);
          });
      } else {
        resolve(
          this.emailDistributionList.get('to').get('inputEmails')?.value
            ?.length > 0
        );
      }
      this.loading = false;
      resolve(false);
    });
  }

  /**
   * The distribution list should have at least
   * one To email address and name to proceed with next steps
   */
  validateDistributionList() {
    this.isNameDuplicate();

    //Distribution List name is valid
    this.emailService.distributionListName =
      this.emailDistributionList.get('name').value;
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
    this.emailDistributionList = this.emailService.datasetsForm.get(
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
