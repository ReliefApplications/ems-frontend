import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FileExplorerToolbarComponent } from '../file-explorer-toolbar/file-explorer-toolbar.component';
import { FileExplorerTableComponent } from '../file-explorer-table/file-explorer-table.component';
import { fileExplorerView } from '../../types/fie-explorer-view.type';

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
  ],
  templateUrl: './file-explorer-widget.component.html',
  styleUrls: ['./file-explorer-widget.component.scss'],
})
export class FileExplorerWidgetComponent {
  public view: fileExplorerView = 'list';
}
