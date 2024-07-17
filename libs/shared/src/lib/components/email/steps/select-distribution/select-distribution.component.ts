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
import { FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/public-api';

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
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    public downloadService: DownloadService,
    public snackBar: SnackbarService,
    public translate: TranslateService,
    public formBuilder: FormBuilder
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
    this.validateDistributionList();

    const existingDataIndex = this.emailService.cacheDistributionList
      .map((x: any) => x.node)
      .map((y: any) => y.emailDistributionList)
      .findIndex(
        (x: any) =>
          x.get('name').value.toLowerCase() ==
          this.emailDistributionList?.('name')?.value.trim().toLowerCase()
      );
    if (existingDataIndex > -1) {
      this.distributionListId =
        this.emailService.cacheDistributionList[existingDataIndex].node.id;
    }
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
    return this.emailService.distributionListNames.includes(enteredName);
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
    this.emailService
      .getEmailNotifications(this.applicationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.distributionLists = res?.data?.emailNotifications?.edges ?? [];
        let uniqueDistributionLists = Array.from(
          new Set(this.emailService.distributionListNames)
        );
        this.distributionLists = this.distributionLists.filter((ele: any) => {
          if (
            uniqueDistributionLists.includes(
              ele.node.emailDistributionList.name?.toLowerCase()
            )
          ) {
            uniqueDistributionLists = uniqueDistributionLists.filter(
              (name) =>
                ele.node.emailDistributionList.name?.toLowerCase() !== name
            );
            return true;
          } else {
            return false;
          }
        });
        this.cacheDistributionList = this.distributionLists;
        this.emailService.cacheDistributionList = this.cacheDistributionList;
        this.distributionLists = this.cacheDistributionList.slice(
          this.distributionPageInfo.pageSize *
            this.distributionPageInfo.pageIndex,
          this.distributionPageInfo.pageSize *
            (this.distributionPageInfo.pageIndex + 1)
        );
        this.distributionPageInfo.length = this.cacheDistributionList.length;
        this.isLoading = false;
      });
  }

  /**
   * Select Distribution List table row
   *
   * @param index table row index
   */
  selectDistributionListRow(index: number): void {
    const emailDL = this.emailService.populateDistributionListForm(
      this.distributionLists[index].node.emailDistributionList
    );

    this.emailDistributionList.patchValue({
      name: '',
      to: [],
      cc: [],
      bcc: [],
    });
    this.emailDistributionList
      .get('name')
      ?.patchValue(emailDL.get('name')?.value);
    this.emailDistributionList.get('to')?.patchValue(emailDL.get('to')?.value);
    this.emailDistributionList.get('cc')?.patchValue(emailDL.get('cc')?.value);
    this.emailDistributionList
      .get('bcc')
      ?.patchValue(emailDL.get('bcc')?.value);

    if (
      this.emailDistributionList.value.to.query.name?.trim() !== '' &&
      this.emailDistributionList.value.to.query.fields?.length === 0
    ) {
      this.emailDistributionList = emailDL;
    }
    this.distributionListId = this.distributionLists[index].node.id;
    this.showExistingDistributionList = !this.showExistingDistributionList;
    this.validateDistributionList();
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
        .subscribe(({ To, Cc, Bcc }) => {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.distributionList.import.loading'
            )
          );

          To.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            this.emailDistributionList
              .get('to')
              .get('inputEmails')
              .push(this.formBuilder.control(email.trim()));
          });

          Cc.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            this.emailDistributionList
              .get('cc')
              .get('inputEmails')
              .push(this.formBuilder.control(email.trim()));
          });

          Bcc.forEach((email: string) => {
            // Access the 'inputEmails' FormArray and push a new FormControl with the trimmed email
            this.emailDistributionList
              .get('bcc')
              .get('inputEmails')
              .push(this.formBuilder.control(email.trim()));
          });

          this.templateFor = 'to';
          this.validateDistributionList();
          if (this.fileElement) this.fileElement.nativeElement.value = '';
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
    this.emailService.datasetsForm.controls.emailDistributionList =
      this.emailDistributionList.controls;
    this.emailService.datasetsForm.value.emailDistributionList =
      this.emailDistributionList;
  }

  /**
   * The distribution list should have at least
   * one To email address and name to proceed with next steps
   */
  validateDistributionList(): void {
    // TODO: Change this to match new schema
    const isSaveAndProceedNotAllowed =
      // this.emailDistributionList.To.length === 0 ||
      !this.emailDistributionList.get('name')?.value ||
      this.emailDistributionList.get('name')?.value.trim() === '';
    this.emailService.disableSaveAndProceed.next(isSaveAndProceedNotAllowed);
    if (isSaveAndProceedNotAllowed) {
      this.emailService.disableFormSteps.next({
        stepperIndex: 2,
        disableAction: true,
      });
    }
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
}
