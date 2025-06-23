import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerFoldersListBoxComponent } from '../file-explorer-folders-list-box/file-explorer-folders-list-box.component';
import { FormGroup } from '@angular/forms';

/**
 * Component for displaying a tab with a list box of folders in the file explorer widget settings.
 * Allows users to select and manage folders.
 * Uses a custom FileExplorerFoldersListBoxComponent for selection and management of folders.
 */
@Component({
  selector: 'shared-file-explorer-folders-tab',
  standalone: true,
  imports: [CommonModule, FileExplorerFoldersListBoxComponent],
  templateUrl: './file-explorer-folders-tab.component.html',
  styleUrls: ['./file-explorer-folders-tab.component.scss'],
})
export class FileExplorerFoldersTabComponent {
  /** Current form group */
  @Input() formGroup!: FormGroup;
}
