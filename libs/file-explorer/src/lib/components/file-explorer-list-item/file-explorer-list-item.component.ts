import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerDocument } from '../../types/file-explorer-document.type';
import { IconModule } from '@oort-front/ui';
import { FileIconPipe } from '../../pipes/file-icon/file-icon.pipe';

@Component({
  selector: 'oort-front-file-explorer-list-item',
  standalone: true,
  imports: [CommonModule, IconModule, FileIconPipe],
  templateUrl: './file-explorer-list-item.component.html',
  styleUrls: ['./file-explorer-list-item.component.scss'],
})
export class FileExplorerListItemComponent {
  @Input() document!: FileExplorerDocument;
}
