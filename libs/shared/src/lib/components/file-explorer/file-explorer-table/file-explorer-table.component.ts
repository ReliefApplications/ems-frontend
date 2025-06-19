import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDataResult, GridModule } from '@progress/kendo-angular-grid';
import { FileExplorerDocument } from '../types/file-explorer-document.type';
import { PAGER_SETTINGS } from './file-explorer-table.constants';
import { PageChangeEvent } from '@progress/kendo-angular-pager';

/**
 * File explorer 'grid' view component.
 * Display documents as table.
 */
@Component({
  selector: 'shared-file-explorer-table',
  standalone: true,
  imports: [CommonModule, GridModule],
  templateUrl: './file-explorer-table.component.html',
  styleUrls: ['./file-explorer-table.component.scss'],
})
export class FileExplorerTableComponent implements OnChanges {
  /** List of documents */
  @Input() gridData: FileExplorerDocument[] = [];
  /** Total document */
  @Input() total = 0;
  /** Skip value */
  @Input() skip = 0;
  /** Loading indicator */
  @Input() loading = true;
  /** Page change event emitter */
  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  /** Grid data */
  public data: GridDataResult = {
    data: [],
    total: 0,
  };
  /** Pager settings */
  public pagerSettings = PAGER_SETTINGS;
  /** Page size */
  public pageSize = 10;

  ngOnChanges(): void {
    this.data = {
      data: this.gridData,
      total: this.total,
    };
  }
}
