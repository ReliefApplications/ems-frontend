import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';

const ALL_TAGS = [
  {
    text: 'Aetiology',
    value: 'aetiology',
  },
  {
    text: 'Confidentiality',
    value: 'informationconfidentiality',
  },
];

@Component({
  selector: 'shared-file-explorer-folders-list-box',
  standalone: true,
  imports: [CommonModule, ListBoxModule],
  templateUrl: './file-explorer-folders-list-box.component.html',
  styleUrls: ['./file-explorer-folders-list-box.component.scss'],
})
export class FileExplorerFoldersListBoxComponent implements OnInit {
  /** Listbox toolbar settings */
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: [
      'moveUp',
      'moveDown',
      'transferFrom',
      'transferTo',
      'transferAllFrom',
      'transferAllTo',
    ],
  };
  public availableTags: { text: string; value: string }[] = [];
  public selectedTags: { text: string; value: string }[] = [];

  ngOnInit(): void {
    this.availableTags = [...ALL_TAGS];
  }

  public handleActionClick() {
    console.log('action click');
  }
}
