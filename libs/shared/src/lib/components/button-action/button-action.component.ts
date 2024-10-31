import { Dialog } from '@angular/cdk/dialog';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { get, isEmpty, set } from 'lodash';
import { lastValueFrom, takeUntil } from 'rxjs';
import { Dashboard } from '../../models/dashboard.model';
import { DataTemplateService } from '../../services/data-template/data-template.service';
import { ButtonActionT } from './button-action-type';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  EditRecordMutationResponse,
  RecordQueryResponse,
} from '../../models/record.model';
import { EmailService } from '../email/email.service';
import { EmailService as SharedEmailService } from '../../services/email/email.service';
import { EDIT_RECORD } from './graphql/mutations';
import { GET_RECORD_BY_ID } from './graphql/queries';
import { Location } from '@angular/common';
import { ApplicationService } from '../../services/application/application.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { ResourceQueryResponse } from '../../models/resource.model';
import { GET_RESOURCE } from '../email/graphql/queries';
import { GridLayoutService } from '../../services/grid-layout/grid-layout.service';

/** Component for display action buttons */
@Component({
  selector: 'shared-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent extends UnsubscribeComponent {
  /** Button actions */
  @Input() buttonActions: ButtonActionT[] = [];
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Can update dashboard or not */
  @Input() canUpdate = false;
  /** Context id of the current dashboard */
  public contextId!: string;

  /**
   * Action buttons
   *
   * @param dialog Dialog service
   * @param dataTemplateService DataTemplate service
   * @param router Angular router
   * @param emailService Email service
   * @param activatedRoute Activated route
   * @param apollo Apollo
   * @param location Angular location
   * @param sharedEmailService Shared email service
   * @param applicationService: ApplicationService
   * @param snackBar: SnackbarService
   * @param translate: TranslateService
   * @param queryBuilder: QueryBuilderService
   * @param gridLayoutService: GridLayoutService
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
    private gridLayoutService: GridLayoutService
  ) {
    super();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ id }) => {
        this.contextId = id;
      },
    });
  }

  /**
   * Opens link of button action.
   *
   * @param button Button action to be executed
   */
  public async onButtonActionClick(button: ButtonActionT) {
    // Navigation to url
    if (button.href) {
      const href = this.dataTemplateService.renderLink(button.href);
      if (button.openInNewTab) {
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
    if (button.previousPage) {
      this.location.back();
      return;
    }
    // Edit Record & Add Record
    if (button.editRecord || button.addRecord) {
      this.openRecordModal(button);
      return;
    }
    // Notifications
    if (
      button.subscribeToNotification &&
      button.subscribeToNotification.notification
    ) {
      this.emailService.subscribeToEmail(
        button.subscribeToNotification.notification
      );
    }
    if (button.sendNotification && button.sendNotification.distributionList) {
      try {
        const selectedIds = [this.contextId];
        const templates = await this.getSelectedNotificationTemplates(
          button.sendNotification.templates || []
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
        let bodyFields: any[] = [];
        if (this.dashboard?.page?.context?.resource) {
          bodyFields = await this.getSelectedResourceFieldsData(
            button.sendNotification.fields || []
          );
        }
        const distributionList = await this.getSelectedDistributionListData(
          button.sendNotification.distributionList
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
          const selectedId = value?.template;
          const template = templates.filter((x: any) => x.id === selectedId)[0];
          if (template) {
            const layout = await this.buildDefaultResourceLayout(bodyFields);
            const emailQuery = this.buildEmailQuery(selectedIds, layout);
            if (emailQuery) {
              const resourceMetaData = await this.getResourceMetaData();
              emailQuery.pipe(takeUntil(this.destroy$)).subscribe({
                next: ({ data }) => {
                  let emailData: any = [];
                  Object.keys(data)?.forEach((key: any) => {
                    emailData = data[key].edges;
                  });
                  this.sharedEmailService.previewCustomTemplate(
                    template,
                    distributionList,
                    emailData,
                    resourceMetaData,
                    bodyFields
                  );
                },
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * Open record modal to add/edit a record
   *
   * @param button action to be executed
   */
  private async openRecordModal(button: ButtonActionT) {
    // recordId: this.contextId,
    // todo: distinction between addRecord & editRecord
    const { FormModalComponent } = await import(
      '../form-modal/form-modal.component'
    );
    const template = button.editRecord
      ? button.editRecord.template
      : button.addRecord?.template;
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        ...(button.editRecord && { recordId: this.contextId }), // button must be hidden in html if editRecord is enabled & no contextId
        ...(template && { template }),
        actionButtonCtx: true,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && value.data?.id && button.addRecord) {
        const newRecordId = value.data.id;
        const fieldsForUpdate = button.addRecord.fieldsForUpdate || [];
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
                  .subscribe();
              }
            });
        }
      }
    });
  }

  /**
   * Get selected templates data
   *
   * @param buttonActionTemplates Selected templates for the given quick action button
   * @returns selected templates data
   */
  private async getSelectedNotificationTemplates(
    buttonActionTemplates: string[]
  ) {
    const { data: templateResponse } = await lastValueFrom(
      this.emailService.getCustomTemplates(
        this.applicationService.application?.getValue()?.id as string
      )
    );
    const allTemplateData = templateResponse.customTemplates.edges.map(
      (x: any) => x.node
    );
    return allTemplateData.filter((template: any) =>
      buttonActionTemplates.includes(template.id)
    );
  }

  /**
   * Get selected resource fields data
   *
   * @param buttonActionFields Selected resource fields for the given quick action button
   * @returns selected resource fields data
   */
  private async getSelectedResourceFieldsData(buttonActionFields: string[]) {
    const { data: resourcesFieldsResponse } = await lastValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: this.dashboard?.page?.context?.resource as string,
        },
      })
    );
    return resourcesFieldsResponse.resource.fields.filter((f: any) =>
      buttonActionFields.includes(f.name)
    );
  }

  /**
   * Get selected distribution list data
   *
   * @param distributionListId Selected distribution list for the given quick action button
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
   * Get default resource layout data
   *
   * @param bodyFields default resource layout for the given quick action button
   * @returns default resource layout data
   */
  private async buildDefaultResourceLayout(bodyFields: any[]) {
    const { edges: layoutsResponse } = await this.gridLayoutService.getLayouts(
      this.dashboard?.page?.context?.resource as string,
      {
        ids: [],
        first: 1,
      }
    );
    const layout = layoutsResponse[0].node || null;
    layout.query.fields = bodyFields;
    return layout;
  }

  /**
   * Get default resource meta data
   *
   * @returns default resource meta data
   */
  private async getResourceMetaData() {
    const { data: resourceMetaDataResponse } = await lastValueFrom(
      // Fetch resource metadata for email sending
      this.queryBuilder.getQueryMetaData(
        this.dashboard?.page?.context?.resource as string
      )
    );
    return resourceMetaDataResponse.resource.metadata;
  }

  /**
   * Build email query for quick action button.
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
}
