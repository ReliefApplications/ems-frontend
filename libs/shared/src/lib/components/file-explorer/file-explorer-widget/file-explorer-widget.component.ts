import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FileExplorerToolbarComponent } from '../file-explorer-toolbar/file-explorer-toolbar.component';
import { FileExplorerTableComponent } from '../file-explorer-table/file-explorer-table.component';
import { fileExplorerView } from '../types/file-explorer-view.type';
import { FileExplorerListComponent } from '../file-explorer-list/file-explorer-list.component';
import { FileExplorerDocument } from '../types/file-explorer-document.type';

/**
 * File explorer widget component.
 */
@Component({
  selector: 'oort-front-file-explorer-widget',
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
export class FileExplorerWidgetComponent {
  /** Current view */
  public view: fileExplorerView = 'list';
  /** List of documents */
  public documents: FileExplorerDocument[] = [];
}
