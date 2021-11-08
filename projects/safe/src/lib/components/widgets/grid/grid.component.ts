import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import {
  EDIT_RECORD, EditRecordMutationResponse,
  PUBLISH, PUBLISH_NOTIFICATION, PublishMutationResponse, PublishNotificationMutationResponse
} from '../../../graphql/mutations';
import { SafeFormModalComponent } from '../../form-modal/form-modal.component';
import { Form } from '../../../models/form.model';
import { GetRecordDetailsQueryResponse, GET_RECORD_DETAILS,
  GetRecordByIdQueryResponse, GET_RECORD_BY_ID } from '../../../graphql/queries';
import { Component, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeWorkflowService } from '../../../services/workflow.service';
import { SafeChooseRecordModalComponent } from '../../choose-record-modal/choose-record-modal.component';
import { SafeDownloadService } from '../../../services/download.service';
import { NOTIFICATIONS } from '../../../const/notifications';
import { SafeEmailService } from '../../../services/email.service';
import { GridLayout } from '../../ui/grid-core/models/grid-layout.model';
import { SafeGridCoreComponent } from '../../ui/grid-core/grid-core.component';

@Component({
  selector: 'safe-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
/*  Grid widget using KendoUI.
*/
export class SafeGridComponent implements OnChanges {

  // === TEMPLATE REFERENCE TO GRID ===
  @ViewChild(SafeGridCoreComponent) private grid?: SafeGridCoreComponent;

  // === CACHED CONFIGURATION ===
  @Input() layout: GridLayout = {};

  // === SETTINGS ===
  @Input() header = true;
  @Input() settings: any = null;

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  // === MANAGE LAYOUT SAVE ===
  @Output() layoutChanged: EventEmitter<any> = new EventEmitter();

  @Output() defaultLayoutChanged: EventEmitter<any> = new EventEmitter();

  // === DOWNLOAD ===
  public excelFileName = '';

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private workflowService: SafeWorkflowService,
    private downloadService: SafeDownloadService,
    private emailService: SafeEmailService
  ) {}

  /*  Detect changes of the settings to (re)load the data.
  */
  ngOnChanges(changes: any): void {
    this.settings = {...this.settings, showDetails: true, showExport: true};
  }

  /* Send emitters to parent component to manage layout save
  */
  onDefaultLayoutChanged(e: any): void {
    this.defaultLayoutChanged.emit(e);
  }
  onLayoutChanged(e: any): void {
    this.layoutChanged.emit(e);
  }

  /* Execute sequentially actions enabled by settings for the floating button
  */
  public async onFloatingButtonClick(options: any): Promise<void> {
    let rowsIndexToModify = [...(this.grid?.selectedRowsIndex || [])];

    if (options.autoSave && options.modifySelectedRows) {
      const unionRows = this.grid?.selectedRowsIndex.filter(index => {
         return this.grid?.updatedItems.some(item => item.id === this.grid?.gridData.data[index].id);
      }) || [];
      if (unionRows.length > 0) {
        await Promise.all(this.promisedRowsModifications(options.modifications, unionRows));
        if (this.grid?.updatedItems) {
          this.grid.updatedItems = this.grid?.updatedItems.filter(x => !unionRows.some(y => x.id === this.grid?.gridData.data[y].id));
        }
        rowsIndexToModify = rowsIndexToModify.filter(x => !unionRows.includes(x));
      }
    }

    if (options.autoSave) {
      await Promise.all(this.grid?.promisedChanges() || [new Promise(() => {return; })]);
    }
    if (options.modifySelectedRows) {
      await Promise.all(this.promisedRowsModifications(options.modifications, rowsIndexToModify));
    }
    if (this.grid?.selectedRowsIndex && this.grid?.selectedRowsIndex.length > 0) {
      const selectedRecords = this.grid?.gridData.data.filter((x, index) => this.grid?.selectedRowsIndex.includes(index)) || [];
      if (options.attachToRecord) {
        await this.promisedAttachToRecord(selectedRecords, options.targetForm, options.targetFormField, options.targetFormQuery);
      }
      const promises: Promise<any>[] = [];
      if (options.notify) {
        promises.push(this.apollo.mutate<PublishNotificationMutationResponse>({
          mutation: PUBLISH_NOTIFICATION,
          variables: {
            action: options.notificationMessage ? options.notificationMessage : 'Records update',
            content: selectedRecords,
            channel: options.notificationChannel
          }
        }).toPromise());
      }
      if (options.publish) {
        promises.push(this.apollo.mutate<PublishMutationResponse>({
          mutation: PUBLISH,
          variables: {
            ids: selectedRecords.map(x => x.id),
            channel: options.publicationChannel
          }
        }).toPromise());
      }
      if (options.sendMail && selectedRecords.length > 0) {
        const emailSettings = { query: {
          name: this.settings.query.name,
          fields: options.bodyFields
        }};
        this.emailService.sendMail(options.distributionList, options.subject, emailSettings, selectedRecords.map(x => x.id).length );
        this.grid?.onExportRecord(this.grid?.selectedRowsIndex, 'xlsx');
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }

      if (options.prefillForm) {
        const promisedRecords: Promise<any>[] = [];
        // Fetch the record object for each selected record
        for (const record of selectedRecords) {
          promisedRecords.push(this.apollo.query<GetRecordDetailsQueryResponse>({
            query: GET_RECORD_DETAILS,
            variables: {
              id: record.id
            }
          }).toPromise());
        }
        const records = (await Promise.all(promisedRecords)).map(x => x.data.record);

        // Open a modal containing the prefilled form
        this.dialog.open(SafeFormModalComponent, {
          data: {
            template: options.prefillTargetForm,
            locale: 'en',
            prefillRecords: records,
            askForConfirm: false
          },
          autoFocus: false
        });
      }
    }

    /* Next Step button, open a confirm modal if required
    */
    if (options.goToNextStep || options.closeWorkflow) {
      if (options.goToNextStep) {
        this.goToNextStep.emit(true);
      } else {
        const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
          data: {
            title: `Close workflow`,
            content: options.confirmationText,
            confirmText: 'Yes',
            confirmColor: 'primary'
          }
        });
        dialogRef.afterClosed().subscribe((confirm: boolean) => {
          if (confirm) {
            this.workflowService.closeWorkflow();
          }
        });
      }
    } else {
      this.grid?.ngOnChanges();
    }
  }

  /*  Return a list of promises containing all the mutations in order to modify selected records accordingly to settings.
      Apply inline edition before applying modifications.
  */
  private promisedRowsModifications(modifications: any[], rows: number[]): Promise<any>[] {
    const promises: Promise<any>[] = [];
    for (const index of rows) {
      const record = this.grid?.gridData.data[index];
      const data = Object.assign({}, record);
      for (const modification of modifications) {
        if (modification.value === 'today()' && modification.field.type.name === 'Date') {
          data[modification.field.name] = new Date();
        } else {
          data[modification.field.name] = modification.value;
        }
      }
      delete data.id;
      delete data.__typename;
      promises.push(this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: record.id,
          data,
          template: this.settings.query.template
        }
      }).toPromise());
    }
    return promises;
  }

  /* Download the file.
  */
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

  /* Open a modal to select which record we want to attach the rows to and perform the attach.
  */
  private async promisedAttachToRecord(
    // come from 'attach to record' button from grid component
    selectedRecords: any[], targetForm: Form, targetFormField: string, targetFormQuery: any): Promise<void> {
    const dialogRef = this.dialog.open(SafeChooseRecordModalComponent, {
      data: {
        targetForm,
        targetFormField,
        targetFormQuery
      },
    });
    const value = await Promise.resolve(dialogRef.afterClosed().toPromise());
    if (value && value.record) {
      this.apollo.query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id: value.record
        }
      }).subscribe(res => {
        const resourceField = targetForm.fields?.find(field => field.resource && field.resource === this.settings.resource);
        let data = res.data.record.data;
        const key = resourceField.name;
        if (resourceField.type === 'resource') {
          data = { ...data, [key]: selectedRecords[0].id };
        } else {
          if (data[key]) {
            const ids = selectedRecords.map(x => x.id);
            data = { ...data, [key]: data[key].concat(ids) };
          } else {
            data = { ...data, [key]: selectedRecords.map(x => x.id) };
          }
        }
        this.apollo.mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id: value.record,
            data
          }
        }).subscribe(res2 => {
          if (res2.data) {
            const record = res2.data.editRecord;
            if (record) {
              this.snackBar.openSnackBar(NOTIFICATIONS.addRowsToRecord(selectedRecords.length, key, record.data[targetFormField]));
              this.dialog.open(SafeFormModalComponent, {
                data: {
                  recordId: record.id,
                  locale: 'en'
                },
                autoFocus: false
              });
            }
          }
        });
      });
    }
  }
}
