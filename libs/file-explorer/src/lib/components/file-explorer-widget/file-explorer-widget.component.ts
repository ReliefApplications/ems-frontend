import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FileExplorerTableComponent } from '../file-explorer-table/file-explorer-table.component';

/**
 * File explorer widget component.
 */
@Component({
  selector: 'oort-front-file-explorer-widget',
  standalone: true,
  imports: [CommonModule, LayoutModule, FileExplorerTableComponent],
  templateUrl: './file-explorer-widget.component.html',
  styleUrls: ['./file-explorer-widget.component.scss'],
})
export class FileExplorerWidgetComponent {}
