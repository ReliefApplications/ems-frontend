import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileExplorerTagKey,
  FileExplorerTagSelection,
} from '../types/file-explorer-filter.type';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { TreeItem, TreeViewModule } from '@progress/kendo-angular-treeview';
import { map, tap } from 'rxjs';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';

/**
 * Structure of data used in the tree view.
 */
interface TreeData {
  id: number | string;
  compositeId: string;
  type: FileExplorerTagKey;
  text: string;
  items?: TreeData[];
  path: string[];
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
export class FileExplorerTreeviewComponent implements OnInit, OnChanges {
  /** List of tags to generate folders */
  @Input() tags: FileExplorerTagKey[] = [];
  /** Selected tags */
  @Input() selectedTags: {
    tag: FileExplorerTagKey;
    id: number | string;
    text: string;
  }[] = [];
  /** Treeview data */
  public data: TreeData[] = [];
  /** Selected keys in the tree view */
  public selectedKeys: any[] = [];
  /** Expanded keys in the tree view */
  public expandedKeys: string[] = [];
  /** Shared document management service */
  private documentManagementService = inject(DocumentManagementService);
  /** Parent component */
  private parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );

  ngOnInit() {
    if (this.tags.length > 0) {
      this.getTagValues();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log(this.selectedTags);
    if (changes.selectedTags) {
      const path = changes.selectedTags.currentValue.map(
        (tag: any) => `${tag.tag}_${tag.id}`
      );
      console.log(path);
      this.expandToNode(path);
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
            path: [`${this.tags[0]}_${item.id}`],
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
        filter: this.getFilter(nextTag),
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
              path: [...node.path, `${nextTag}_${item.id}`],
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
    return node.path.length < this.tags.length;
  }

  /**
   * Handles the selection change event in the tree view.
   *
   * @param event Event triggered when the selection changes in the tree view.
   */
  public onSelectionChange(event: TreeItem) {
    const path = event.dataItem.path;
    this.expandToNode(path);
    this.selectedTags = this.getParentChain(path);
    if (this.parent) {
      this.parent.onSelectionChange(this.selectedTags);
    }
  }

  /**
   * Retrieves the parent chain of a node in the tree view based on its composite ID.
   *
   * @param path List of composite ids
   * @returns An array of objects representing the parent chain, each containing a tag and an ID.
   */
  private getParentChain(
    path: string[]
  ): { tag: FileExplorerTagKey; id: number | string; text: string }[] {
    const chain: {
      tag: FileExplorerTagKey;
      id: number | string;
      text: string;
    }[] = [];
    let node: TreeData | undefined = undefined;
    let items = this.data;
    path.forEach((key) => {
      node = items.find((x) => x.compositeId === key);
      if (node) {
        chain.push({ tag: node.type, id: node?.id, text: node?.text });
        items = node.items || [];
      }
    });
    return chain;
  }

  /**
   * Generates a filter object based on the selected tags.
   *
   * @param excludeTag Exclude tag from filter
   * @returns An object representing the filter for the file explorer.
   */
  private getFilter(excludeTag?: FileExplorerTagKey): FileExplorerTagSelection {
    return this.selectedTags.reduce((acc, tag) => {
      if (tag.tag !== excludeTag) {
        acc[tag.tag] = tag.id;
      }
      return acc;
    }, {} as any);
  }

  /**
   * On Expand, set selected & expanded keys
   *
   * @param event Expand event
   */
  public onExpand(event: TreeItem) {
    const path = event.dataItem.path;
    // Collapse all other branches except ancestors and this node
    this.expandToNode(path);
    this.selectedTags = this.getParentChain(path);
    if (this.parent) {
      this.parent.onSelectionChange(this.selectedTags);
    }
  }

  /**
   * Expand to node:
   * - set selected keys
   * - set expanded keys
   *
   * @param path List of composite ids
   */
  private expandToNode(path: string[]) {
    // Set expandedKeys to only the path (ancestors + this node)
    this.expandedKeys = path;
    this.selectedKeys = path;
  }
}
