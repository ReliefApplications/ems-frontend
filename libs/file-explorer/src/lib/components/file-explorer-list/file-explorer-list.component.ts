import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerDocument } from '../../types/file-explorer-document.type';

@Component({
  selector: 'oort-front-file-explorer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss'],
})
export class FileExplorerListComponent {
  @Input() listData: FileExplorerDocument[] = [];
}
