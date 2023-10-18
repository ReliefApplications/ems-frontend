import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationService,
  ConfirmService,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { distinctUntilChanged, takeUntil } from 'rxjs';

/**
 * Mocked Interface
 */
export interface ArchivePage {
  id: string;
  name: string;
  autoDeletedAt: Date;
}

/**
 * This component is used to display application archives
 */
@Component({
  selector: 'shared-applications-archive',
  templateUrl: './applications-archive.component.html',
  styleUrls: ['./applications-archive.component.scss'],
})
export class ApplicationsArchiveComponent
  extends UnsubscribeComponent
  implements OnInit
{
  loading = false;
  @Input() pages: ArchivePage[] = [];
  public visiblePages: Array<ArchivePage> = new Array<ArchivePage>();
  public displayedColumns = ['name', 'autoDeletedAt', 'actions'];

  // === FILTERS ===
  public filters = [
    { id: 'name', value: '' },
    { id: 'autoDeletedAt', value: '' },
  ];
  public form = this.fb.group({});
  public searchText = '';
  public dateFilter = '';

  /**
   * Applications archive constructor
   *
   * @param applicationService Shared application service
   * @param translate Angular Translate service
   * @param confirmService Shared confirmation service
   * @param fb Angular form builder
   */
  constructor(
    private applicationService: ApplicationService,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.searchText = (value?.search ?? '').trim().toLowerCase();
        this.applyFilter('', this.searchText);
      });
    this.filterPredicate();
  }

  /**
   * Filter roles and users.
   */
  private filterPredicate(): void {
    this.visiblePages = this.pages.filter(
      (data: ArchivePage) =>
        (this.searchText.trim().length === 0 ||
          (this.searchText.trim().length > 0 &&
            data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.dateFilter.trim().length === 0 ||
          (this.dateFilter.trim().length > 0 &&
            data.autoDeletedAt.toString().includes(this.dateFilter.trim())))
    );
  }

  /**
   * Applies filters to the list of roles on event
   *
   * @param column Name of the column where the filtering happens
   * @param event The event
   */
  applyFilter(column: string, event: any): void {
    if (column === 'autoDeletedAt') {
      this.dateFilter = event.target
        ? event.target.value.trim().toLowerCase()
        : '';
    }
    this.filterPredicate();
  }

  /**
   * Clear all the filters
   */
  clearAllFilters(): void {
    this.dateFilter = '';
    this.form.reset();
  }

  /**
   * Ask admin for confirmation to delete the page.
   * Then, use app service to delete it if confirmed.
   *
   * @param page page to delete
   */
  onDelete(page: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.archive.modal.delete.title'),
      content: this.translate.instant(
        'common.archive.modal.delete.confirmationMessage',
        {
          name: page.name || page.id,
        }
      ),
      confirmText: this.translate.instant('common.archive.modal.delete.action'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.pages = this.pages.filter((p) => p.id !== page.id); //remove the deleted page from the archive
        this.filterPredicate();
        this.applicationService.deletePage(page.id, true);
      }
    });
  }

  /**
   * Ask admin for confirmation to restore the page.
   * Then, use app service to restore it if confirmed.
   *
   * @param page page to restore
   */
  onRestore(page: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.archive.modal.restore.title'),
      content: this.translate.instant(
        'common.archive.modal.restore.confirmationMessage',
        {
          name: page.name || page.id,
        }
      ),
      confirmText: this.translate.instant(
        'common.archive.modal.restore.action'
      ),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.restorePage(page.id);
      }
    });
  }
}
