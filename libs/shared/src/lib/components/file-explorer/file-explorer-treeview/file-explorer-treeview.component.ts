import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerTagKey } from '../types/file-explorer-filter.type';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { TreeItem, TreeViewModule } from '@progress/kendo-angular-treeview';
import { map } from 'rxjs';

/**
 * Structure of data used in the tree view.
 */
interface TreeData {
  id: number;
  compositeId: string;
  type: FileExplorerTagKey;
  text: string;
  items?: TreeData[];
}

/**
 * FileExplorerTreeviewComponent is a component that represents a tree view for file exploration.
 * Folders are generated from selection of tags.
 */
@Component({
  selector: 'shared-file-explorer-treeview',
  standalone: true,
  imports: [CommonModule, TreeViewModule],
  templateUrl: './file-explorer-treeview.component.html',
  styleUrls: ['./file-explorer-treeview.component.scss'],
})
export class FileExplorerTreeviewComponent implements OnInit {
  /** List of tags to generate folders */
  @Input() tags: FileExplorerTagKey[] = [];
  /** Treeview data */
  public data: TreeData[] = [];
  /** Selected keys in the tree view */
  public selectedKeys: any[] = [];
  /** Selected tags */
  private selectedTags: { tag: FileExplorerTagKey; id: number }[] = [];
  /** Shared document management service */
  private documentManagementService = inject(DocumentManagementService);

  ngOnInit() {
    console.log(this.tags);
    if (this.tags.length > 0) {
      this.getTagValues();
    }
  }

  private getTagValues() {
    this.documentManagementService
      .countDocuments({
        byTag: this.tags[0],
      })
      .subscribe(({ data }) => {
        this.data = data.metadata
          .map((item) => ({
            id: item.id,
            compositeId: `${this.tags[0]}_${item.id}`,
            // todo: translate
            text: item.name || 'Undefined',
            type: this.tags[0],
          }))
          .sort((a, b) => a.text.localeCompare(b.text));
        console.log(this.data);
      });
  }

  public fetchChildren(node: TreeData) {
    const nodeTag = node.compositeId.split('_')[0] as FileExplorerTagKey;
    const nextTag = this.tags[this.tags.indexOf(nodeTag) + 1];
    return this.documentManagementService
      .countDocuments({
        byTag: nextTag,
        filter: this.getFilter(),
      })
      .pipe(
        map(({ data }) => {
          return data.metadata
            .map((item) => ({
              id: item.id,
              compositeId: `${nextTag}_${item.id}`,
              // todo: translate
              text: item.name || 'Undefined',
              type: nextTag,
            }))
            .sort((a, b) => a.text.localeCompare(b.text)) as TreeData[];
        })
      );
  }

  public hasChildren(node: TreeData): boolean {
    return !node.compositeId.startsWith(this.tags[this.tags.length - 1]);
  }

  public onSelectionChange(event: TreeItem) {
    this.selectedTags = this.getParentChain(event.dataItem.compositeId);
  }

  private getParentChain(
    compositeId: string
  ): { tag: FileExplorerTagKey; id: number }[] {
    const parts = compositeId.split('_');
    const chain: { tag: FileExplorerTagKey; id: number }[] = [];
    for (let i = 0; i < this.tags.length; i++) {
      if (i === 0) {
        if (parts[0] === this.tags[0]) {
          chain.push({ tag: this.tags[0], id: Number(parts[1]) });
        }
      } else {
        if (parts[0] === this.tags[i]) {
          for (let j = 0; j <= i; j++) {
            chain.push({ tag: this.tags[j], id: Number(parts[1]) });
          }
          break;
        }
      }
    }
    return chain;
  }

  private getFilter() {
    return this.selectedTags.reduce((acc, tag) => {
      acc[tag.tag] = tag.id;
      return acc;
    }, {} as Record<FileExplorerTagKey, number>);
  }
}
