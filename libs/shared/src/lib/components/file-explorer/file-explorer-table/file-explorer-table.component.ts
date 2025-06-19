import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { FileExplorerDocument } from '../types/file-explorer-document.type';

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
export class FileExplorerTableComponent {
  /** List of documents */
  @Input() gridData: FileExplorerDocument[] = [];
}
