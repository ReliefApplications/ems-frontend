import { Apollo } from 'apollo-angular';
import {
  EDIT_RECORDS,
  PUBLISH,
  PUBLISH_NOTIFICATION,
} from './graphql/mutations';
import {
  GET_RECORD_DETAILS,
  GET_RECORD_BY_ID,
  GET_FORM_BY_ID,
  GET_USER_ROLES_PERMISSIONS,
} from './graphql/queries';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { WorkflowService } from '../../../services/workflow/workflow.service';
import { EmailService } from '../../../services/email/email.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { CoreGridComponent } from '../../ui/core-grid/core-grid.component';
import { GridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { Layout } from '../../../models/layout.model';
import { TranslateService } from '@ngx-translate/core';
import get from 'lodash/get';
import set from 'lodash/set';
import { ApplicationService } from '../../../services/application/application.service';
import { Aggregation } from '../../../models/aggregation.model';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { firstValueFrom, takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import { RoleUsersNodesQueryResponse } from '../../../models/user.model';
import {
  EditRecordsMutationResponse,
  RecordQueryResponse,
} from '../../../models/record.model';
import {
  PublishMutationResponse,
  PublishNotificationMutationResponse,
} from '../../../models/notification.model';
import { FormQueryResponse } from '../../../models/form.model';
import { AggregationGridComponent } from '../../aggregation/aggregation-grid/aggregation-grid.component';
import { ReferenceDataGridComponent } from '../../ui/reference-data-grid/reference-data-grid.component';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

/** Component for the grid widget */
@Component({
  selector: 'shared-grid-widget',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
/** Grid widget using KendoUI. */
export class GridWidgetComponent extends BaseWidgetComponent implements OnInit {
  /** Template reference */
  @ViewChild(CoreGridComponent)
  private grid!: CoreGridComponent;
  /** Reference to main grid */
  @ViewChild(CoreGridComponent)
  coreGridComponent?: CoreGridComponent;
  /** Reference to aggregation grid */
  @ViewChild(AggregationGridComponent)
  aggregationGridComponent?: AggregationGridComponent;
  /** Reference to reference data grid */
  @ViewChild(ReferenceDataGridComponent)
  referenceDataGridComponent?: ReferenceDataGridComponent;

  /** Data */
  @Input() widget: any;

  /** Permissions */
  public canCreateRecords = false;

  /** Cached configuration */
  public layout: Layout | null = null;
  /** List of layouts */
  public layouts: Layout[] = [];

  /** Sort fields select */
  public sortFields: any[] = [];

  /** Aggregation */
  public aggregation: Aggregation | null = null;
  /** List of aggregations */
  public aggregations: Aggregation[] = [];

  /** Reference data */
  public useReferenceData = false;

  /** Settings */
  @Input() settings: any = null;
  /** Id */
  @Input() id = '';
  /** Can update */
  @Input() canUpdate = false;
  /** Grid settings */
  public gridSettings: any = null;
  /** Grid status */
  public status: {
    message?: string;
    error: boolean;
  } = { error: false };

  /** Emit step change for workflow */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /** Emit event */
  @Output() edit: EventEmitter<any> = new EventEmitter();

  /** Event emitter for inline edition of records */
  @Output() inlineEdition: EventEmitter<any> = new EventEmitter();

  /**
   * Test if the grid uses a layout, and if a layout is used, if any item is currently updated.
   *
   * @returns Tell if component could block navigation
   */
  get canDeactivate() {
    return this.coreGridComponent
      ? this.coreGridComponent.updatedItems.length === 0
      : true;
  }

  /** @returns list of active floating buttons */
  get floatingButtons() {
    return (this.settings.floatingButtons || []).filter((x: any) => x.show);
  }

  /**
   * Heavy constructor for the grid widget component
   *
   * @param apollo The apollo client
   * @param dialog Dialogs service
   * @param snackBar Shared snack bar service
   * @param workflowService Shared workflow service
   * @param emailService Shared email service
   * @param queryBuilder Shared query builder service
   * @param gridLayoutService Shared grid layout service
   * @param confirmService Shared confirm service
   * @param applicationService The shared application service
   * @param translate Angular translate service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private workflowService: WorkflowService,
    private emailService: EmailService,
    private queryBuilder: QueryBuilderService,
    private gridLayoutService: GridLayoutService,
    private confirmService: ConfirmService,
    private applicationService: ApplicationService,
    private translate: TranslateService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit() {
    this.gridSettings = { ...this.settings };
    delete this.gridSettings.query;
    let buildSortFields = false;
    if (this.settings.resource) {
      this.useReferenceData = false;
      const layouts = get(this.settings, 'layouts', []);
      const aggregations = get(this.settings, 'aggregations', []);

      // Get user permission on resource
      this.apollo
        .query<RoleUsersNodesQueryResponse>({
          query: GET_USER_ROLES_PERMISSIONS,
          variables: {
            resource: this.settings.resource,
          },
        })
        .subscribe((res) => {
          if (res.data) {
            this.canCreateRecords = get(
              res,
              'data.resource.canCreateRecords',
              false
            );
          }
        });

      if (layouts.length > 0) {
        this.gridLayoutService
          .getLayouts(this.settings.resource, {
            ids: layouts,
            first: layouts?.length,
          })
          .then((res) => {
            this.layouts = res.edges
              .map((edge) => edge.node)
              .sort((a, b) => layouts.indexOf(a.id) - layouts.indexOf(b.id));
            this.layout = this.layouts[0] || null;
            if (!this.layout) {
              this.status = {
                error: true,
              };
            } else {
              buildSortFields = true;
            }
            this.gridSettings = {
              ...this.settings,
              ...this.layout,
              ...{ template: get(this.settings, 'template', null) },
            };
          });
        return;
      }

      if (aggregations.length > 0) {
        this.aggregationService
          .getAggregations({
            resource: this.settings.resource,
            ids: aggregations,
            first: aggregations.length,
          })
          .then((res) => {
            this.aggregations = res.edges
              .map((edge) => edge.node)
              .sort(
                (a, b) =>
                  aggregations.indexOf(a.id) - aggregations.indexOf(b.id)
              );
            if (!this.aggregation) {
              this.status = {
                error: true,
              };
            }
            this.aggregation = this.aggregations[0] || null;
            buildSortFields = true;
          });
        return;
      }
    } else if (this.settings.referenceData) {
      buildSortFields = true;
      this.useReferenceData = true;
    }

    if (buildSortFields) {
      // Build list of available sort fields
      this.widget.settings.sortFields?.forEach((sortField: any) => {
        this.sortFields.push(sortField);
      });
    }
  }

  /**
   * Query sort change of the grid.
   *
   * @param e sort event
   */
  public onSort(e: any): void {
    if (this.coreGridComponent) {
      this.coreGridComponent.onSortChange([
        {
          field: e ? e.field : '',
          dir: e ? e.order : 'asc',
        },
      ]);
    }
    if (this.aggregationGridComponent) {
      this.aggregationGridComponent.onSortChange([
        {
          field: e ? e.field : '',
          dir: e ? e.order : 'asc',
        },
      ]);
    }
    if (this.referenceDataGridComponent) {
      this.referenceDataGridComponent.onSortChange([
        {
          field: e ? e.field : '',
          dir: e ? e.order : 'asc',
        },
      ]);
    }
  }

  /**
   * Executes sequentially actions enabled by settings for the floating button
   *
   * @param options action options.
   */
  public async onQuickAction(options: any): Promise<void> {
    // Select all the records in the grid
    if (options.selectAll) {
      const query = this.queryBuilder.graphqlQuery(
        this.grid.settings.query.name,
        'id\n'
      );
      const records = await firstValueFrom(
        this.apollo.query<any>({
          query,
          variables: {
            first: this.grid.gridData.total,
            filter: this.grid.queryFilter,
          },
        })
      );
      this.grid.selectedRows = records.data[
        this.grid.settings.query.name
      ].edges.map((x: any) => x.node.id);
    }
    // Select all the records in the active page
    if (options.selectPage) {
      this.grid.selectedRows = this.grid.gridData.data.map((x) => x.id);
    }
    // Auto save all records
    if (options.autoSave) {
      const hasError = await this.grid.onSaveChanges();
      if (hasError) {
        this.snackBar.openSnackBar(
          this.translate.instant(
            'components.widget.grid.errors.autoSaveFailed'
          ),
          {
            error: true,
            duration: 8000,
          }
        );
        // Close the action if error detected during auto save
        return;
      }
    }
    // Attaches the records to another one.
    if (options.attachToRecord && this.grid.selectedRows.length > 0) {
      const shouldContinue = await this.promisedAttachToRecord(
        this.grid.selectedRows,
        options.targetForm,
        options.targetFormField,
        options.targetFormQuery
      );
      if (!shouldContinue) {
        // Close the action
        this.grid.reloadData();
        return;
      }
    }
    // Opens a form with selected records.
    if (options.prefillForm) {
      const promise = new Promise((resolve) => {
        const promisedRecords: Promise<any>[] = [];
        // Fetches the record object for each selected record.
        for (const record of this.grid.selectedItems) {
          promisedRecords.push(
            firstValueFrom(
              this.apollo.query<RecordQueryResponse>({
                query: GET_RECORD_DETAILS,
                variables: {
                  id: record.id,
                },
              })
            )
          );
        }
        Promise.all(promisedRecords).then(async (results) => {
          const records = results.map((x) => x.data.record);
          // Opens a modal containing the prefilled form.
          const { FormModalComponent } = await import(
            '../../form-modal/form-modal.component'
          );
          const dialogRef = this.dialog.open(FormModalComponent, {
            data: {
              template: options.prefillTargetForm,
              prefillRecords: records,
              askForConfirm: false,
            },
            autoFocus: false,
          });
          dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            if (!value) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      });
      const shouldContinue = await promise;
      if (!shouldContinue) {
        // Close the action
        this.grid.reloadData();
        return;
      }
    }
    // Auto modify the selected rows
    if (options.modifySelectedRows) {
      await this.promisedRowsModifications(
        options.modifications,
        this.grid.selectedRows
      );
    }
    const promises: Promise<any>[] = [];
    // Notifies on a channel.
    if (options.notify && this.grid.selectedRows.length > 0) {
      promises.push(
        firstValueFrom(
          this.apollo.mutate<PublishNotificationMutationResponse>({
            mutation: PUBLISH_NOTIFICATION,
            variables: {
              action: options.notificationMessage
                ? options.notificationMessage
                : 'Records update',
              content: this.grid.selectedItems,
              channel: options.notificationChannel,
            },
          })
        )
      );
    }
    // Publishes on a channel.
    if (options.publish && this.grid.selectedRows.length > 0) {
      promises.push(
        firstValueFrom(
          this.apollo.mutate<PublishMutationResponse>({
            mutation: PUBLISH,
            variables: {
              ids: this.grid.selectedRows,
              channel: options.publicationChannel,
            },
          })
        )
      );
    }
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    // Send email using backend mail service.
    if (options.sendMail) {
      const templates =
        this.applicationService.templates.filter((x) =>
          options.templates?.includes(x.id)
        ) || [];
      if (templates.length === 0) {
        // no template found, skip
        this.snackBar.openSnackBar(
          this.translate.instant(
            'common.notifications.email.errors.noTemplate'
          ),
          { error: true }
        );
      } else {
        // find recipients
        const recipients =
          this.applicationService.distributionLists.find(
            (x) => x.id === options.distributionList
          )?.emails || [];

        // select template
        const { EmailTemplateModalComponent } = await import(
          '../../email-template-modal/email-template-modal.component'
        );
        const dialogRef = this.dialog.open(EmailTemplateModalComponent, {
          data: {
            templates,
          },
        });

        const value = await firstValueFrom<any>(
          dialogRef.closed.pipe(takeUntil(this.destroy$))
        );
        const template = value?.template;

        if (template) {
          this.emailService.previewMail(
            recipients,
            template.content.subject,
            template.content.body,
            {
              logic: 'and',
              filters: [
                {
                  operator: 'eq',
                  field: 'ids',
                  value: this.grid.selectedRows,
                },
              ],
            },
            {
              name: this.grid.settings.query.name,
              fields: options.bodyFields,
            },
            this.grid.sortField || undefined,
            this.grid.sortOrder || undefined,
            options.export
          );
        }
      }
    }

    // Workflow only: goes to next step, goes to the previous step, or closes the workflow.
    if (
      options.goToNextStep ||
      options.goToPreviousStep ||
      options.closeWorkflow
    ) {
      if (options.goToNextStep) {
        this.changeStep.emit(1);
      } else if (options.goToPreviousStep) {
        this.changeStep.emit(-1);
      } else {
        const dialogRef = this.confirmService.openConfirmModal({
          title: this.translate.instant(
            'components.widget.settings.grid.buttons.callback.workflow.close'
          ),
          content: options.confirmationText,
          confirmText: this.translate.instant(
            'components.confirmModal.confirm'
          ),
          confirmVariant: 'primary',
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((confirm: any) => {
            if (confirm) {
              this.workflowService.closeWorkflow();
            }
          });
      }
    } else {
      this.grid.reloadData();
    }
  }

  /**
   * Returns a list of promises containing all the mutations in order to modify selected records accordingly to settings.
   * Applies inline edition before applying modifications.
   *
   * @param modifications list of modifications to apply.
   * @param ids records to edit.
   * @returns Array of Promises to execute.
   */
  private promisedRowsModifications(
    modifications: any[],
    ids: any[]
  ): Promise<any> {
    const update: any = {};
    for (const modification of modifications) {
      if (modification.field) {
        // If no value, set at null
        if (modification.value === undefined || modification.value === '') {
          set(update, modification.field, null);
        } else {
          set(update, modification.field, modification.value);
        }
      }
    }
    return firstValueFrom(
      this.apollo.mutate<EditRecordsMutationResponse>({
        mutation: EDIT_RECORDS,
        variables: {
          ids,
          data: update,
          template: get(this.settings, 'template', null),
        },
      })
    );
  }

  /**
   * Open a modal to select which record we want to attach the rows to and
   * perform the attach.
   * The inputs comes from 'attach to record' button from grid component
   *
   * @param selectedRecords The list of selected records
   * @param targetForm Target template id
   * @param targetFormField The form field
   * @param targetFormQuery The form query
   * @returns Promise resolving when execution done
   */
  private async promisedAttachToRecord(
    selectedRecords: string[],
    targetForm: string,
    targetFormField: string,
    targetFormQuery: any
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .query<FormQueryResponse>({
          query: GET_FORM_BY_ID,
          variables: {
            id: targetForm,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (getForm) => {
          if (getForm.data.form) {
            const form = getForm.data.form;
            const { ChooseRecordModalComponent } = await import(
              '../../choose-record-modal/choose-record-modal.component'
            );
            const selectionDialogRef = this.dialog.open(
              ChooseRecordModalComponent,
              {
                data: {
                  targetForm: form,
                  targetFormField,
                  targetFormQuery,
                },
              }
            );
            const value = await Promise.resolve(
              firstValueFrom(selectionDialogRef.closed) as any
            );
            if (value && value.record) {
              this.apollo
                .query<RecordQueryResponse>({
                  query: GET_RECORD_BY_ID,
                  variables: {
                    id: value.record,
                  },
                })
                .subscribe(async ({ data }) => {
                  const resourceField = form.fields?.find(
                    (field) =>
                      field.resource &&
                      field.resource === this.settings.resource
                  );
                  let recordData = data.record.data;
                  const key = resourceField.name;
                  if (resourceField.type === 'resource') {
                    recordData = { ...recordData, [key]: selectedRecords[0] };
                  } else {
                    if (recordData[key]) {
                      recordData = {
                        ...recordData,
                        [key]: recordData[key].concat(selectedRecords),
                      };
                    } else {
                      recordData = { ...recordData, [key]: selectedRecords };
                    }
                  }
                  const { FormModalComponent } = await import(
                    '../../form-modal/form-modal.component'
                  );
                  const formDialogRef = this.dialog.open(FormModalComponent, {
                    disableClose: true,
                    data: {
                      recordId: value.record,
                      template: targetForm,
                      recordData: { [key]: recordData[key] },
                    },
                    autoFocus: false,
                  });
                  formDialogRef.closed
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res) => resolve(res ? true : false));
                });
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        });
    });
  }

  /**
   * Updates current layout.
   *
   * @param layout new layout.
   */
  onLayoutChange(layout: Layout): void {
    this.layout = layout;
    this.gridSettings = {
      ...this.settings,
      ...this.layout,
      ...{ template: get(this.settings, 'template', null) },
    };
  }

  /**
   * Resets the current layout.
   */
  onResetLayout(): void {
    this.onLayoutChange(this.layout || {});
  }

  /**
   * Updates current aggregation.
   *
   * @param aggregation new aggregation.
   */
  onAggregationChange(aggregation: Aggregation): void {
    this.aggregation = aggregation;
  }
}
