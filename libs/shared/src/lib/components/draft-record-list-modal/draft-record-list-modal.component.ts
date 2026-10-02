import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import {
  GridModule,
  PageChangeEvent,
  PagerSettings,
} from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { firstValueFrom, takeUntil } from 'rxjs';
import {
  ButtonModule,
  DialogModule,
  SnackbarService,
  TooltipModule,
} from '@oort-front/ui';
import { DateModule } from '../../pipes/date/date.module';
import { Form } from '../../models/form.model';
import {
  DraftRecordsQueryResponse,
  DraftRecordSummary,
  Record as RecordModel,
  RecordIdAndDataQueryResponse,
} from '../../models/record.model';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { EmptyModule } from '../ui/empty/empty.module';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { GET_DRAFT_RECORD, GET_DRAFT_RECORDS } from './graphql/queries';

/** Number of draft summaries requested per page. */
const DEFAULT_PAGE_SIZE = 10;

/** Dialog data interface. */
interface DialogData {
  form: Form;
}

/** Display a paginated list of the current user's drafts for a form. */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    DateModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    EmptyModule,
  ],
  selector: 'shared-draft-record-list-modal',
  templateUrl: './draft-record-list-modal.component.html',
  styleUrls: ['./draft-record-list-modal.component.scss'],
})
export class DraftRecordListModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Server-backed table data. */
  public dataset: { data: DraftRecordSummary[]; total: number } = {
    data: [],
    total: 0,
  };
  /** Current server page. */
  public pageInfo = { skip: 0, take: DEFAULT_PAGE_SIZE };
  /** Available page sizes. */
  public pagerSettings: PagerSettings = {
    buttonCount: 5,
    type: 'numeric',
    info: true,
    pageSizes: [10, 25, 50, 100],
    previousNext: true,
  };
  /** Current server sort. */
  public sort: SortDescriptor[] = [{ field: 'modifiedAt', dir: 'desc' }];
  /** List loading indicator. */
  public loading = true;
  /** Selected draft currently being loaded for an action. */
  public loadingDraftId?: string;
  /** Action currently loading the selected draft. */
  public loadingDraftAction?: 'load' | 'preview';
  /** Identifies the latest list request so stale responses are ignored. */
  private requestVersion = 0;
  /** Identifies the latest full-draft action request. */
  private actionRequestVersion = 0;
  /** Whether the modal has been destroyed. */
  private destroyed = false;

  /**
   * Creates the draft list modal.
   *
   * @param confirmService Shared confirmation service
   * @param translate Translation service
   * @param apollo Apollo client
   * @param dialog CDK dialog service
   * @param dialogRef Current dialog reference
   * @param formHelpersService Shared form helper service
   * @param snackBar Shared snackbar service
   * @param data Current form passed to the dialog
   */
  constructor(
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private apollo: Apollo,
    public dialog: Dialog,
    public dialogRef: DialogRef<RecordModel | undefined>,
    public formHelpersService: FormHelpersService,
    private snackBar: SnackbarService,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchDraftRecords();
  }

  /** Fetches one page of minimal draft summaries. */
  fetchDraftRecords(): void {
    const formId = this.data.form?.id;
    if (!formId) {
      this.loading = false;
      this.snackBar.openSnackBar(
        this.translate.instant('components.form.draftRecords.listLoadError'),
        { error: true }
      );
      return;
    }

    const requestVersion = ++this.requestVersion;
    const activeSort = this.sort[0];
    this.loading = true;
    this.apollo
      .query<DraftRecordsQueryResponse>({
        query: GET_DRAFT_RECORDS,
        variables: {
          form: formId,
          first: this.pageInfo.take,
          skip: this.pageInfo.skip,
          sortField: activeSort.field,
          sortOrder: activeSort.dir,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          if (requestVersion !== this.requestVersion) return;
          this.dataset = {
            data: data.draftRecords.edges.map(({ node }) => node),
            total: data.draftRecords.totalCount,
          };
          this.loading = false;
        },
        error: (err: Error) => {
          if (requestVersion !== this.requestVersion) return;
          this.loading = false;
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Requests a different server page.
   *
   * @param event Kendo page event
   */
  onPage(event: PageChangeEvent): void {
    this.pageInfo = { skip: event.skip, take: event.take };
    this.fetchDraftRecords();
  }

  /**
   * Applies server sorting on a timestamp column.
   *
   * @param sort Kendo sort descriptors
   */
  onSort(sort: SortDescriptor[]): void {
    if (!sort[0]?.dir) return;
    this.sort = sort;
    this.pageInfo = { ...this.pageInfo, skip: 0 };
    this.fetchDraftRecords();
  }

  /**
   * Opens a selected draft preview after loading its data on demand.
   *
   * @param element Selected draft summary
   */
  async onPreview(element: DraftRecordSummary): Promise<void> {
    const requestVersion = this.startDraftAction(element.id, 'preview');
    try {
      const record = await this.loadDraft(element.id);
      if (requestVersion !== this.actionRequestVersion) return;
      const { DraftRecordModalComponent } = await import(
        '../draft-record-modal/draft-record-modal.component'
      );
      if (requestVersion !== this.actionRequestVersion) return;
      this.dialog.open(DraftRecordModalComponent, {
        data: { form: this.data.form, data: record.data },
      });
    } catch (err) {
      if (requestVersion === this.actionRequestVersion) {
        this.showLoadError(err);
      }
    } finally {
      if (requestVersion === this.actionRequestVersion) {
        this.loadingDraftId = undefined;
        this.loadingDraftAction = undefined;
      }
    }
  }

  /**
   * Handles deletion of a draft and refreshes the active page.
   *
   * @param element Selected draft summary
   */
  onDelete(element: DraftRecordSummary): void {
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (!value) return;
      this.loading = true;
      this.formHelpersService.deleteRecordDraft(
        element.id,
        () => {
          if (this.destroyed) return;
          if (this.dataset.data.length === 1 && this.pageInfo.skip > 0) {
            this.pageInfo = {
              ...this.pageInfo,
              skip: Math.max(0, this.pageInfo.skip - this.pageInfo.take),
            };
          }
          this.fetchDraftRecords();
        },
        () => {
          if (this.destroyed) return;
          this.loading = false;
        }
      );
    });
  }

  /**
   * Confirms and loads a selected draft into the parent form.
   *
   * @param element Selected draft summary
   */
  async onClose(element: DraftRecordSummary): Promise<void> {
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
    let value: unknown;
    try {
      value = await firstValueFrom(
        confirmDialogRef.closed.pipe(takeUntil(this.destroy$))
      );
    } catch (err) {
      if (!this.destroyed) {
        this.showLoadError(err);
      }
      return;
    }
    if (!value) return;
    const requestVersion = this.startDraftAction(element.id, 'load');
    try {
      const record = await this.loadDraft(element.id);
      if (requestVersion !== this.actionRequestVersion) return;
      this.dialogRef.close(record);
    } catch (err) {
      if (requestVersion === this.actionRequestVersion) {
        this.showLoadError(err);
        this.loadingDraftId = undefined;
        this.loadingDraftAction = undefined;
      }
    }
  }

  /**
   * Loads the full selected draft through the authorized record query.
   *
   * @param id Selected draft id
   * @returns Full authorized draft
   */
  private async loadDraft(
    id: string
  ): Promise<Pick<RecordModel, 'id' | 'data'>> {
    const { data } = await firstValueFrom(
      this.apollo
        .query<RecordIdAndDataQueryResponse>({
          query: GET_DRAFT_RECORD,
          variables: { id },
          fetchPolicy: 'network-only',
        })
        .pipe(takeUntil(this.destroy$))
    );
    return data.record;
  }

  /**
   * Marks a full-draft request as the active action.
   *
   * @param id Selected draft id
   * @param action Selected draft action
   * @returns Active action request version
   */
  private startDraftAction(id: string, action: 'load' | 'preview'): number {
    this.loadingDraftId = id;
    this.loadingDraftAction = action;
    return ++this.actionRequestVersion;
  }

  /**
   * Displays a draft loading or lazy-import failure.
   *
   * @param err Loading error
   */
  private showLoadError(err: unknown): void {
    const message = err instanceof Error ? err.message : String(err);
    this.snackBar.openSnackBar(message, { error: true });
  }

  /** Cancels pending list and full-draft requests. */
  override ngOnDestroy(): void {
    this.destroyed = true;
    this.requestVersion++;
    this.actionRequestVersion++;
    super.ngOnDestroy();
  }
}
