import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerDocument } from '../../types/file-explorer-document.type';
import { IconModule } from '@oort-front/ui';
import { FileIconPipe } from '../../pipes/file-icon/file-icon.pipe';

/**
 * File explorer list item component.
 * Display a single document in 'list' view.
 */
@Component({
  selector: 'oort-front-file-explorer-list-item',
  standalone: true,
  imports: [CommonModule, IconModule, FileIconPipe],
  templateUrl: './file-explorer-list-item.component.html',
  styleUrls: ['./file-explorer-list-item.component.scss'],
})
export class FileExplorerListItemComponent {
  /** Document */
  @Input() document!: FileExplorerDocument;
}
