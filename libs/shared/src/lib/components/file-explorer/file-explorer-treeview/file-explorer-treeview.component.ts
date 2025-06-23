import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileExplorerTagKey,
  FileExplorerTagSelection,
} from '../types/file-explorer-filter.type';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { TreeItem, TreeViewModule } from '@progress/kendo-angular-treeview';
import { map, tap } from 'rxjs';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';
import { some } from 'lodash';

/**
 * Structure of data used in the tree view.
 */
interface TreeData {
  id: number | string;
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
  private selectedTags: { tag: FileExplorerTagKey; id: number | string }[] = [];
  /** Shared document management service */
  private documentManagementService = inject(DocumentManagementService);
  /** Parent component */
  private parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );

  ngOnInit() {
    console.log(this.tags);
    if (this.tags.length > 0) {
      this.getTagValues();
    }
  }

  /**
   * Fetches the initial tag values and populates the tree view data.
   * This method is called during component initialization.
   */
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
      });
  }

  /**
   * Fetches the children of a given node in the tree view.
   * This method is called when a node is expanded.
   *
   * @param node The node for which to fetch children.
   * @returns An observable that emits the children of the node.
   */
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
        }),
        tap((items) => {
          node.items = items;
        })
      );
  }

  /**
   * Checks if a given node has children in the tree view.
   * Returns true, if node corresponds to a tag that is not the last one in the tags array.
   *
   * @param node The node to check for children.
   * @returns A boolean indicating whether the node has children.
   */
  public hasChildren(node: TreeData): boolean {
    return !node.compositeId.startsWith(this.tags[this.tags.length - 1]);
  }

  /**
   * Handles the selection change event in the tree view.
   *
   * @param event Event triggered when the selection changes in the tree view.
   */
  public onSelectionChange(event: TreeItem) {
    this.selectedTags = this.getParentChain(event.dataItem.compositeId);
    if (this.parent) {
      this.parent.onSelectionChange(this.getFilter());
    }
  }

  /**
   * Retrieves the parent chain of a node in the tree view based on its composite ID.
   *
   * @param compositeId Composite ID of the node to find its parent chain.
   * @returns An array of objects representing the parent chain, each containing a tag and an ID.
   */
  private getParentChain(
    compositeId: string
  ): { tag: FileExplorerTagKey; id: number | string }[] {
    const path: { tag: FileExplorerTagKey; id: number | string }[] = [];

    /**
     * Recursive function to find the path to a node with the given composite ID.
     * It traverses the tree structure and builds the path as it goes.
     *
     * @param nodes The current level of nodes in the tree.
     * @param targetId The composite ID of the target node.
     * @param currentPath The current path being built.
     * @returns A boolean indicating whether the target node was found.
     */
    function findPath(
      nodes: TreeData[],
      targetId: string,
      currentPath: { tag: FileExplorerTagKey; id: number | string }[]
    ): boolean {
      return some(nodes, (node) => {
        const newPath = [...currentPath, { tag: node.type, id: node.id }];
        if (node.compositeId === targetId) {
          path.push(...newPath);
          return true;
        }
        if (node.items && findPath(node.items, targetId, newPath)) {
          return true;
        }
        return false;
      });
    }

    findPath(this.data, compositeId, []);
    return path;
  }

  /**
   * Generates a filter object based on the selected tags.
   *
   * @returns An object representing the filter for the file explorer.
   */
  private getFilter(): FileExplorerTagSelection {
    return this.selectedTags.reduce((acc, tag) => {
      acc[tag.tag] = tag.id;
      return acc;
    }, {} as any);
  }
}
