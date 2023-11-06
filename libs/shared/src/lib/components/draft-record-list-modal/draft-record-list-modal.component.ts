import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DateModule } from '../../pipes/date/date.module';
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GET_DRAFT_RECORDS } from './graphql/queries';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import {
  DraftRecordsQueryResponse,
  DraftRecord,
} from '../../models/draft-record.model';
import {
  TableModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
} from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';
import { Form, FormQueryResponse } from '../../models/form.model';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';

/** Dialog data interface */
interface DialogData {
  form: string;
}

/**
 * Display list of available drafts for form & user, in a modal.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DateModule,
    DialogModule,
    ButtonModule,
    SkeletonTableModule,
    TooltipModule,
    EmptyModule,
  ],
  selector: 'shared-draft-record-list-modal',
  templateUrl: './draft-record-list-modal.component.html',
  styleUrls: ['./draft-record-list-modal.component.scss'],
})
export class DraftRecordListModalComponent implements OnInit {
  /** Array of available draft records */
  public draftRecords: Array<DraftRecord> = new Array<DraftRecord>();
  /** Displayed table columns */
  public displayedColumns = ['createdAt', 'actions'];
  /** Displayed skeleton table columns */
  public displayedColumnsForSkeleton = ['createdAt'];
  /** Loading indicator */
  public loading = true;
  /** Current form */
  private form!: Form;

  /** @returns True if the draft records table is empty */
  get empty(): boolean {
    return !this.loading && this.draftRecords.length === 0;
  }

  /**
   * Display list of available drafts for form & user, in a modal.
   *
   * @param confirmService Shared confirm service modal
   * @param translate Angular translate service
   * @param apollo Apollo service
   * @param dialog CDK Dialog service
   * @param dialogRef Dialog reference
   * @param formHelpersService This is the service that will handle forms.
   * @param data Data passed to the dialog, here the formId of the current form
   */
  constructor(
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private apollo: Apollo,
    public dialog: Dialog,
    public dialogRef: DialogRef<DraftRecordListModalComponent>,
    public formHelpersService: FormHelpersService,
    @Inject(DIALOG_DATA)
    public data: DialogData
  ) {}

  ngOnInit(): void {
    this.fetchDraftRecords();
  }

  /**
   * Fetches all the draft records associated to the current form
   */
  fetchDraftRecords() {
    this.apollo
      .query<DraftRecordsQueryResponse & FormQueryResponse>({
        query: GET_DRAFT_RECORDS,
        variables: {
          form: this.data.form,
        },
      })
      .pipe()
      .subscribe(({ data }) => {
        this.form = data.form;
        this.draftRecords = data.draftRecords;
        this.loading = false;
      });
  }

  /**
   * Opens an existing draft record on modal
   *
   * @param element draft record selected
   */
  async onPreview(element: DraftRecord) {
    const { DraftRecordModalComponent } = await import(
      '../draft-record-modal/draft-record-modal.component'
    );
    this.dialog.open(DraftRecordModalComponent, {
      data: {
        form: this.form,
        data: element.data,
      },
    });
  }

  /**
   * Handles the deletion of a specific draft record
   *
   * @param element Draft record to delete
   */
  onDelete(element: DraftRecord) {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant(
        'components.form.draftRecords.confirmModal.delete'
      ),
      content: this.translate.instant(
        'components.form.draftRecords.confirmModal.confirmDelete'
      ),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe().subscribe((value) => {
      if (value) {
        this.loading = true;
        const callback = () => {
          this.fetchDraftRecords();
        };
        this.formHelpersService.deleteRecordDraft(
          element.id as string,
          callback
        );
      }
    });
  }

  /**
   * Closes the modal
   *
   * @param element Draft record to be returned to form component
   */
  onClose(element: DraftRecord): void {
    const confirmDialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant(
        'components.form.draftRecords.confirmModal.load'
      ),
      content: this.translate.instant(
        'components.form.draftRecords.confirmModal.confirmLoad'
      ),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'primary',
    });
    confirmDialogRef.closed.pipe().subscribe((value) => {
      if (value) {
        this.dialogRef.close(element as any);
      }
    });
  }
}
