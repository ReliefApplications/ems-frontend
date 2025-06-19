import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerFoldersListBoxComponent } from '../file-explorer-folders-list-box/file-explorer-folders-list-box.component';

@Component({
  selector: 'shared-file-explorer-folders-tab',
  standalone: true,
  imports: [CommonModule, FileExplorerFoldersListBoxComponent],
  templateUrl: './file-explorer-folders-tab.component.html',
  styleUrls: ['./file-explorer-folders-tab.component.scss'],
})
export class FileExplorerFoldersTabComponent {}
