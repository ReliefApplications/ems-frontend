import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FileExplorerToolbarComponent } from '../file-explorer-toolbar/file-explorer-toolbar.component';
import { FileExplorerTableComponent } from '../file-explorer-table/file-explorer-table.component';
import { fileExplorerView } from '../types/file-explorer-view.type';
import { FileExplorerListComponent } from '../file-explorer-list/file-explorer-list.component';
import { FileExplorerDocument } from '../types/file-explorer-document.type';
import { BaseWidgetComponent } from '../../widgets/base-widget/base-widget.component';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import {
  FileExplorerFilter,
  FileExplorerTagKey,
  FileExplorerTagSelection,
} from '../types/file-explorer-filter.type';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { FileExplorerTreeviewComponent } from '../file-explorer-treeview/file-explorer-treeview.component';
import { FileExplorerBreadcrumbComponent } from '../file-explorer-breadcrumb/file-explorer-breadcrumb.component';
import { FileExplorerDocumentPropertiesComponent } from '../file-explorer-document-properties/file-explorer-document-properties.component';
import { ContextService } from '../../../services/context/context.service';
import getFilter from '../../../utils/common-services/filter.util';

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
    FileExplorerTreeviewComponent,
    FileExplorerBreadcrumbComponent,
    FileExplorerDocumentPropertiesComponent,
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
  /** Loading indicator */
  public loading = true;
  /** List of documents */
  public documents: FileExplorerDocument[] = [];
  /** Total documents */
  public total = 0;
  /** Number of documents to skip */
  public skip = 0;
  /** Page size */
  private pageSize = 10;
  /** Current page index */
  public page = new BehaviorSubject<number>(1);
  /** Filter */
  private filter: FileExplorerFilter = {
    search: '',
  };
  /** Sort descriptor */
  public sort: SortDescriptor[] = [
    {
      field: 'modifieddate',
      dir: 'desc',
    },
  ];
  /** Selected tags */
  public selectedTags: {
    tag: FileExplorerTagKey;
    id: number | string;
    text: string;
  }[] = [];
  /** Selected document ID */
  public selectedDocumentId?: string;
  /** Shared document management service */
  private documentManagementService = inject(DocumentManagementService);
  /** Shared context service */
  private contextService = inject(ContextService);
  /** Element ref */
  private el = inject(ElementRef);

  /** @returns Context filters array */
  get contextFilters(): CompositeFilterDescriptor | object {
    return this.settings.contextFilters
      ? JSON.parse(this.settings.contextFilters)
      : {};
  }

  ngOnInit(): void {
    this.page
      .pipe(
        tap(() => {
          this.selectedDocumentId = undefined;
          this.loading = true;
        }),
        switchMap((page) =>
          this.documentManagementService.listDocuments({
            offset: (page - 1) * this.pageSize,
            filter: {
              ...(this.filter.search && {
                filename_like: `%${this.filter.search}%`,
              }),
              ...this.getFilter(),
            },
            ...(this.sort.length && {
              sort: this.sort,
            }),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ data }) => {
        this.documents = data.items.map((x) => x.document);
        this.total = data.metadata[0].aggregate_count;
        this.skip = (this.page.getValue() - 1) * this.pageSize;
        this.loading = false;
      });
    this.contextService.filter$
      .pipe(
        // On working with web components we want to send filter value if this current element is in the DOM
        // Otherwise send value always
        filter(() =>
          this.contextService.shadowDomService.isShadowRoot
            ? this.contextService.shadowDomService.currentHost.contains(
                this.el.nativeElement
              )
            : true
        ),
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(({ previous, current }) => {
        if (
          this.contextService.filterRegex.test(this.settings.contextFilters)
        ) {
          if (
            this.contextService.shouldRefresh(this.settings, previous, current)
          ) {
            // If the context filter has changed, reset the selection of tags
            this.onSelectionChange([]);
          }
        }
      });
  }

  /**
   * On page change, emit a new page event to subscribe to
   *
   * @param page Page change event
   */
  onPageChange(page: PageChangeEvent) {
    const pageNumber = page.skip / this.pageSize + 1;
    this.page.next(pageNumber);
  }

  /**
   * On filter change, update filter and reset page
   *
   * @param filter Filter change event
   */
  onFilterChange(filter: FileExplorerFilter) {
    this.filter = filter;
    this.page.next(1);
  }

  /**
   * On tag selection change, update tag selection and reset page
   *
   * @param tags Tag selection change event
   */
  onSelectionChange(
    tags: {
      tag: FileExplorerTagKey;
      id: number | string;
      text: string;
    }[]
  ) {
    this.selectedTags = tags;
    this.page.next(1);
  }

  /**
   * On sort change, update sort and reset page
   *
   * @param sort Sort descriptor
   */
  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.page.next(1);
  }

  /**
   * On item click, fetch document properties
   *
   * @param document Clicked document
   */
  onItemClick(document: FileExplorerDocument) {
    this.selectedDocumentId = document.id;
  }

  /**
   * Generates a filter object based on the selected tags.
   * Use context service to replace any placeholders in the context filters.
   *
   * @returns An object representing the filter for the file explorer.
   */
  private getFilter(): FileExplorerTagSelection {
    const contextFilter = this.contextService.replaceFilter(
      this.contextFilters
    );
    this.contextService.removeEmptyPlaceholders(contextFilter);
    return {
      // User selected tags
      ...this.selectedTags.reduce((acc, tag) => {
        acc[tag.tag] = tag.id;
        return acc;
      }, {} as any),
      // Dashboard & context filters
      ...contextFilter,
      // Static filters, set by admin, cannot be overwritten by users
      ...(this.settings.filter ? getFilter(this.settings.filter) : {}),
    };
  }
}
