import { Component, OnInit } from '@angular/core';
import { EmailService } from './email.service';
import { ApplicationService } from '../../services/application/application.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SnackbarService } from '@oort-front/ui';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, takeUntil } from 'rxjs';
import { UIPageChangeEvent, handleTablePageEvent } from '@oort-front/ui';
import { ApiConfiguration } from '../../models/api-configuration.model';
import { AppAbility, AuthService } from '../../services/auth/auth.service';
import { DownloadService } from '../../services/download/download.service';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { cloneDeep } from 'lodash';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 5;
/** Current Distribution list items page size (for pagination) */
const DISTRIBUTION_PAGE_SIZE = 5;

/** Email Notification setup component. */
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
   * Email Notification setup component.
   *
   * @param emailService The service for handling emails.
   * @param applicationService The service for handling applications.
   * @param formBuilder The builder for creating forms.
   * @param snackBar Shared snackbar service.
   * @param confirmService The service for confirmation dialogs.
   * @param translate The service for translation.
   * @param authService The service for authentication.
   * @param downloadService The service for downloading files.
   * @param ability The app ability
   * @param queryBuilder The query builder
   */
  constructor(
    public emailService: EmailService,
    public applicationService: ApplicationService,
    public formBuilder: FormBuilder,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    public authService: AuthService,
    public downloadService: DownloadService,
    public ability: AppAbility,
    public queryBuilder: QueryBuilderService
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
      const datasetArray = this.emailService.datasetsForm.get(
        'datasets'
      ) as FormArray;
      datasetArray.controls.forEach(
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
            ele.node.emailDistributionList.name !== null &&
            ele.node.emailDistributionList.name !== ''
          ) {
            this.emailService.distributionListNames.push(
              ele.node?.emailDistributionList?.name.trim().toLowerCase()
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
            ele.node.emailDistributionList.name !== null &&
            ele.node.emailDistributionList.name !== ''
          ) {
            this.distributionLists.push(ele.node.emailDistributionList);
            this.emailService.distributionListNames.push(
              ele.node?.emailDistributionList?.name.trim().toLowerCase()
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
          if (uniquDistributionLists.includes(ele.name.toLowerCase())) {
            uniquDistributionLists = uniquDistributionLists.filter(
              (name) => ele.name.toLowerCase() !== name
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
        const emailData = res.data.editEmailNotification;
        this.emailService.configId = emailData.id;
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
          emailData?.datasets?.forEach((element: any) => {
            delete element?.__typename;
            delete element?.query?.__typename;
          });
          delete emailData?.emailLayout?.__typename;
          delete emailData?.__typename;
          delete emailData?.emailDistributionList?.__typename;
          delete emailData.isDeleted;
          delete emailData.lastExecution;
          delete emailData.status;
          // prepares edit data if it is clone
          this.prepareEditData(emailData, false, true);
        } else {
          this.emailService.editId = id;
          this.prepareEditData(emailData, isSendEmail);
        }
      });
  }

  /**
   * Prepares the data for editing an email notification.
   *
   * @param emailData The data of the email notification to be edited.
   * @param isSendEmail Whether to send the email notification.
   * @param isClone Identify it is cloned or not
   */
  prepareEditData(emailData: any, isSendEmail?: boolean, isClone?: boolean) {
    if (isClone) {
      this.emailService.isEdit = false;
    } else {
      this.emailService.isEdit = true;
    }
    this.emailService.isDirectSend = isSendEmail ?? false;
    this.emailService.draftStepper = emailData.draftStepper;
    this.emailService.isLinear = false;
    const distributionListNames = this.emailService.distributionListNames;
    const emailNotificationNames = this.emailService.emailNotificationNames;
    this.emailService.distributionListNames = distributionListNames.filter(
      (name) => {
        const distributionListName = emailData.emailDistributionList?.name;
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
    this.emailService.emailDistributionList = {
      name: '',
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
    for (let index = 0; index < emailData.datasets.length; index++) {
      //Adding Tabs detail
      dataArray.push(
        this.createNewDataSetGroup(emailData.datasets[index], index)
      );
      // this.formatDataArray(this.emailService.datasetsForm.controls.datasets);
      if (index === 0) {
        this.emailService.tabs[0].title = emailData.datasets[index].name;
        this.emailService.tabs[0].content = emailData.datasets[index].name;
      } else {
        this.emailService.tabs.push({
          title: emailData.datasets[index].name,
          content: emailData.datasets[index].name,
          active: false,
          index: index,
        });
      }
    }
    this.emailService.tabs.forEach((ele: any) => {
      ele.active = false;
    });
    this.emailService.tabs[this.emailService.tabs.length - 1].active = true;

    // Creating DatasetForm
    this.emailService.datasetsForm = this.formBuilder.group({
      name: emailData.name,
      notificationType: emailData.notificationType,
      datasets: emailData.datasets?.length
        ? dataArray
        : this.emailService.datasetsForm.controls.datasets,
      emailDistributionList: {
        name: emailData.emailDistributionList.name,
        To: emailData.emailDistributionList.To,
        Cc: emailData.emailDistributionList.Cc,
        Bcc: emailData.emailDistributionList.Bcc,
      },
      emailLayout: emailData.emailLayout,
      schedule: emailData.schedule,
    });

    // Setting up edit screen
    this.emailService.isExisting = !this.emailService.isExisting;

    // Setting up Recipients data
    this.emailService.emailDistributionList =
      this.emailService.datasetsForm.controls['emailDistributionList'].value;

    // Setting up Layout Data
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

    // For each dataset, query its metadata
    const promises = emailData.datasets.map((dataset: any) => {
      return firstValueFrom(
        this.emailService.fetchResourceData(dataset.resource.id)
      ).then(({ data }) => {
        if (data.resource.metadata) {
          // const queryTemp: any = data.resource;
          // const newData = this.queryBuilder.getFields(queryTemp.queryName);
          // const metadata = data.resource.metadata;
          // dataset?.fields?.forEach((x: any) => {
          //   x.options =
          //     metadata.filter((m: any) => m.name == x.name).length > 0
          //       ? metadata.filter((m: any) => m.name == x.name)[0].options
          //       : dataset.fields.options;
          // });
        }
      });
    });

    // Execute all queries in parallel and update metadata loading status when done
    Promise.all(promises).finally(() => {
      if (isSendEmail) {
        this.emailService.stepperStep = 5;
      } else {
        this.emailService.stepperStep = 0;
      }
    });
  }

  /**
   * Iterates over the dataArray controls, updates values based on data.query, and sets additional properties.
   *
   * @param dataArray - The array of data to format
   * @returns The formatted data array
   */
  formatDataArray(dataArray: any): any {
    dataArray.controls.forEach((dataset: FormGroup) => {
      let data = dataset.value;
      if (data.query && !data.resource) {
        const newDataset = this.emailService.createNewDataSetGroup();
        const newQuery = newDataset.get('query') as FormGroup;
        const tempQueryData = cloneDeep(data.query);
        newQuery.get('name')?.setValue(tempQueryData.name);
        newQuery.get('filter')?.setValue(tempQueryData.filter);
        newQuery.get('fields')?.setValue(tempQueryData.fields);

        newDataset.get('name')?.setValue(data.name);
        newDataset.get('resource')?.setValue(tempQueryData.resource);
        newDataset.get('blockType')?.setValue(tempQueryData.blockType);
        newDataset.get('textStyle')?.setValue(tempQueryData.textStyle);
        newDataset.get('tableStyle')?.setValue(tempQueryData.tableStyle);
        newDataset.get('pageSize')?.setValue(tempQueryData.pageSize);
        newDataset
          .get('individualEmail')
          ?.setValue(tempQueryData.isIndividualEmail ?? false);
        newDataset
          .get('sendAsAttachment')
          ?.setValue(tempQueryData.sendAsAttachment ?? false);
        data = newDataset;
      }
    });
    return dataArray;
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
      name: ele.name,
      query: this.formBuilder.group({
        name: ele.query.name,
        filter: this.getFilterGroup(ele.query.filter),
        fields:
          ele?.query?.fields?.length > 0
            ? this.formBuilder.array(
                ele?.query?.fields.map((field: any) =>
                  this.formBuilder.control(field)
                )
              )
            : this.formBuilder.array([]),
      }),
      resource: ele.resource,
      pageSize: ele.pageSize,
      cacheData: {},
      blockType: 'table', // Either Table or Text
      tableStyle: this.emailService.getTableStyles(),
      textStyle: null,
      individualEmail: ele.individualEmail,
    });
    this.emailService.setEmailFields(ele.query.fields);
    this.emailService.setSeparateEmail(ele.individualEmail, index);

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
    return this.formBuilder.group({
      field: filter.field,
      operator: filter.operator,
      value: Array.isArray(filter.value)
        ? this.formBuilder.array(filter.value)
        : filter.value,
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
        this.emailService
          .deleteEmailNotification(data.id, this.applicationId)
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotDeleted',
                    {
                      type: this.translate.instant(
                        'common.email.notification.one'
                      ),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                if (data) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'pages.application.settings.emailDeleted'
                    )
                  );
                  this.emailService.emailListLoading = true;
                  this.distributionLists = [];
                  this.emailNotifications = [];
                  this.templateActualData = [];
                  this.filterTemplateData = [];
                  this.getExistingTemplate();
                }
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
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
