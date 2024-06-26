import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EmailService } from '../../email.service';
import { FormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../services/application/application.service';
import { DownloadService } from '../../../../services/download/download.service';
import { UIPageChangeEvent, handleTablePageEvent } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';

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
export class SelectDistributionComponent implements OnInit, OnDestroy {
  /**
   * Composite email distribution.
   *
   * @param emailService helper functions
   * @param applicationService helper functions
   * @param downloadService helper functions
   * @param snackBar snackbar helper function
   * @param translate translate helper function
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    public downloadService: DownloadService,
    public snackBar: SnackbarService,
    public translate: TranslateService
  ) {
    this.getExistingTemplate();
    this.showExistingDistributionList =
      this.emailService.showExistingDistributionList;
  }

  /** Flag indicating whether the email template is shown. */
  public showEmailTemplate = false;
  /** Type of email template. */
  public templateFor = '';
  /** Filter form group for TO email. */
  public toEmailFilter!: FormGroup | any;
  /** Filter form group for CC email. */
  public ccEmailFilter!: FormGroup | any;
  /** Filter form group for BCC email. */
  public bccEmailFilter!: FormGroup | any;
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
  public emailDistributionList: {
    name: string;
    To: string[];
    Cc: string[];
    Bcc: string[];
  } = {
    name: '',
    To: [],
    Cc: [],
    Bcc: [],
  };
  /** Flag indicating loading state. */
  public isLoading = false;
  /** Cached data. */
  public cachedData: any = {};
  /** Flag indicating whether the TO template is shown. */
  public showToTemplate = false;
  /** Flag indicating whether the CC template is shown. */
  public showCCTemplate = false;
  /** Flag indicating whether the BCC template is shown. */
  public showBccTemplate = false;

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
    this.emailDistributionList = this.emailService.emailDistributionList;
    this.toEmailFilter = this.emailService.toEmailFilter;
    this.ccEmailFilter = this.emailService.ccEmailFilter;
    this.bccEmailFilter = this.emailService.bccEmailFilter;
    this.validateDistributionList();

    // Toggle all dropdowns to open by default
    this.showToTemplate = true;
    this.showCCTemplate = true;
    this.showBccTemplate = true;
    const existingDataIndex = this.emailService.cacheDistributionList
      .map((x: any) => x.node)
      .map((y: any) => y.emailDistributionList)
      .findIndex(
        (x: any) =>
          x.name.toLowerCase() ==
          this.emailDistributionList?.name?.trim().toLowerCase()
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
   * This method is used to show/hide the email template
   *
   * @param templateFor distribution email template for [ to | cc | bcc ]
   */
  toggleDropdown(templateFor: string): void {
    if (templateFor.toLocaleLowerCase() === 'to') {
      this.showToTemplate = !this.showToTemplate;
    } else if (templateFor.toLocaleLowerCase() === 'cc') {
      this.showCCTemplate = !this.showCCTemplate;
    } else if (templateFor.toLocaleLowerCase() === 'bcc') {
      this.showBccTemplate = !this.showBccTemplate;
    }
    if (!this.templateFor || this.templateFor === templateFor) {
      this.showEmailTemplate = !this.showEmailTemplate;
    }
    this.templateFor = templateFor;
  }

  /**
   * Name validation.
   *
   * @returns boolean
   */
  isNameDuplicate(): boolean {
    const enteredName = this.emailDistributionList?.name?.trim().toLowerCase();
    return this.emailService.distributionListNames.includes(enteredName);
  }

  /**
   * Duplicate Checking.
   *
   */
  triggerDuplicateChecker() {
    const flag = this.isNameDuplicate();
    if (
      this.emailDistributionList.To.length === 0 ||
      this.emailDistributionList.name.length === 0 ||
      flag
    ) {
      this.emailService.stepperDisable.next({ id: 2, isValid: false });
    } else {
      this.emailService.stepperDisable.next({ id: 2, isValid: true });
    }
  }

  /**
   * This method is used to set the 'To' field of the email.
   *
   * @param data The data to be set in the 'To' field.
   * @param data.emails Array of email addresses to be set in the 'To' field.
   * @param data.emailFilter The form group representing the email filter.
   */
  to(data: { emails: string[]; emailFilter: any }): void {
    this.emailDistributionList.To = data.emails;
    this.toEmailFilter = data.emailFilter;
    this.validateDistributionList();
  }

  /**
   * This method is used to set the 'CC' field of the email.
   *
   * @param data The data to be set in the 'CC' field.
   * @param data.emails Array of email addresses to be set in the 'CC' field.
   * @param data.emailFilter The form group representing the email filter.
   */
  cc(data: { emails: string[]; emailFilter: any }): void {
    this.emailDistributionList.Cc = data.emails;
    this.ccEmailFilter = data.emailFilter;
  }

  /**
   * This method is used to set the 'BCC' field of the email.
   *
   * @param data The data to be set in the 'BCC' field.
   * @param data.emails Array of email addresses to be set in the 'BCC' field.
   * @param data.emailFilter The form group representing the email filter.
   */
  bcc(data: { emails: string[]; emailFilter: any }): void {
    this.emailDistributionList.Bcc = data.emails;
    this.bccEmailFilter = data.emailFilter;
  }

  ngOnDestroy(): void {
    this.emailService.emailDistributionList = this.emailDistributionList;
    this.emailService.toEmailFilter = this.toEmailFilter;
    this.emailService.ccEmailFilter = this.ccEmailFilter;
    this.emailService.bccEmailFilter = this.bccEmailFilter;
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
      .subscribe((res: any) => {
        this.distributionLists = res?.data?.emailNotifications?.edges ?? [];
        let uniquDistributionLists = Array.from(
          new Set(this.emailService.distributionListNames)
        );
        this.distributionLists = this.distributionLists.filter((ele: any) => {
          if (
            uniquDistributionLists.includes(
              ele.node.emailDistributionList.name?.toLowerCase()
            )
          ) {
            uniquDistributionLists = uniquDistributionLists.filter(
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
    this.emailDistributionList =
      this.distributionLists[index].node.emailDistributionList;
    this.distributionListId = this.distributionLists[index].node.id;
    this.showExistingDistributionList = !this.showExistingDistributionList;
    this.validateDistributionList();
  }

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
    this.showToTemplate = false;
    this.showCCTemplate = false;
    this.showBccTemplate = false;
    const file: File = event.target.files[0];
    if (file) {
      this.downloadService
        .uploadFile('upload/distributionList', file)
        .subscribe(({ To, Cc, Bcc }) => {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.email.distributionList.import.loading'
            )
          );
          this.emailDistributionList.To = [
            ...new Set([...this.emailDistributionList.To, ...To]),
          ];
          this.emailDistributionList.Cc = [
            ...new Set([...this.emailDistributionList.Cc, ...Cc]),
          ];
          this.emailDistributionList.Bcc = [
            ...new Set([...this.emailDistributionList.Bcc, ...Bcc]),
          ];
          this.showToTemplate = true;
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

  /**
   * The distribution list should have at least
   * one To email address and name to proceed with next steps
   */
  validateDistributionList(): void {
    const isSaveAndProceedNotAllowed =
      this.emailDistributionList.To.length === 0 ||
      this.emailDistributionList.name.length === 0 ||
      this.emailDistributionList.name.trim() === '';
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
