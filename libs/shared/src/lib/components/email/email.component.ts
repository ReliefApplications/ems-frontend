import { Component, OnInit } from '@angular/core';
import { EmailService } from './email.service';
import { ApplicationService } from '../../services/application/application.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SnackbarService } from '@oort-front/ui';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
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
import { Dialog } from '@angular/cdk/dialog';
import { DistributionModalComponent } from '../distribution-lists/components/distribution-modal/distribution-modal.component';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 5;
/** Current Distribution list items page size (for pagination) */
const DISTRIBUTION_PAGE_SIZE = 5;
/** Current Template list items page size (for pagination) */
const TEMPLATE_PAGE_SIZE = 5;

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

  /** Page information for Template pagination. */
  public templatePageInfo = {
    pageIndex: 0,
    pageSize: TEMPLATE_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /** Actual data for distribution. */
  distributionActualData: any = [];
  /** Actual data for Custom template. */
  customActualData: any = [];
  /** Cached Template list. */
  cacheTemplateList: any = [];

  /** Custom Template Columns */
  public customTemplateColumns = ['subject', 'createdBy', 'actions'];

  /** An array to store custom template objects.*/
  public customTemplates: any = [];

  /** An array to store EN custom template objects.*/
  public emailCustomTemplates: any = [];

  /** Selected Tab Index - to manipulated button text based on selection */
  public selectedTabIndex = 0;

  /** Handler to show template creation wizard */
  public showTemplateCreationWizard = false;

  /** DL names */
  public uniqueDLNames: any = [];

  /** Distribution list names cache data */
  public cacheDistributionListNames: string[] = [];

  /** DL names unmodified data */
  public dlNamesActualData: string[] = [];

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
   * @param dialog The service for showing dialog.
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
    public queryBuilder: QueryBuilderService,
    public dialog: Dialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.emailService.isQuickAction = false;
    this.applicationService.application$.subscribe((res: any) => {
      this.emailService.datasetsForm.get('applicationId')?.setValue(res?.id);
      this.applicationId = res?.id;
    });
    this.getExistingTemplate();
    this.getCustomTemplates();
    // this.getDistributionList();
  }

  /**
   * Fetches custom templates from the email service and updates the component's customTemplates property.
   *
   * @returns {void}
   */
  getCustomTemplates(): void {
    this.emailService
      .getCustomTemplates(this.applicationId, true)
      .subscribe((res: any) => {
        this.emailCustomTemplates = res?.data?.customTemplates?.edges?.map(
          (template: any) => template?.node
        );
        this.customTemplates = this.emailCustomTemplates.filter(
          ({ isFromEmailNotification }: any) => !isFromEmailNotification
        );
        this.emailService.customTemplateNames = this.customTemplates.map(
          (template: any) => template?.name?.trim()?.toLowerCase()
        );
        this.customActualData = this.customTemplates;
        this.cacheTemplateList = this.customTemplates;
        this.customTemplates = this.cacheTemplateList.slice(
          this.templatePageInfo.pageSize * this.templatePageInfo.pageIndex,
          this.templatePageInfo.pageSize * (this.templatePageInfo.pageIndex + 1)
        );
        this.templatePageInfo.length = this.cacheTemplateList.length;
      });
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
   * Subscribes to an email notification.
   *
   * @param element The email notification object.
   * @param id The ID of the email notification to subscribe to.
   */
  async addSubscription(element: any, id: string) {
    try {
      await this.emailService.subscribeToEmail(id);
      element.userSubscribed = true;
    } catch (error) {
      console.error('Subscription failed', error);
    }
  }

  /**
   * Removes user from subscription to an email notification.
   *
   * @param element The email notification object.
   * @param id The ID of the email notification to subscribe to.
   */
  async removeSubscription(element: any, id: string) {
    try {
      await this.emailService.unsubscribeFromEmail(id);
      element.userSubscribed = false;
    } catch (error) {
      console.error('Subscription failed', error);
    }
  }

  /**
   * Resets email notification for user to go back to list.
   *
   * @param isNew value of if the user is creating a new email notification.
   */
  toggle(isNew?: boolean) {
    this.emailService.tabs = [
      {
        title: `Block 1`,
        content: `Block 1 Content`,
        active: true,
        index: 0,
      },
    ];
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
    this.emailService.isDirectSend = false;
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
      .subscribe(({ data }: any) => {
        this.emailService.distributionListNames = [];
        this.emailService.emailNotificationNames = [];
        if (data?.emailNotifications?.edges?.length === 0) {
          this.emailService.emailListLoading = false;
        }
        data?.emailNotifications?.edges?.forEach((ele: any) => {
          this.emailService.emailListLoading = false;
          this.emailService.emailNotificationNames.push(
            ele?.node?.name?.trim()?.toLowerCase()
          );
        });
        const distributionListPaginationConfig = {
          pageIndex: 0,
          pageSize: this.distributionPageInfo.pageSize,
          previousPageIndex: 0,
          skip: 0,
          totalItems: this.cacheDistributionListNames.length,
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
    this.getDistributionList();
    this.getCustomTemplates();
    this.emailService.datasetsForm?.get('emailDistributionList')?.reset();
    this.emailService.datasetsForm?.get('emailLayout')?.reset();
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
      .subscribe(({ data }: any) => {
        this.templateActualData = [];
        if (data?.emailNotifications?.edges?.length === 0) {
          this.emailService.emailListLoading = false;
        }

        this.emailService.distributionListNames = [];
        this.emailService.emailNotificationNames = [];
        data?.emailNotifications?.edges?.forEach((ele: any) => {
          if (!ele.node.isDeleted) {
            this.templateActualData.push(ele.node);
          }
          this.emailService.emailListLoading = false;

          this.emailService.emailNotificationNames.push(
            ele.node.name?.trim()?.toLowerCase()
          );
        });

        this.filterTemplateData = this.templateActualData;
        this.emailNotifications = this.filterTemplateData.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = this.templateActualData.length;
      });
    this.getDistributionList();
  }

  /**
   * Get Distribution List data
   *
   */
  getDistributionList() {
    this.emailService
      .getEmailDistributionList(this.applicationId)
      .subscribe((list: any) => {
        let tempDL: any = [];
        this.emailService.distributionListNames = [];
        list?.data?.emailDistributionLists?.edges?.forEach((ele: any) => {
          if (ele.node.name !== null && ele.node.name !== '') {
            tempDL.push(ele.node);
            this.emailService.distributionListNames.push(
              ele.node?.name.trim().toLowerCase()
            );
          }
        });
        let uniqueDistributionLists = Array.from(
          new Set(this.emailService.distributionListNames)
        );
        this.uniqueDLNames = [...uniqueDistributionLists];
        this.dlNamesActualData = cloneDeep(this.uniqueDLNames);
        tempDL = tempDL.filter((ele: any) => {
          if (
            uniqueDistributionLists.includes(ele?.name?.trim()?.toLowerCase())
          ) {
            uniqueDistributionLists = uniqueDistributionLists.filter(
              (name) => ele.name?.toLowerCase() !== name
            );
            return true;
          } else {
            return false;
          }
        });
        this.distributionActualData = cloneDeep(tempDL);
      });
  }

  /**
   * Searches the template based on the input event.
   *
   * @param event The event object.
   */
  searchTemplate(event: any) {
    const searchText = event?.target?.value?.trim()?.toLowerCase() ?? event;
    if (this.selectedTabIndex == 0) {
      this.filterTemplateData = this.templateActualData.filter((x: any) =>
        x.name?.toLowerCase().includes(searchText?.toLowerCase())
      );
      this.emailNotifications = this.filterTemplateData.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = this.filterTemplateData.length;
    } else if (this.selectedTabIndex == 1) {
      this.cacheDistributionListNames = this.dlNamesActualData?.filter(
        (name: any) => name?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
      if (this.cacheDistributionListNames.length > 0) {
        this.distributionPageInfo.pageIndex = 0;
      }
      this.uniqueDLNames = this.cacheDistributionListNames.slice(
        this.distributionPageInfo.pageSize *
          this.distributionPageInfo.pageIndex,
        this.distributionPageInfo.pageSize *
          (this.distributionPageInfo.pageIndex + 1)
      );
      this.distributionPageInfo.length = this.cacheDistributionListNames.length;
    } else if (this.selectedTabIndex == 2) {
      this.cacheTemplateList = this.customActualData?.filter((x: any) =>
        x.name.toLowerCase().includes(searchText.toLowerCase())
      );
      this.customTemplates = this.cacheTemplateList.slice(
        this.templatePageInfo.pageSize * this.templatePageInfo.pageIndex,
        this.templatePageInfo.pageSize * (this.templatePageInfo.pageIndex + 1)
      );
      this.templatePageInfo.length = this.cacheTemplateList.length;
    }
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
    this.emailService.isQuickAction = false;
    this.emailService.isDLNameDuplicate = false;
    this.emailService.emailListLoading = true;
    this.emailService.enableAllSteps.next(true);
    this.emailService
      .getEmailNotificationForEdition(id, this.applicationId)
      .subscribe((res) => {
        const emailData = res.data.editEmailNotification;
        this.emailService.configId = emailData.id;
        if (isClone) {
          let maxCloneNumber = 0;
          const filteredEmailList: string[][] =
            this.emailService.emailNotificationNames
              .filter((notification) => typeof notification === 'string')
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
    this.emailService.draftStepper = isSendEmail
      ? null
      : emailData.draftStepper;
    this.emailService.isLinear = false;
    const distributionList = this.distributionActualData.find(
      (dl: any) => dl.id === emailData.emailDistributionList
    );
    const emailLayout = this.emailCustomTemplates.find(
      (template: any) => template.id === emailData?.emailLayout
    );
    if (isClone) {
      delete emailLayout.id;
    }
    emailData.emailLayout = emailLayout;
    const distributionListNames = this.emailService.distributionListNames;
    const emailNotificationNames = this.emailService.emailNotificationNames;
    this.emailService.distributionListNames = distributionListNames.filter(
      (name) => {
        const distributionListName = distributionList?.name;
        return (
          distributionListName !== null &&
          distributionListName?.trim()?.toLowerCase() !== name
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
    const emailDL =
      this.emailService.populateDistributionListForm(distributionList);
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
      if (
        !emailData.datasets[index].name ||
        emailData.datasets[index].name.trim() === ''
      ) {
        emailData.datasets[index].name = `Block ${index + 1}`;
      }
      //Adding Tabs detail
      dataArray.push(
        this.createNewDataSetGroup(emailData.datasets[index], index)
      );
      // this.formatDataArray(this.emailService.datasetsForm.controls.datasets);
      if (index === 0) {
        this.emailService.tabs[0].title =
          emailData.datasets[index].name ?? 'Block 1';
        this.emailService.tabs[0].content =
          emailData.datasets[index].name ?? 'Block 1 Content';
      } else {
        this.emailService.tabs.push({
          title: emailData.datasets[index].name ?? `Block ${index + 1}`,
          content:
            emailData.datasets[index].name ?? `Block ${index + 1} Content`,
          active: false,
          index: index,
        });
      }
    }
    this.emailService.tabs.forEach((ele: any) => {
      ele.active = false;
    });
    this.emailService.tabs[this.emailService.tabs.length - 1].active = true;

    //Need this Set title after Setting atbs and active tab
    this.emailService.title.next(
      this.emailService.tabs.filter((x: any) => x?.active)?.[0]?.title
    );

    const subscriptionListArray = this.formBuilder.array([]);
    if (emailData.subscriptionList.length > 0) {
      emailData.subscriptionList.forEach((subscription: any) => {
        subscriptionListArray.push(new FormControl(subscription));
      });
    }

    // Creating DatasetForm
    this.emailService.datasetsForm = this.formBuilder.group({
      name: emailData.name,
      notificationType: emailData.notificationType,
      datasets: emailData.datasets?.length
        ? dataArray
        : this.emailService.datasetsForm.controls.datasets,
      emailDistributionList: emailDL,
      subscriptionList: subscriptionListArray,
      restrictSubscription: emailData.restrictSubscription,
      emailLayout: emailData.emailLayout,
      schedule: emailData.schedule,
    });

    // Setting up edit screen
    this.emailService.isExisting = !this.emailService.isExisting;

    // Setting up Recipients data
    this.emailService.emailDistributionList = this.emailService.datasetsForm
      .get('emailDistributionList')
      ?.getRawValue();

    // Setting up Layout Data
    this.emailService.emailLayout = {
      subject: emailData.emailLayout?.subject,
      header: emailData.emailLayout?.header,
      body: emailData.emailLayout?.body,
      banner: emailData.emailLayout?.banner,
      footer: emailData.emailLayout?.footer,
      id: emailData.emailLayout?.id,
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
      id: emailData?.emailLayout?.id,
    };

    this.emailService.datasetsForm
      .get('applicationId')
      ?.setValue(this.applicationId);

    // For each dataset, query its metadata
    const promises = emailData.datasets.map((dataset: any) => {
      return firstValueFrom(
        this.emailService.fetchResourceData(dataset?.resource?.id)
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
    // Iterate over each dataset in the dataArray
    dataArray.controls.forEach((dataset: FormGroup) => {
      let data = dataset.value;
      if (data.query && !data.resource) {
        const newDataset = this.emailService.createNewDataSetGroup();
        const newQuery = newDataset.get('query') as FormGroup;

        // Clone the query data to prevent mutation
        const tempQueryData = cloneDeep(data.query);

        // Set the name, filter, and fields of the new query group
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

        // Update the data with the new dataset group
        data = newDataset;
      }
    });

    // Return the formatted data array
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
    const fieldsArray = new FormArray<FormGroup>([]);
    ele?.query?.fields?.forEach((field: any) => {
      fieldsArray.push(this.emailService.createFieldsFormGroup(field));
    });

    const individualEmailFieldsArray =
      ele.individualEmailFields.length > 0
        ? this.formBuilder.array(
            ele.individualEmailFields.map((field: any) => {
              if (field?.kind === 'LIST' || field?.kind === 'OBJECT') {
                const nestedIndividualFields = new FormArray<FormGroup>([]);
                field?.fields?.forEach((nestedField: any) => {
                  nestedIndividualFields.push(
                    this.emailService.createFieldsFormGroup(nestedField)
                  );
                });
                return this.formBuilder.group({
                  ...field,
                  fields: nestedIndividualFields,
                });
              } else {
                return this.formBuilder.control(field);
              }
            })
          )
        : this.formBuilder.array([]);
    const tempData = this.formBuilder.group({
      name: new FormControl(ele.name),
      query: this.formBuilder.group({
        name: new FormControl(ele.query.name),
        filter: this.getFilterGroup(ele.query.filter),
        fields: fieldsArray,
      }),
      resource: new FormControl(ele.resource),
      reference: new FormControl(ele.reference),
      dataType: new FormControl(ele.resource ? 'Resource' : 'Reference Data'),
      pageSize: new FormControl(ele.pageSize),
      blockType: new FormControl('table'),
      tableStyle: new FormControl(this.emailService.getTableStyles()),
      textStyle: new FormControl(null),
      individualEmail: new FormControl(ele.individualEmail),
      individualEmailFields: individualEmailFieldsArray, // Attach individualEmailFields array
      navigateToPage: new FormControl(ele.navigateToPage),
      navigateSettings: this.formBuilder.group({
        title: new FormControl(ele.navigateSettings.title),
        pageUrl: new FormControl(ele.navigateSettings.pageUrl),
        field: new FormControl(ele.navigateSettings.field),
      }),
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
      logic: filterData?.logic,
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
   * Deletes the specified custom template.
   *
   * @param data The custom template to be deleted.
   */
  public deleteCustomTemplate(data: any) {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.email.customTemplate'),
      }),
      content: 'Do you confirm the deletion of ' + data.name + ' ?',
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.emailService.emailListLoading = true;
        this.emailService.deleteCustomTemplate(data.id).subscribe((res) => {
          if (res.data?.editCustomTemplate?.id) {
            this.emailService.emailListLoading = false;
            this.getCustomTemplates();
          }
        });
      }
    });
  }

  /**
   * Deletes the specified distribution list.
   *
   * @param data The custom template to be deleted.
   */
  public deleteDistributionList(data: any) {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.distributionList.one'),
      }),
      content: 'Do you confirm the deletion of ' + data.name + ' ?',
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.emailService.emailListLoading = true;
        this.emailService.deleteDistributionList(data.id).subscribe((res) => {
          this.emailService.emailListLoading = false;
          if (res.data?.editDistributionList?.id) {
            this.emailService.emailListLoading = false;
            this.getExistingTemplate();
            // this.getDistributionList();
          }
        });
      }
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
          .deleteEmailNotificationPermanently(data.id, this.applicationId)
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotDeleted',
                    {
                      value: this.translate.instant(
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
      this.cacheDistributionListNames
    );
    this.uniqueDLNames = cachedData;
  }

  /**
   * Maintains distribution page data.
   *
   * @param e The page change event.
   */
  onTemplatePage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.templatePageInfo,
      this.cacheTemplateList
    );
    this.customTemplates = cachedData;
  }

  /**
   * used to create new custom template
   */
  createTemplate(): void {
    this.showTemplateCreationWizard = true;
    !this.emailService.isCustomTemplateEdit
      ? this.emailService.resetAllLayoutData()
      : '';
  }

  /**
   * to handle the dialog of distribution list creation
   */
  distributionListDialogHandler() {
    const dialogRef = this.dialog.open(DistributionModalComponent, {
      data: { distributionListNames: this.emailService.distributionListNames },
      disableClose: true,
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getExistingTemplate();
    });
  }

  /**
   * To edit the distribution list from the list view
   *
   * @param distributionListData the distribution list data
   */
  editDistributionListHandler(distributionListData: any): void {
    const editDistributionListDialogReference = this.dialog.open(
      DistributionModalComponent,
      {
        data: { distributionListData, isEdit: true },
        disableClose: true,
      }
    );

    /* Need to update the list only if the data being updated */
    editDistributionListDialogReference.closed.subscribe(
      ({ isDistributionListUpdated }: any) => {
        if (isDistributionListUpdated) {
          this.getExistingTemplate();
          // this.getDistributionList();
        }
      }
    );
  }

  /**
   * Edit the custom template data.
   *
   * @param {any} data - The custom template data to be edited.
   * @returns {void}
   */
  editCustomTemplate(data: any) {
    this.emailService.isCustomTemplateEdit = true;
    this.emailService.datasetsForm.patchValue({
      emailLayout: data,
    });
    this.emailService.layoutTitle = data?.name;
    this.emailService.customTemplateNames =
      this.emailService.customTemplateNames.filter(
        (name) => name !== data?.name
      );
    this.emailService.emailLayout = {
      subject: data?.subject,
      header: data?.header,
      body: data?.body,
      banner: data?.banner,
      footer: data?.footer,
    };
    this.emailService.allLayoutdata = {
      /** IMAGES AND STYLES */
      bannerImage: data?.banner?.bannerImage,
      bannerImageStyle: data?.banner?.bannerImageStyle,
      /** CONTAINER STYLE */
      containerStyle: data?.banner?.containerStyle,
      /** FOOTER COPYRIGHT STYLE */
      copyrightStyle: data?.banner?.copyrightStyle,
      /** EMAIL SUBJECT */
      txtSubject: data?.subject,
      /** EMAIL HEADER */
      headerHtml: data?.header?.headerHtml,
      headerLogo: data?.header?.headerLogo,
      headerLogoStyle: data?.header?.headerStyle,
      headerBackgroundColor: data?.header?.headerBackgroundColor,
      headerTextColor: data?.header?.headerTextColor,
      headerStyle: data?.header?.headerStyle,
      /** EMAIL BODY */
      bodyHtml: data?.body?.bodyHtml,
      bodyBackgroundColor: data?.body?.bodyBackgroundColor,
      bodyTextColor: data?.body?.bodyTextColor,
      bodyStyle: data?.body?.bodyStyle,
      /** EMAIL FOOTER */
      footerHtml: data?.footer?.footerHtml,
      footerLogo: data?.footer?.footerLogo,
      footerBackgroundColor: data?.footer?.footerBackgroundColor,
      footerTextColor: data?.footer?.footerTextColor,
      footerStyle: data?.footer?.footerStyle,
      footerImgStyle: data?.footer?.footerImgStyle,
      footerHtmlStyle: data?.footer?.footerHtmlStyle,
    };

    this.emailService.customTemplateId = data.id;
    this.createTemplate();
  }

  /**
   * Close the custom template;
   */
  customTemplateClose() {
    this.emailService.datasetsForm?.get('emailLayout')?.reset();
    this.emailService.customTemplateId = '';
    this.emailService.isCustomTemplateEdit = false;
    this.emailService.allLayoutdata = {};
    this.emailService.emailLayout = {};
    this.emailService.customTemplateNames = this.customTemplates.map(
      (template: any) => template?.name?.trim()?.toLowerCase()
    );
  }

  /**
   *
   *Tab change function
   *
   * @param event selected Tab
   */
  onTabSelect(event: any) {
    this.selectedTabIndex = event;
    const searchText: any = document.getElementById(
      'exampleSelect'
    ) as HTMLElement;
    this.searchTemplate(searchText?.value ?? '');
  }
}
