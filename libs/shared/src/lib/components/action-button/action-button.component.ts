import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActionButton } from './action-button.type';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { Router } from '@angular/router';
import { EmailService } from '../email/email.service';
import { Apollo } from 'apollo-angular';
import { EmailService as SharedEmailService } from '../../services/email/email.service';
import { ApplicationService } from '../../services/application/application.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { ContextService } from '../../services/context/context.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { lastValueFrom, map, of, Subject, takeUntil, tap } from 'rxjs';
import { Resource, ResourceQueryResponse } from '../../models/resource.model';
import { GET_RECORD_BY_ID, GET_RESOURCE_BY_ID } from './graphql/queries';
import { EDIT_RECORD } from './graphql/mutations';
import {
  EditRecordMutationResponse,
  RecordQueryResponse,
} from '../../models/record.model';
import { get, isEmpty, isNil, set } from 'lodash';
import { SnackbarSpinnerComponent } from '../snackbar-spinner/snackbar-spinner.component';
import { Layout } from '../../models/layout.model';
import { EmailNotification } from '../../models/email-notifications.model';

/**
 * Dashboard action button component.
 */
@Component({
  selector: 'shared-action-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, TranslateModule],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Action button definition */
  @Input() actionButton!: ActionButton;
  /** Should refresh button, some of them ( subscribe / unsubscribe ) can depend on other buttons */
  @Input() refresh!: Subject<void>;
  /** Record id */
  @Input() recordId?: string;
  /** Resource id */
  @Input() resourceId?: string;
  /** Reload parent event emitter */
  @Output() reloadParent = new EventEmitter<void>();
  /** Email notification, for subscribe & unsubscribe actions */
  private emailNotification?: EmailNotification;
  /** Current environment */
  private environment: any;

  /** @returns Should hide button */
  get showButton(): boolean {
    if (this.actionButton.editRecord && !this.recordId) {
      return false;
    }
    if (this.actionButton.cloneRecord && !this.recordId) {
      return false;
    }
    if (this.actionButton.subscribeToNotification) {
      if (this.emailNotification && !this.emailNotification.userSubscribed) {
        return true;
      } else {
        return false;
      }
    }
    if (this.actionButton.unsubscribeFromNotification) {
      if (this.emailNotification && this.emailNotification.userSubscribed) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Dashboard action button component.
   *
   * @param environment Current environment
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param emailService Email service
   * @param apollo Apollo
   * @param location Angular location
   * @param sharedEmailService Shared email service
   * @param applicationService ApplicationService
   * @param snackBar SnackbarService
   * @param translate TranslateService
   * @param queryBuilder QueryBuilderService
   * @param contextService Shared context service
   */
  constructor(
    @Inject('environment') environment: any,
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    private emailService: EmailService,
    private apollo: Apollo,
    private location: Location,
    private sharedEmailService: SharedEmailService,
    private applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private queryBuilder: QueryBuilderService,
    private contextService: ContextService
  ) {
    super();
    this.environment = environment;
  }

  ngOnInit(): void {
    if (
      this.actionButton.subscribeToNotification ||
      this.actionButton.unsubscribeFromNotification
    ) {
      const notificationId = this.actionButton.subscribeToNotification
        ? this.actionButton.subscribeToNotification.notification
        : this.actionButton.unsubscribeFromNotification?.notification;
      if (notificationId) {
        this.getNotification(notificationId);
      }
      // As other buttons may update the subscription to notification, we listen to these changes
      this.refresh.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (notificationId) {
          this.getNotification(notificationId);
        }
      });
    }
  }

  /**
   * Handle action button click.
   */
  public async onClick() {
    // Navigation to url
    if (this.actionButton.href) {
      const href = this.contextService.replaceContext(
        this.dataTemplateService.renderLink(this.actionButton.href)
      );
      if (this.actionButton.openInNewTab) {
        window.open(href, '_blank');
      } else {
        if (href?.startsWith('./')) {
          // Navigation inside the app builder
          this.router.navigateByUrl(href.substring(1));
        } else {
          window.location.href = href;
        }
      }
      return;
    }
    // Navigation to previous page
    if (this.actionButton.previousPage) {
      this.location.back();
      return;
    }
    // Edit Record & Add Record
    if (
      this.actionButton.editRecord ||
      this.actionButton.addRecord ||
      this.actionButton.cloneRecord
    ) {
      this.openRecordModal();
      return;
    }
    // Notifications
    if (
      this.actionButton.subscribeToNotification &&
      this.actionButton.subscribeToNotification.notification
    ) {
      await this.emailService.subscribeToEmail(
        this.actionButton.subscribeToNotification.notification
      );
      this.refresh.next();
      this.getNotification(
        this.actionButton.subscribeToNotification.notification
      );
    }
    if (
      this.actionButton.unsubscribeFromNotification &&
      this.actionButton.unsubscribeFromNotification.notification
    ) {
      await this.emailService.unsubscribeFromEmail(
        this.actionButton.unsubscribeFromNotification.notification
      );
      this.refresh.next();
      this.getNotification(
        this.actionButton.unsubscribeFromNotification.notification
      );
    }
    if (
      this.actionButton.sendNotification &&
      this.actionButton.sendNotification.distributionList
    ) {
      try {
        const selectedIds = !isNil(this.recordId) ? [this.recordId] : [];
        const templates = await this.getSelectedNotificationTemplates(
          this.actionButton.sendNotification.templates || []
        );
        if (templates.length === 0) {
          // no template found, skip
          this.snackBar.openSnackBar(
            this.translate.instant(
              'common.notifications.email.errors.noTemplate'
            ),
            { error: true }
          );
          return;
        }
        const snackBarRef = this.snackBar.openComponentSnackBar(
          SnackbarSpinnerComponent,
          {
            duration: 0,
            data: {
              message: this.translate.instant(
                'common.notifications.email.preview.processing'
              ),
              loading: true,
            },
          }
        );
        const snackBarSpinner = snackBarRef.instance.nestedComponent;
        let resource!: Resource;
        if (this.resourceId) {
          resource = (await this.getResourceById(this.resourceId)) as Resource;
        }
        const distributionList = await this.getSelectedDistributionListData(
          this.actionButton.sendNotification.distributionList
        );
        // Open email template selection
        const { EmailTemplateModalComponent } = await import(
          '../email-template-modal/email-template-modal.component'
        );
        const dialogRef = this.dialog.open(EmailTemplateModalComponent, {
          data: {
            templates,
          },
        });
        // Get template from dialog ref
        const value = await lastValueFrom<any>(
          dialogRef.closed.pipe(takeUntil(this.destroy$))
        );
        if (value?.template) {
          snackBarSpinner.instance.loading = false;
          snackBarRef.instance.triggerSnackBar(50);
          const selectedId = value?.template;
          const template = templates.filter((x: any) => x.id === selectedId)[0];
          if (template) {
            let layout!: Layout;
            if (!isNil(resource)) {
              layout = {
                query: {
                  name: resource.queryName,
                  fields: this.actionButton.sendNotification?.fields,
                },
              };
              const emailQuery = this.buildEmailQuery(selectedIds, layout);
              if (emailQuery) {
                this.sharedEmailService.previewCustomTemplate(
                  template,
                  distributionList,
                  null,
                  emailQuery
                );
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Open record modal to add/edit a record
   */
  private async openRecordModal() {
    // recordId: this.contextId,
    // todo: distinction between addRecord & editRecord
    const { FormModalComponent } = await import(
      '../form-modal/form-modal.component'
    );
    let template =
      this.actionButton.editRecord?.template ??
      this.actionButton.cloneRecord?.template ??
      this.actionButton.addRecord?.template;

    // Prefill data for addRecord & cloneRecord
    const loadPrefillData$ = () => {
      if (this.actionButton.cloneRecord && this.recordId) {
        return this.apollo
          .query<RecordQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: { id: this.recordId, includeResource: false },
          })
          .pipe(
            takeUntil(this.destroy$),
            tap(({ data }) => {
              if (!template) {
                template = data.record.form?.id;
              }
            }),
            map(({ data }) => data.record.data)
          );
      }

      return of(
        this.contextService.replaceContext(
          this.actionButton.addRecord?.mapping || {}
        )
      );
    };

    loadPrefillData$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((prefillData) => {
        const shouldReload =
          this.actionButton.editRecord?.autoReload ??
          this.actionButton.cloneRecord?.autoReload ??
          this.actionButton.addRecord?.autoReload ??
          false;
        // Callback to be executed at the end of action
        const callback = () => {
          if (shouldReload) {
            this.reloadParent.emit();
          }
        };
        const dialogRef = this.dialog.open(FormModalComponent, {
          disableClose: true,
          data: {
            ...(this.actionButton.editRecord && { recordId: this.recordId }), // Modal will open current record
            ...(template && { template }),
            actionButtonCtx: true,
            prefillData,
          },
          autoFocus: false,
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => {
            if (value && value.data?.id) {
              // Add record action
              if (this.actionButton.addRecord) {
                const newRecordId = value.data.id;
                const fieldsForUpdate =
                  this.actionButton.addRecord.fieldsForUpdate || [];
                // Execute callback if possible
                if (
                  this.recordId &&
                  Array.isArray(fieldsForUpdate) &&
                  fieldsForUpdate.length > 0
                ) {
                  this.apollo
                    .query<RecordQueryResponse>({
                      query: GET_RECORD_BY_ID,
                      variables: {
                        id: this.recordId,
                        includeResource: true,
                      },
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(({ data }) => {
                      const update = {};
                      for (const field of fieldsForUpdate as string[]) {
                        const resourceField = data.record.resource?.fields.find(
                          (f: any) => f.name === field
                        );
                        if (resourceField) {
                          // Current field value in record
                          const value = get(data.record.data, field);
                          switch (resourceField.type) {
                            case 'resource': {
                              set(update, field, newRecordId);
                              break;
                            }
                            case 'resources': {
                              if (Array.isArray(value)) {
                                set(update, field, [...value, newRecordId]);
                              } else {
                                set(update, field, [newRecordId]);
                              }
                              break;
                            }
                            // Else, skip
                          }
                        }
                        // Else, skip
                      }
                      // If update not empty
                      if (!isEmpty(update)) {
                        this.apollo
                          .mutate<EditRecordMutationResponse>({
                            mutation: EDIT_RECORD,
                            variables: {
                              id: this.recordId,
                              data: update,
                            },
                          })
                          .pipe(takeUntil(this.destroy$))
                          .subscribe({ next: () => callback() });
                      } else {
                        callback();
                      }
                    });
                } else {
                  callback();
                }
              } else {
                // Edit or Clone record action
                if (this.actionButton.cloneRecord) {
                  // Clone action
                  const navigateTo =
                    this.actionButton.cloneRecord.onSave?.navigateTo;
                  if (navigateTo?.targetPage && navigateTo.targetPage.pageUrl) {
                    // Navigate to page in app builder
                    let fullUrl = this.getPageUrl(
                      navigateTo.targetPage.pageUrl as string
                    );
                    if (navigateTo.targetPage.field && value?.data) {
                      // Add query parameter
                      const fieldPath = navigateTo.targetPage.field;
                      const paramValue = get(value.data, fieldPath);
                      fullUrl = `${fullUrl}?${fieldPath}=${paramValue}`;
                    }
                    this.router.navigateByUrl(fullUrl);
                  } else if (
                    navigateTo?.targetUrl &&
                    navigateTo.targetUrl.href
                  ) {
                    // Navigate to any other url
                    const href = this.contextService.replaceContext(
                      this.dataTemplateService.renderLink(
                        navigateTo.targetUrl.href
                      )
                    );
                    if (navigateTo.targetUrl.openInNewTab) {
                      window.open(href, '_blank');
                    } else {
                      if (href?.startsWith('./')) {
                        this.router.navigateByUrl(href.substring(1));
                      } else {
                        window.location.href = href;
                      }
                    }
                  } else {
                    callback();
                  }
                } else {
                  // Edit Action
                  callback();
                }
              }
            }
          });
      });
  }

  /**
   * Get selected templates data
   *
   * @param templates Selected templates for the given action button
   * @returns selected templates data
   */
  private async getSelectedNotificationTemplates(templates: string[]) {
    const { data: templateResponse } = await lastValueFrom(
      this.emailService.getCustomTemplates(
        this.applicationService.application?.getValue()?.id as string
      )
    );
    const allTemplateData = templateResponse.customTemplates.edges.map(
      (x: any) => x.node
    );
    return allTemplateData.filter((template: any) =>
      templates.includes(template.id)
    );
  }

  /**
   * Get selected distribution list data
   *
   * @param distributionListId Selected distribution list for the given action button
   * @returns selected distribution list data
   */
  private async getSelectedDistributionListData(distributionListId: string) {
    const { data: distributionListResponse } = await lastValueFrom(
      this.emailService.getEmailDistributionList(
        this.applicationService.application.getValue()?.id,
        distributionListId
      )
    );
    return distributionListResponse.emailDistributionLists.edges[0].node;
  }

  /**
   * Fetch resource data needed for field display
   *
   * @param resourceId resource id
   * @returns resource
   */
  private async getResourceById(resourceId: string) {
    const { data: resource } = await lastValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: resourceId,
        },
      })
    );
    return resource.resource;
  }

  /**
   * Build email query for action button.
   *
   * @param selectedIds Ids selected in the grid for email sending
   * @param settingsData resource layout settings data
   * @returns Records graphql query.
   */
  private buildEmailQuery(selectedIds: string[], settingsData: any) {
    settingsData.query.fields = this.actionButton.sendNotification?.fields;
    const builtQuery = this.queryBuilder.buildQuery(settingsData);
    if (!builtQuery) {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'components.widget.grid.errors.queryBuildFailed'
        ),
        { error: true }
      );
      return;
    } else {
      return {
        queryName: settingsData.query.name,
        fields: this.actionButton.sendNotification?.fields || [],
        first: selectedIds.length,
        filter: {
          logic: 'and',
          filters: [
            {
              operator: 'eq',
              field: 'ids',
              value: selectedIds,
            },
          ],
        },
        sortField: undefined,
        sortOrder: undefined,
        styles: [],
        at: undefined,
        skip: 0,
      };
    }
  }

  /**
   * Get notification, configured in subscribeTo or unsubscribeTo
   *
   * @param id notification id
   */
  private getNotification(id: string) {
    this.emailService
      .getEmailNotification(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.emailNotification = data.emailNotification;
        },
      });
  }

  /**
   * Get page url full link taking into account the environment.
   *
   * @param pageUrlParams page url params
   * @returns url of the page
   */
  private getPageUrl(pageUrlParams: string): string {
    return this.environment.module === 'backoffice'
      ? `applications/${pageUrlParams}`
      : `${pageUrlParams}`;
  }
}
