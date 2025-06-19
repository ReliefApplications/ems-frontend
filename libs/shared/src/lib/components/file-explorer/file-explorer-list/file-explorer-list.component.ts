import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerDocument } from '../types/file-explorer-document.type';
import { FileExplorerListItemComponent } from '../file-explorer-list-item/file-explorer-list-item.component';

/**
 * File explorer 'list' view component.
 * Display list of documents.
 */
@Component({
  selector: 'shared-file-explorer-list',
  standalone: true,
  imports: [CommonModule, FileExplorerListItemComponent],
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss'],
})
export class FileExplorerListComponent {
  /** List of documents */
  @Input() listData: FileExplorerDocument[] = [];
}
