import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerDocument } from '../types/file-explorer-document.type';
import { FileExplorerListItemComponent } from '../file-explorer-list-item/file-explorer-list-item.component';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { PaginatorModule, SpinnerModule } from '@oort-front/ui';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';
import { EmptyModule } from '../../ui/empty/empty.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * File explorer 'list' view component.
 * Display list of documents.
 */
@Component({
  selector: 'shared-file-explorer-list',
  standalone: true,
  imports: [
    CommonModule,
    FileExplorerListItemComponent,
    PaginatorModule,
    SpinnerModule,
    EmptyModule,
    TranslateModule,
  ],
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss'],
})
export class FileExplorerListComponent implements OnChanges {
  /** List of documents */
  @Input() listData: FileExplorerDocument[] = [];
  /** Total document */
  @Input() total = 0;
  /** Skip value */
  @Input() skip = 0;
  /** Loading indicator */
  @Input() loading = true;
  /** Page change event emitter */
  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  /** Item click event emitter */
  @Output() itemClick = new EventEmitter<FileExplorerDocument>();
  /** Page size */
  public pageSize = 10;
  /** Page index */
  public pageIndex = 0;
  /** Parent component */
  public parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );

  ngOnChanges(): void {
    this.pageIndex = Math.floor(this.skip / this.pageSize);
  }
}
