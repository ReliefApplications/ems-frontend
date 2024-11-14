import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActionButton } from './action-button.type';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../email/email.service';
import { Apollo } from 'apollo-angular';
import { EmailService as SharedEmailService } from '../../services/email/email.service';
import { ApplicationService } from '../../services/application/application.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import {
  QueryBuilderService,
  QueryResponse,
} from '../../services/query-builder/query-builder.service';
import { ContextService } from '../../services/context/context.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { lastValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { Resource, ResourceQueryResponse } from '../../models/resource.model';
import { GET_RECORD_BY_ID, GET_RESOURCE_BY_ID } from './graphql/queries';
import { EDIT_RECORD } from './graphql/mutations';
import { Dashboard } from '../../models/dashboard.model';
import {
  EditRecordMutationResponse,
  RecordQueryResponse,
} from '../../models/record.model';
import { Metadata } from '../../models/metadata.model';
import { get, isEmpty, isNil, set } from 'lodash';
import { SnackbarSpinnerComponent } from '../snackbar-spinner/snackbar-spinner.component';
import { ApolloQueryResult } from '@apollo/client';
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
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Should refresh button, some of them ( subscribe / unsubscribe ) can depend on other buttons */
  @Input() refresh!: Subject<void>;
  /** Reload dashboard event emitter */
  @Output() reloadDashboard = new EventEmitter<void>();
  /** Context id of the current dashboard */
  public contextId!: string;
  /** Email notification, for subscribe & unsubscribe actions */
  private emailNotification?: EmailNotification;

  /** @returns Should hide button */
  get showButton(): boolean {
    if (this.actionButton.editRecord && !this.contextId) {
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
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param emailService Email service
   * @param activatedRoute Activated route
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
    public dialog: Dialog,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    private emailService: EmailService,
    private activatedRoute: ActivatedRoute,
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
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ id }) => {
        this.contextId = id;
      },
    });
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
    if (this.actionButton.editRecord || this.actionButton.addRecord) {
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
        const selectedIds = !isNil(this.contextId) ? [this.contextId] : [];
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
        let resourceMetaData: Metadata[] = [];
        let resource!: Resource;
        if (this.dashboard?.page?.context?.resource) {
          resourceMetaData = (await this.getResourceMetaData(
            (this.actionButton.sendNotification.fields || []).map((x) => x.name)
          )) as Metadata[];
          resource = (await this.getResourceById(
            this.dashboard?.page?.context?.resource
          )) as Resource;
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
            let emailQuery!:
              | Observable<ApolloQueryResult<QueryResponse>>
              | undefined;
            let layout!: Layout;
            if (!isNil(resource)) {
              layout = {
                query: {
                  name: resource.queryName,
                  fields: this.actionButton.sendNotification?.fields,
                },
              };
              emailQuery = this.buildEmailQuery(selectedIds, layout);
            }
            let emailData: any = [];
            if (emailQuery) {
              const { data } = await lastValueFrom(
                emailQuery.pipe(takeUntil(this.destroy$))
              );
              Object.keys(data)?.forEach((key: any) => {
                emailData = data[key].edges;
              });
            }
            this.sharedEmailService.previewCustomTemplate(
              template,
              distributionList,
              emailData,
              resourceMetaData,
              this.actionButton.sendNotification?.fields
            );
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
    const template = this.actionButton.editRecord
      ? this.actionButton.editRecord.template
      : this.actionButton.addRecord?.template;
    const prefillData = this.contextService.replaceContext(
      this.actionButton.addRecord?.mapping || {}
    );
    const shouldReload =
      this.actionButton.editRecord?.autoReload ||
      this.actionButton.addRecord?.autoReload;
    // Callback to be executed at the end of action
    const callback = () => {
      if (shouldReload) {
        this.reloadDashboard.emit();
      }
    };
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        ...(this.actionButton.editRecord && { recordId: this.contextId }), // button must be hidden in html if editRecord is enabled & no contextId
        ...(template && { template }),
        actionButtonCtx: true,
        prefillData,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && value.data?.id) {
        // Add record action
        if (this.actionButton.addRecord) {
          const newRecordId = value.data.id;
          const fieldsForUpdate =
            this.actionButton.addRecord.fieldsForUpdate || [];
          // Execute callback if possible
          if (
            this.contextId &&
            Array.isArray(fieldsForUpdate) &&
            fieldsForUpdate.length > 0
          ) {
            this.apollo
              .query<RecordQueryResponse>({
                query: GET_RECORD_BY_ID,
                variables: {
                  id: this.contextId,
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
                        id: this.contextId,
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
          // Edit record action
          callback();
        }
      }
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
   * Get default resource meta data
   *
   * @param fields Selected resource fields for the given action button
   * @returns default resource meta data
   */
  private async getResourceMetaData(fields: string[]) {
    const { data: resourceMetaDataResponse } = await lastValueFrom(
      // Fetch resource metadata for email sending
      this.queryBuilder.getQueryMetaData(
        this.dashboard?.page?.context?.resource as string
      )
    );
    return resourceMetaDataResponse.resource.metadata?.filter((md) =>
      fields.includes(md.name)
    );
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
      return this.apollo.query({
        query: builtQuery,
        variables: {
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
        },
        fetchPolicy: 'no-cache',
      });
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
}
