import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FileExplorerToolbarComponent } from '../file-explorer-toolbar/file-explorer-toolbar.component';
import { FileExplorerTableComponent } from '../file-explorer-table/file-explorer-table.component';
import { fileExplorerView } from '../types/file-explorer-view.type';
import { FileExplorerListComponent } from '../file-explorer-list/file-explorer-list.component';
import { FileExplorerDocument } from '../types/file-explorer-document.type';
import { BaseWidgetComponent } from '../../widgets/base-widget/base-widget.component';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { BehaviorSubject, switchMap, takeUntil } from 'rxjs';
import { PageChangeEvent } from '@progress/kendo-angular-pager';

/**
 * File explorer widget component.
 */
@Component({
  selector: 'shared-file-explorer-widget',
  standalone: true,
  imports: [
    CommonModule,
    LayoutModule,
    FileExplorerToolbarComponent,
    FileExplorerTableComponent,
    FileExplorerListComponent,
  ],
  templateUrl: './file-explorer-widget.component.html',
  styleUrls: ['./file-explorer-widget.component.scss'],
})
export class FileExplorerWidgetComponent
  extends BaseWidgetComponent
  implements OnInit
{
  /** Widget settings */
  @Input() settings: any;
  /** Current view */
  public view: fileExplorerView = 'list';
  /** List of documents */
  public documents: FileExplorerDocument[] = [];
  /** Total documents */
  public total = 0;
  /** Number of documents to skip */
  public skip = 0;
  /** Page size */
  private pageSize = 10;
  /** Current page index */
  private page = new BehaviorSubject<number>(1);
  /** Shared document management service */
  private documentManagementService = inject(DocumentManagementService);

  ngOnInit(): void {
    this.page
      .pipe(
        switchMap((page) =>
          this.documentManagementService.listDocuments({
            offset: (page - 1) * this.pageSize,
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ data }) => {
        console.log('query done');
        this.documents = data.items.map((x) => x.document);
        this.total = data.metadata[0].aggregate_count;
        this.skip = (this.page.getValue() - 1) * this.pageSize;
      });
  }

  /**
   * On page change, emit a new page event to subscribe to
   *
   * @param page Page change event
   */
  onPageChange(page: PageChangeEvent) {
    console.log('change');
    const pageNumber = page.skip / this.pageSize + 1;
    console.log(pageNumber);
    this.page.next(pageNumber);
  }
}
