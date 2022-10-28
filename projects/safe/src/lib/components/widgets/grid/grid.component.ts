import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import {
  EDIT_RECORD,
  EditRecordMutationResponse,
  EDIT_RECORDS,
  EditRecordsMutationResponse,
  PUBLISH,
  PUBLISH_NOTIFICATION,
  PublishMutationResponse,
  PublishNotificationMutationResponse,
} from './graphql/mutations';
import { SafeFormModalComponent } from '../../form-modal/form-modal.component';
import { Form } from '../../../models/form.model';
import {
  GetRecordDetailsQueryResponse,
  GET_RECORD_DETAILS,
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
} from './graphql/queries';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { SafeSnackBarService } from '../../../services/snackbar/snackbar.service';
import { SafeWorkflowService } from '../../../services/workflow/workflow.service';
import { SafeChooseRecordModalComponent } from '../../choose-record-modal/choose-record-modal.component';
import { SafeAuthService } from '../../../services/auth/auth.service';
import { SafeEmailService } from '../../../services/email/email.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { SafeCoreGridComponent } from '../../ui/core-grid/core-grid.component';
import { SafeGridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { SafeConfirmService } from '../../../services/confirm/confirm.service';
import { Layout } from '../../../models/layout.model';
import { TranslateService } from '@ngx-translate/core';
import { cleanRecord } from '../../../utils/cleanRecord';
import get from 'lodash/get';

/** Regex for the pattern "today()+[number of days to add]" */
const REGEX_PLUS = new RegExp('today\\(\\)\\+\\d+');
/** Regex for the pattern "today()-[number of days to substract]" */
const REGEX_MINUS = new RegExp('today\\(\\)\\-\\d+');

/** Component for the grid widget */
@Component({
  selector: 'safe-grid-widget',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
/** Grid widget using KendoUI. */
export class SafeGridWidgetComponent implements OnInit {
  // === TEMPLATE REFERENCE ===
  @ViewChild(SafeCoreGridComponent)
  private grid!: SafeCoreGridComponent;

  // === DATA ===
  @Input() widget: any;
  public loading = true;

  // === CACHED CONFIGURATION ===
  public layout: Layout | null = null;
  public layouts: Layout[] = [];

  // === VERIFICATION IF USER IS ADMIN ===
  public isAdmin: boolean;

  // === SETTINGS ===
  @Input() header = true;
  @Input() settings: any = null;
  @Input() id = '';
  @Input() canUpdate = false;
  public gridSettings: any = null;

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();

  /**
   * Heavy constructor for the grid widget component
   *
   * @param environment Environment variables
   * @param apollo The apollo client
   * @param dialog Material dialogs service
   * @param snackBar The safe snack bar service
   * @param workflowService The safe wofkflow service
   * @param safeAuthService The safe authentification service
   * @param emailService The safe email service
   * @param queryBuilder The query builder service
   * @param gridLayoutService The safe grid layout service
   * @param confirmService The safe confirm service
   * @param translate The translate service
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private workflowService: SafeWorkflowService,
    private safeAuthService: SafeAuthService,
    private emailService: SafeEmailService,
    private queryBuilder: QueryBuilderService,
    private gridLayoutService: SafeGridLayoutService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    this.isAdmin =
      this.safeAuthService.userIsAdmin && environment.module === 'backoffice';
  }

  ngOnInit(): void {
    this.gridSettings = { ...this.settings };
    delete this.gridSettings.query;
    if (
      this.settings.resource &&
      get(this.settings, 'layouts', []).length > 0
    ) {
      this.gridLayoutService
        .getLayouts(this.settings.resource, {
          ids: this.settings.layouts,
          first: this.settings.layouts?.length,
        })
        .then((res) => {
          this.layouts = res.edges
            .map((edge) => edge.node)
            .sort(
              (a, b) =>
                this.settings.layouts.indexOf(a.id) -
                this.settings.layouts.indexOf(b.id)
            );
          this.layout = this.layouts[0] || null;
          this.gridSettings = {
            ...this.settings,
            ...this.layout,
            ...{ template: this.settings.query?.template },
          };
        });
    }
  }

  /**
   * Send changes on multiple records to the backend
   *
   * @param items A list of item representing the changes for each record
   * @returns A list of promise with the result of the request
   */
  private promisedChanges(items: any[]): Promise<any>[] {
    const promises: Promise<any>[] = [];
    for (const item of items) {
      const data = Object.assign({}, item);
      delete data.id;
      promises.push(
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: item.id,
              data,
              template: this.settings.query?.template,
            },
          })
          .toPromise()
      );
    }
    return promises;
  }

  /**
   * Executes sequentially actions enabled by settings for the floating button
   *
   * @param options action options.
   */
  public async onQuickAction(options: any): Promise<void> {
    this.loading = true;
    // Select all the records in the grid
    if (options.selectAll) {
      const query = this.queryBuilder.graphqlQuery(
        this.grid.settings.query.name,
        'id\n'
      );
      const records = await this.apollo
        .query<any>({
          query,
          variables: {
            first: this.grid.gridData.total,
            filter: this.grid.queryFilter,
          },
        })
        .toPromise();
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
      await Promise.all(this.promisedChanges(this.grid.updatedItems));
    }
    // Auto modify the selected rows
    if (options.modifySelectedRows) {
      await this.promisedRowsModifications(
        options.modifications,
        this.grid.selectedRows
      );
    }

    // Attaches the records to another one.
    if (options.attachToRecord && this.grid.selectedRows.length > 0) {
      await this.promisedAttachToRecord(
        this.grid.selectedRows,
        options.targetForm,
        options.targetFormField,
        options.targetFormQuery
      );
    }
    const promises: Promise<any>[] = [];
    // Notifies on a channel.
    if (options.notify && this.grid.selectedRows.length > 0) {
      promises.push(
        this.apollo
          .mutate<PublishNotificationMutationResponse>({
            mutation: PUBLISH_NOTIFICATION,
            variables: {
              action: options.notificationMessage
                ? options.notificationMessage
                : 'Records update',
              content: this.grid.selectedItems,
              channel: options.notificationChannel,
            },
          })
          .toPromise()
      );
    }
    // Publishes on a channel.
    if (options.publish && this.grid.selectedRows.length > 0) {
      promises.push(
        this.apollo
          .mutate<PublishMutationResponse>({
            mutation: PUBLISH,
            variables: {
              ids: this.grid.selectedRows,
              channel: options.publicationChannel,
            },
          })
          .toPromise()
      );
    }
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    // Send email using backend mail service.
    if (options.sendMail) {
      const body =
        this.grid.selectedRows.length > 0
          ? options.bodyText
          : options.bodyTextAlternate;
      this.emailService.previewMail(
        options.distributionList,
        options.subject,
        body,
        {
          logic: 'and',
          filters: [
            { operator: 'eq', field: 'ids', value: this.grid.selectedRows },
          ],
        },
        {
          name: this.settings.query.name,
          fields: options.bodyFields,
        },
        this.grid.sortField || undefined,
        this.grid.sortOrder || undefined,
        options.export
      );
    }

    // Opens a form with selected records.
    if (options.prefillForm) {
      const promisedRecords: Promise<any>[] = [];
      // Fetches the record object for each selected record.
      for (const record of this.grid.selectedItems) {
        promisedRecords.push(
          this.apollo
            .query<GetRecordDetailsQueryResponse>({
              query: GET_RECORD_DETAILS,
              variables: {
                id: record.id,
              },
            })
            .toPromise()
        );
      }
      const records = (await Promise.all(promisedRecords)).map(
        (x) => x.data.record
      );

      // Opens a modal containing the prefilled form.
      this.dialog.open(SafeFormModalComponent, {
        data: {
          template: options.prefillTargetForm,
          prefillRecords: records,
          askForConfirm: false,
        },
        autoFocus: false,
      });
    }

    // Workflow only: goes to next step, or closes the workflow.
    if (options.goToNextStep || options.closeWorkflow) {
      if (options.goToNextStep) {
        this.goToNextStep.emit(true);
      } else {
        const dialogRef = this.confirmService.openConfirmModal({
          title: this.translate.instant(
            'components.widget.settings.grid.buttons.callback.workflow.close'
          ),
          content: options.confirmationText,
          confirmText: this.translate.instant(
            'components.confirmModal.confirm'
          ),
          confirmColor: 'primary',
        });
        dialogRef.afterClosed().subscribe((confirm: boolean) => {
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
      if (['Date', 'DateTime'].includes(modification.field.type.name)) {
        update[modification.field.name] = this.getDateForFilter(
          modification.value
        );
      } else if (['Time'].includes(modification.field.type.name)) {
        update[modification.field.name] = this.getTimeForFilter(
          modification.value
        );
      } else {
        update[modification.field.name] = modification.value;
      }
    }
    const data = cleanRecord(update);
    return this.apollo
      .mutate<EditRecordsMutationResponse>({
        mutation: EDIT_RECORDS,
        variables: {
          ids,
          data,
          template: this.settings.query?.template,
        },
      })
      .toPromise();
  }

  /**
   * Gets from input date value the three dates used for filtering.
   *
   * @param value input date value
   * @returns calculated day, beginning of day, and ending of day
   */
  private getDateForFilter(value: any): Date {
    // today's date
    let date: Date;
    if (value === 'today()') {
      date = new Date();
      // today + number of days
    } else if (REGEX_PLUS.test(value)) {
      const difference = parseInt(value.split('+')[1], 10);
      date = new Date();
      date.setDate(date.getDate() + difference);
      // today - number of days
    } else if (REGEX_MINUS.test(value)) {
      const difference = -parseInt(value.split('-')[1], 10);
      date = new Date();
      date.setDate(date.getDate() + difference);
      // classic date
    } else {
      date = new Date(value);
    }
    return date;
  }

  /**
   * Gets from input time value a time value display.
   *
   * @param value record value
   * @returns calculated time
   */
  private getTimeForFilter(value: any): string {
    if (value === 'now()') {
      const time = new Date()
        .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        .split(/:| /);
      if (
        (time[2] === 'PM' && time[0] !== '12') ||
        (time[2] === 'AM' && time[0] === '12')
      ) {
        time[0] = (parseInt(time[0], 10) + 12).toString();
      }
      return time[0] + ':' + time[1];
    } else {
      return value;
    }
  }

  /**
   * Open a modal to select which record we want to attach the rows to and
   * perform the attach.
   * The inputs comes from 'attach to record' button from grid component
   *
   * @param selectedRecords The list of selected records
   * @param targetForm The targetted form
   * @param targetFormField The form field
   * @param targetFormQuery The form query
   */
  private async promisedAttachToRecord(
    selectedRecords: string[],
    targetForm: Form,
    targetFormField: string,
    targetFormQuery: any
  ): Promise<void> {
    const dialogRef = this.dialog.open(SafeChooseRecordModalComponent, {
      data: {
        targetForm,
        targetFormField,
        targetFormQuery,
      },
    });
    const value = await Promise.resolve(dialogRef.afterClosed().toPromise());
    if (value && value.record) {
      this.apollo
        .query<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: value.record,
          },
        })
        .subscribe((res) => {
          const resourceField = targetForm.fields?.find(
            (field) =>
              field.resource && field.resource === this.settings.resource
          );
          let data = res.data.record.data;
          const key = resourceField.name;
          if (resourceField.type === 'resource') {
            data = { ...data, [key]: selectedRecords[0] };
          } else {
            if (data[key]) {
              data = { ...data, [key]: data[key].concat(selectedRecords) };
            } else {
              data = { ...data, [key]: selectedRecords };
            }
          }
          this.apollo
            .mutate<EditRecordMutationResponse>({
              mutation: EDIT_RECORD,
              variables: {
                id: value.record,
                data,
              },
            })
            .subscribe((res2) => {
              if (res2.data) {
                const record = res2.data.editRecord;
                if (record) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'models.record.notifications.rowsAdded',
                      {
                        field: record.data[targetFormField],
                        length: selectedRecords.length,
                        value: key,
                      }
                    )
                  );
                  this.dialog.open(SafeFormModalComponent, {
                    disableClose: true,
                    data: {
                      recordId: record.id,
                    },
                    autoFocus: false,
                  });
                }
              }
            });
        });
    }
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
      ...{ template: this.settings.query?.template },
    };
  }

  /**
   * Resets the current layout.
   */
  onResetLayout(): void {
    this.onLayoutChange(this.layout || {});
  }
}
