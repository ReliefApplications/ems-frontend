import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailService } from '../../email.service';
import { FormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../services/application/application.service';
import { DownloadService } from '../../../../services/download/download.service';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 5;
/**
 *
 */
const DISTRIBUTION_PAGE_SIZE = 5;
/**
 * Select Distribution component.
 */
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
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    public downloadService: DownloadService
  ) {
    this.getExistingTemplate();
    this.showExistingDistributionList =
      this.emailService.showExistingDistributionList;
  }

  public showEmailTemplate = false;
  public templateFor = '';
  public toEmailFilter!: FormGroup | any;
  public ccEmailFilter!: FormGroup | any;
  public bccEmailFilter!: FormGroup | any;
  public showExistingDistributionList = false;
  cacheDistributionList: any = [];
  public distributionLists: any = [];
  public distributionColumn = ['name', 'createdBy', 'email'];
  public distributionListId = '';
  public distributionPageInfo = {
    pageIndex: 0,
    pageSize: DISTRIBUTION_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };
  filterTemplateData: any = [];
  templateActualData: any = [];
  public loading = true;
  public applicationId = '';
  public emailNotifications: any = [];
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
    skip: 0,
    limit: DEFAULT_PAGE_SIZE,
  };
  public recipients: {
    distributionListName: string;
    To: string[];
    Cc: string[];
    Bcc: string[];
  } = {
    distributionListName: '',
    To: [],
    Cc: [],
    Bcc: [],
  };

  ngOnInit(): void {
    this.recipients = this.emailService.recipients;
    this.toEmailFilter = this.emailService.toEmailFilter;
    this.ccEmailFilter = this.emailService.ccEmailFilter;
    this.bccEmailFilter = this.emailService.bccEmailFilter;
    this.validateDistributionList();
  }

  /**
   *
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
    const enteredName = this.recipients.distributionListName
      .trim()
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
      this.recipients.To.length === 0 ||
      this.recipients.distributionListName.length === 0 ||
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
    this.recipients.To = data.emails;
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
    this.recipients.Cc = data.emails;
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
    this.recipients.Bcc = data.emails;
    this.bccEmailFilter = data.emailFilter;
  }

  ngOnDestroy(): void {
    this.emailService.recipients = this.recipients;
    this.emailService.toEmailFilter = this.toEmailFilter;
    this.emailService.ccEmailFilter = this.ccEmailFilter;
    this.emailService.bccEmailFilter = this.bccEmailFilter;
  }

  /**
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getExistingTemplate() {
    this.loading = true;
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      this.applicationId = res?.id;
    });
    this.emailService
      .getEmailNotifications(this.applicationId)
      .subscribe((res: any) => {
        this.distributionLists = res?.data?.emailNotifications?.edges ?? [];
      });
  }

  /**
   * @param index table row index
   */
  selectDistributionListRow(index: number): void {
    this.recipients = this.distributionLists[index].node.recipients;
    this.distributionListId = this.distributionLists[index].node.id;
    this.showExistingDistributionList = !this.showExistingDistributionList;
    this.validateDistributionList();
  }

  /**
   *
   */
  downloadDistributionListTemplate(): void {
    this.downloadService.downloadDistributionListTemplate();
  }

  /**
   * @param event file selection Event
   */
  fileSelectionHandler(event: any): void {
    this.showEmailTemplate = false;
    const file: File = event.target.files[0];
    if (file) {
      this.downloadService.importDistributionList(file).subscribe((res) => {
        this.recipients.To = [...this.recipients.To, ...res.To];
        this.recipients.Cc = [...this.recipients.Cc, ...res.Cc];
        this.recipients.Bcc = [...this.recipients.Bcc, ...res.Bcc];
        this.showEmailTemplate = true;
        this.templateFor = 'to';
        this.validateDistributionList();
      });
    }
  }

  /**
   * The distribution list should have at least
   * one To email address and name to proceed with next steps
   */
  validateDistributionList(): void {
    const hasDistributionListId =
      this.distributionListId !== null && this.distributionListId !== undefined;
    const isToEmpty = this.recipients.To.length === 0;
    const isDistributionListNameEmpty =
      this.recipients.distributionListName.length === 0;
    const isNameDuplicate = this.isNameDuplicate();

    let isValid = true;

    if (!hasDistributionListId) {
      // If distributionListId doesn't exist, check other conditions
      isValid = isToEmpty || isDistributionListNameEmpty || isNameDuplicate;
      this.emailService.disableSaveAndProceed.next(isValid);
      this.triggerDuplicateChecker();
    } else {
      // If distributionListId exists, check conditions
      isValid = isToEmpty || isDistributionListNameEmpty;
      this.emailService.disableSaveAndProceed.next(isValid);
    }
  }
}
