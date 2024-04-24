import { Component, OnInit } from '@angular/core';
import { EmailService } from './email.service';
import { ApplicationService } from '../../services/application/application.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { UIPageChangeEvent, handleTablePageEvent } from '@oort-front/ui';
import { ApiConfiguration } from '../../models/api-configuration.model';
import { AuthService } from '../../services/auth/auth.service';
import { DownloadService } from '../../services/download/download.service';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 5;
/**
 *
 */
const DISTRIBUTION_PAGE_SIZE = 5;
/**
 * Email Notification setup component.
 */
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent extends UnsubscribeComponent implements OnInit {
  /** Data for filtering templates. */
  filterTemplateData: any = [];

  /** Actual data for templates. */
  templateActualData: any = [];

  /** Application ID. */
  public applicationId = '';

  /** Distribution lists. */
  public distributionLists: any = [];

  /** Email notifications. */
  public emailNotifications: any = [];

  /** Page information for pagination. */
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
    skip: 0,
    limit: DEFAULT_PAGE_SIZE,
  };

  /** Displayed columns in the table. */
  public displayedColumns = ['name', 'alerttype', 'createdby', 'actions'];

  /** Columns for distribution. */
  public distributionColumn = ['name'];

  /** Cached API configurations. */
  public cachedApiConfigurations: ApiConfiguration[] = [];

  /** Page information for distribution pagination. */
  public distributionPageInfo = {
    pageIndex: 0,
    pageSize: DISTRIBUTION_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /** Cached distribution list. */
  cacheDistributionList: any = [];

  /**
   * Constructor for the EmailComponent.
   *
   * @param emailService The service for handling emails.
   * @param applicationService The service for handling applications.
   * @param formBuilder The builder for creating forms.
   * @param confirmService The service for confirmation dialogs.
   * @param translate The service for translation.
   * @param authService The service for authentication.
   * @param downloadService The service for downloading files.
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    public formBuilder: FormBuilder,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    public authService: AuthService,
    public downloadService: DownloadService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      this.applicationId = res?.id;
    });
    this.getExistingTemplate();
  }

  /**
   * Confirmation Tab
   */
  confirmClose(): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.close'),
      content: this.translate.instant('common.notifications.email.close'),
      confirmText: 'Confirm',
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.toggle();
      }
    });
  }

  /**
   * Resets email notification for user to go back to list.
   *
   * @param isNew value of if the user is creating a new email notification.
   */
  toggle(isNew?: boolean) {
    console.log('Toggle is calling');
    this.emailService.isLinear = true;
    this.emailService.stepperStep = 0;
    this.emailService.disableSaveAndProceed.next(false);
    this.emailService.enableAllSteps.next(false);
    if (isNew) {
      this.emailService.disableFormSteps.next({
        stepperIndex: 0,
        disableAction: true,
      });
    }
    this.emailService.isExisting = !this.emailService.isExisting;
    this.emailService.enableAllSteps.next(false);
    if (isNew) {
      this.emailService.disableFormSteps.next({
        stepperIndex: 0,
        disableAction: true,
      });
    }
    if (!this.emailService.isExisting) {
      this.emailService.resetDataSetForm();
      this.emailService.setDatasetForm();
    } else {
      const dataSetArray = this.emailService.datasetsForm.get(
        'dataSets'
      ) as FormArray;
      dataSetArray.controls.forEach(
        (datasetControl: AbstractControl<any, any>) => {
          const datasetFormGroup = datasetControl as FormGroup | null;
          datasetFormGroup?.get('cacheData')?.reset();
        }
      );
      this.emailService.selectedDataSet = '';
    }
    this.emailService.isEdit ? (this.emailService.isEdit = false) : null;
    this.emailService.emailListLoading = true;
    this.emailService
      .getEmailNotifications(this.applicationId)
      .subscribe((res: any) => {
        this.emailService.distributionListNames = [];
        this.emailService.emailNotificationNames = [];
        if (res?.data?.emailNotifications?.edges?.length === 0) {
          this.emailService.emailListLoading = false;
        }
        res?.data?.emailNotifications?.edges?.forEach((ele: any) => {
          this.emailService.emailListLoading = false;
          if (
            ele.node.recipients.distributionListName !== null &&
            ele.node.recipients.distributionListName !== ''
          ) {
            this.emailService.distributionListNames.push(
              ele.node?.recipients?.distributionListName.trim().toLowerCase()
            );
          }
          this.emailService.emailNotificationNames.push(
            ele.node.name.trim().toLowerCase()
          );
        });
        const distributionListPaginationConfig = {
          pageIndex: 0,
          pageSize: this.distributionPageInfo.pageSize,
          previousPageIndex: 0,
          skip: 0,
          totalItems: this.cacheDistributionList.length,
        };
        const notificationListPaginationConfig = {
          pageIndex: 0,
          pageSize: this.pageInfo.pageSize,
          previousPageIndex: 0,
          skip: 0,
          totalItems: this.templateActualData.length,
        };
        this.onDistributionPage(distributionListPaginationConfig);
        this.onPage(notificationListPaginationConfig);
      });
  }

  /**
   * Retrieves existing Email Notification.
   */
  getExistingTemplate() {
    this.emailService.emailListLoading = true;
    this.emailService.isExisting = true;
    this.emailService.isPreview = false;
    this.emailService.isEdit = false;
    this.emailService.isLinear = false;
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      this.applicationId = res?.id;
    });
    this.emailService
      .getEmailNotifications(this.applicationId)
      .subscribe((res: any) => {
        this.templateActualData = [];
        if (res?.data?.emailNotifications?.edges?.length === 0) {
          this.emailService.emailListLoading = false;
        }
        this.distributionLists = [];
        this.emailService.distributionListNames = [];
        this.emailService.emailNotificationNames = [];
        res?.data?.emailNotifications?.edges?.forEach((ele: any) => {
          this.templateActualData.push(ele.node);
          this.emailService.emailListLoading = false;
          if (
            ele.node.recipients.distributionListName !== null &&
            ele.node.recipients.distributionListName !== ''
          ) {
            this.distributionLists.push(ele.node.recipients);
            this.emailService.distributionListNames.push(
              ele.node?.recipients?.distributionListName.trim().toLowerCase()
            );
          }
          this.emailService.emailNotificationNames.push(
            ele.node.name?.trim()?.toLowerCase()
          );
        });
        let uniquDistributionLists = Array.from(
          new Set(this.emailService.distributionListNames)
        );
        this.distributionLists = this.distributionLists.filter((ele: any) => {
          if (
            uniquDistributionLists.includes(
              ele.distributionListName.toLowerCase()
            )
          ) {
            uniquDistributionLists = uniquDistributionLists.filter(
              (name) => ele.distributionListName.toLowerCase() !== name
            );
            return true;
          } else {
            return false;
          }
        });
        this.filterTemplateData = this.templateActualData;
        this.emailNotifications = this.filterTemplateData.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res?.data?.emailNotifications?.edges.length;

        this.cacheDistributionList = this.distributionLists;
        this.distributionLists = this.cacheDistributionList.slice(
          this.distributionPageInfo.pageSize *
            this.distributionPageInfo.pageIndex,
          this.distributionPageInfo.pageSize *
            (this.distributionPageInfo.pageIndex + 1)
        );
        this.distributionPageInfo.length = this.cacheDistributionList.length;
      });
  }

  /**
   * Searches the template based on the input event.
   *
   * @param event The event object.
   */
  searchTemplate(event: any) {
    const searchText = event.target.value?.trim()?.toLowerCase();
    this.filterTemplateData = this.templateActualData.filter((x: any) =>
      x.name.toLowerCase().includes(searchText.toLowerCase())
    );
    this.emailNotifications = this.filterTemplateData.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.pageInfo.length = this.filterTemplateData.length;
  }

  /**
   * Retrieves an email notification by its ID.
   *
   * @param id The ID of the email notification.
   * @param isClone Whether to it is a clone of another email notification.
   * @param isSendEmail Whether to send the email notification.
   */
  getEmailNotificationById(
    id: string,
    isClone?: boolean,
    isSendEmail?: boolean
  ) {
    this.emailService.emailListLoading = true;
    this.emailService.enableAllSteps.next(true);
    this.emailService
      .getEmailNotification(id, this.applicationId)
      .subscribe((res) => {
        const emailData = res.data.editAndGetEmailNotification;
        this.emailService.configId = res?.data?.editAndGetEmailNotification?.id;
        if (isClone) {
          let maxCloneNumber = 0;
          const filteredEmailList: string[][] =
            this.emailService.emailNotificationNames
              .map((notification: string) => notification.split('_clone'))
              .filter(
                (cloneNotificationName) =>
                  cloneNotificationName.length > 1 &&
                  cloneNotificationName[0] ===
                    emailData.name.toLowerCase().split('_clone')[0]
              );
          if (filteredEmailList.length > 0) {
            filteredEmailList.forEach(
              (filteredEmail: string[], index: number) => {
                if (
                  filteredEmail[0] ===
                  emailData.name.trim().toLowerCase().split('_clone')[0]
                ) {
                  if (filteredEmail[filteredEmail.length - 1] !== '') {
                    maxCloneNumber =
                      maxCloneNumber <
                      Number(filteredEmail[filteredEmail.length - 1])
                        ? Number(filteredEmail[filteredEmail.length - 1]) + 1
                        : maxCloneNumber;
                  } else if (
                    filteredEmail[1] === '' &&
                    maxCloneNumber === 0 &&
                    index === filteredEmailList.length - 1
                  ) {
                    maxCloneNumber = 1;
                  }
                }
              }
            );
            if (maxCloneNumber > 0) {
              emailData.name =
                emailData.name.split('_Clone')[0] + '_Clone' + maxCloneNumber;
            } else {
              emailData.name = emailData.name + '_Clone';
            }
          } else {
            emailData.name = emailData.name + '_Clone';
          }
          delete emailData.createdAt;
          delete emailData.id;
          delete emailData.createdBy;
          delete emailData.modifiedAt;
          emailData.applicationId = this.applicationId;
          emailData?.dataSets?.forEach((element: any) => {
            delete element.__typename;
            delete element.resource.__typename;
            element?.fields.forEach((ele: any) => {
              delete ele.__typename;
            });
          });
          delete emailData?.emailLayout?.__typename;
          delete emailData.__typename;
          delete emailData?.recipients?.__typename;
          delete emailData.isDeleted;
          delete emailData.lastExecution;
          delete emailData.status;
          this.emailService
            .addEmailNotification(emailData)
            .subscribe((res: any) => {
              this.emailService.emailListLoading = false;
              this.emailService.configId = res.data.addEmailNotification.id;
              this.getEmailNotificationById(
                res.data.addEmailNotification.id,
                false
              );
            });
        } else {
          this.prepareEditData(emailData, isSendEmail);
          this.emailService.editId = id;
        }
      });
  }

  /**
   * Prepares the data for editing an email notification.
   *
   * @param emailData The data of the email notification to be edited.
   * @param isSendEmail Whether to send the email notification.
   */
  prepareEditData(emailData: any, isSendEmail?: boolean) {
    this.emailService.isEdit = true;
    this.emailService.isLinear = false;
    const distributionListNames = this.emailService.distributionListNames;
    const emailNotificationNames = this.emailService.emailNotificationNames;
    this.emailService.distributionListNames = distributionListNames.filter(
      (name) => {
        const distributionListName = emailData.recipients?.distributionListName;
        return (
          distributionListName !== null &&
          distributionListName.trim().toLowerCase() !== name
        );
      }
    );
    this.emailService.emailNotificationNames = emailNotificationNames.filter(
      (name) => {
        const emailNotificationName = emailData.name;
        return (
          emailNotificationName !== null &&
          emailNotificationName.trim().toLowerCase() !== name
        );
      }
    );
    this.emailService.allLayoutdata = {};
    this.emailService.allPreviewData = [];
    this.emailService.emailLayout = {};
    this.emailService.recipients = {
      distributionListName: '',
      To: [],
      Cc: [],
      Bcc: [],
    };
    this.emailService.tabs = [
      {
        title: `Block 1`,
        content: `Block 1 Content`,
        active: true,
        index: 0,
      },
    ];
    const dataArray: FormArray | any = new FormArray([]);
    for (let index = 0; index < emailData.dataSets.length; index++) {
      //Adding Tabs detail
      dataArray.push(
        this.createNewDataSetGroup(emailData.dataSets[index], index)
      );
      if (index === 0) {
        this.emailService.tabs[0].title = emailData.dataSets[index].name;
        this.emailService.tabs[0].content = emailData.dataSets[index].name;
      } else {
        this.emailService.tabs.push({
          title: emailData.dataSets[index].name,
          content: emailData.dataSets[index].name,
          active: false,
          index: index,
        });
      }
    }
    this.emailService.tabs.forEach((ele: any) => {
      ele.active = false;
    });
    this.emailService.tabs[this.emailService.tabs.length - 1].active = true;

    //Creating DatasetForm
    this.emailService.datasetsForm = this.formBuilder.group({
      name: emailData.name,
      notificationType: emailData.notificationType,
      dataSets: dataArray,
      recipients: {
        distributionListName: emailData.recipients.distributionListName,
        To: emailData.recipients.To,
        Cc: emailData.recipients.Cc,
        Bcc: emailData.recipients.Bcc,
      },
      emailLayout: emailData.emailLayout,
      schedule: emailData.schedule,
    });

    //Setting up edit screen
    this.emailService.isExisting = !this.emailService.isExisting;

    //Setting up Recipients data
    this.emailService.recipients =
      this.emailService.datasetsForm.controls['recipients'].value;

    //Setting up Layout Data
    this.emailService.emailLayout = {
      subject: emailData.emailLayout.subject,
      header: emailData.emailLayout.header,
      body: emailData.emailLayout.body,
      banner: emailData.emailLayout.banner,
      footer: emailData.emailLayout.footer,
    };

    this.emailService.allLayoutdata = {
      /** IMAGES AND STYLES */
      bannerImage: emailData?.emailLayout?.banner?.bannerImage,
      bannerImageStyle: emailData?.emailLayout?.banner?.bannerImageStyle,
      /** CONTAINER STYLE */
      containerStyle: emailData?.emailLayout?.banner?.containerStyle,
      /** FOOTER COPYRIGHT STYLE */
      copyrightStyle: emailData?.emailLayout?.banner?.copyrightStyle,
      /** EMAIL SUBJECT */
      txtSubject: emailData.emailLayout.subject,
      /** EMAIL HEADER */
      headerHtml: emailData?.emailLayout?.header?.headerHtml,
      headerLogo: emailData?.emailLayout?.header?.headerLogo,
      headerLogoStyle: emailData?.emailLayout?.header?.headerStyle,
      headerBackgroundColor:
        emailData?.emailLayout?.header?.headerBackgroundColor,
      headerTextColor: emailData.emailLayout?.header?.headerTextColor,
      headerStyle: emailData?.emailLayout?.header?.headerStyle,
      /** EMAIL BODY */
      bodyHtml: emailData?.emailLayout?.body?.bodyHtml,
      bodyBackgroundColor: emailData?.emailLayout?.body?.bodyBackgroundColor,
      bodyTextColor: emailData?.emailLayout?.body?.bodyTextColor,
      bodyStyle: emailData?.emailLayout?.body?.bodyStyle,
      /** EMAIL FOOTER */
      footerHtml: emailData?.emailLayout?.footer?.footerHtml,
      footerLogo: emailData?.emailLayout?.footer?.footerLogo,
      footerBackgroundColor:
        emailData?.emailLayout?.footer?.footerBackgroundColor,
      footerTextColor: emailData?.emailLayout?.footer?.footerTextColor,
      footerStyle: emailData?.emailLayout?.footer?.footerStyle,
      footerImgStyle: emailData?.emailLayout?.footer?.footerImgStyle,
      footerHtmlStyle: emailData?.emailLayout?.footer?.footerHtmlStyle,
    };

    this.emailService.datasetsForm
      .get('applicationId')
      ?.setValue(this.applicationId);

    // this.emailService.datasetSave.emit(true);
    if (isSendEmail) {
      this.emailService.getDataSet(emailData, true);
    } else {
      this.emailService.getDataSet(emailData, false);
      this.emailService.stepperStep = 0;
    }
  }

  /**
   * This function creates a new dataset group.
   *
   * @param ele The element to create the dataset group from.
   * @param index The index of the dataset.
   * @returns The newly created dataset group.
   */
  createNewDataSetGroup(ele: any, index: number): FormGroup {
    const tempData = this.formBuilder.group({
      resource: ele.resource,
      name: ele.name,
      pageSize: ele.pageSize,
      filter: this.getFilterGroup(ele.filter),
      fields: ele.fields,
      cacheData: {},
      blockType: 'table', // Either Table or Text
      tableStyle: this.emailService.getTableStyles(),
      textStyle: null,
      individualEmail: ele.individualEmail,
    });
    this.emailService.setSeparateEmail(ele.individualEmail, index);
    tempData.controls.fields.setValue(ele.fields);
    return tempData;
  }

  /**
   * This function groups the filters.
   *
   * @param filterData The data to group.
   * @returns The grouped filters.
   */
  getFilterGroup(filterData: any) {
    const filterArray: FormArray | any = new FormArray([]);
    filterData?.filters?.forEach((ele: any) => {
      filterArray.push(this.getNewFilterFields(ele));
    });
    return this.formBuilder.group({
      logic: filterData.logic,
      filters: filterArray,
    });
  }

  /**
   * Returns Filter Fields Form.
   *
   * @param filter filter data.
   * @returns filter fields form.
   */
  getNewFilterFields(filter: any): FormGroup {
    console.log(filter);
    return this.formBuilder.group({
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
      hideEditor: filter.hideEditor,
      inTheLast: this.formBuilder.group({
        number: filter.inTheLast?.number,
        unit: filter.inTheLast?.unit,
      }),
    });
  }

  /**
   * Deletes the specified email notification.
   *
   * @param data The email notification to be deleted.
   */
  public deleteEmailNotification(data: any) {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.email.notification.one'),
      }),
      content: 'Do you confirm the deletion of ' + data.name + ' ?',
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.emailService.emailListLoading = true;
        this.emailService
          .deleteEmailNotification(data.id, this.applicationId)
          .subscribe(() => {
            this.distributionLists = [];
            this.emailNotifications = [];
            this.templateActualData = [];
            this.filterTemplateData = [];
            this.getExistingTemplate();
          });
      }
    });
  }

  /**
   * Creates a clone of an email notification.
   *
   * @param data The specified email notification.
   */
  public cloneEmailNotification(data: any) {
    this.getEmailNotificationById(data.id, true);
  }

  /**
   * Sends an email list.
   *
   * @param data The data for the email list.
   */
  public sendEmailList(data: any) {
    this.getEmailNotificationById(data.id, false, true);
  }

  /**
   * This maintains page data.
   *
   * @param e The page change event.
   */
  onPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.pageInfo,
      this.filterTemplateData
    );
    this.emailNotifications = cachedData;
  }

  /**
   * Maintains distribution page data.
   *
   * @param e The page change event.
   */
  onDistributionPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.distributionPageInfo,
      this.cacheDistributionList
    );
    this.distributionLists = cachedData;
  }
}
