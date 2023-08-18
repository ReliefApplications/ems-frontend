import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

/**
 * Node for tree item
 */
export class TreeItemNode {
  children: TreeItemNode[] = [];
  item = '';
  path = '';
}

/** Flat tree item node with expandable and level information */
export class TreeItemFlatNode {
  item = '';
  level = 0;
  expandable = false;
  path = '';
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TreeItemNode[]>([]);

  /**
   * Getter for the value of the data
   *
   * @returns the value of the data (a node of a tree item)
   */
  get data(): TreeItemNode[] {
    return this.dataChange.value;
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param data Json object
   */
  constructor(data: any) {
    this.initialize(data);
  }

  /**
   * Builds the tree nodes from Json object.
   * The result is a list of `TodoItemNode` with nestedfile node as children. And notify the change.
   *
   * @param data Json object
   */
  initialize(data: any) {
    this.dataChange.next(this.buildFileTree(data, 0));
  }

  /**
   * Generate checkbox tree
   *
   * @param obj object to build tree from
   * @param level deep level
   * @param prefix prefix of tree level
   * @returns list of tree item nodes
   */
  buildFileTree(
    obj: { [key: string]: any },
    level: number,
    prefix?: string
  ): TreeItemNode[] {
    return Object.keys(obj).reduce<TreeItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeItemNode();
      node.item = key;
      node.path = prefix ? `${prefix}.${key}` : key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1, node.path);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  // insertItem(parent: TreeItemNode, name: string) {
  //   if (parent.children) {
  //     parent.children.push({ item: name } as TreeItemNode);
  //     this.dataChange.next(this.data);
  //   }
  // }

  // updateItem(node: TreeItemNode, name: string) {
  //   node.item = name;
  //   this.dataChange.next(this.data);
  // }
}

/**
 * Checkbox tree component.
 */
@Component({
  selector: 'safe-checkbox-tree',
  templateUrl: './checkbox-tree.component.html',
  styleUrls: ['./checkbox-tree.component.scss'],
})
export class SafeCheckboxTreeComponent implements OnInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TreeItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TreeItemFlatNode>;

  treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TreeItemFlatNode>(
    true /** multiple */
  );

  @Input() checklist!: ChecklistDatabase;
  @Input() value: string[] = [];

  @Output() valueChange = new EventEmitter<TreeItemFlatNode[]>();

  /**
   * Checkbox tree component.
   */
  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TreeItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  ngOnInit(): void {
    this.checklist.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
    const values: TreeItemFlatNode[] = this.treeControl.dataNodes.filter((x) =>
      this.value.includes(x.path)
    );
    this.checklistSelection.select(...values);
  }

  getLevel = (node: TreeItemFlatNode) => node.level;

  isExpandable = (node: TreeItemFlatNode) => node.expandable;

  getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TreeItemFlatNode) =>
    _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   *
   * @param node Node to flatten
   * @param level Level of nesting
   * @returns The flattened node
   */
  transformer = (node: TreeItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TreeItemFlatNode();
    flatNode.item = node.item;
    flatNode.path = node.path;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /**
   * Whether all the descendants of the node are selected.
   *
   * @param node The node whose descendants needs to be checked
   * @returns true if all the descendants of the node are selected, false otherwise
   */
  descendantsAllSelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));
    return descAllSelected;
  }

  /**
   * Whether part of the descendants are selected
   *
   * @param node The node whose descendants needs to be checked
   * @returns true if some descendants of the node are selected, false otherwise
   */
  descendantsPartiallySelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /**
   * Toggle the tree item selection. Select/deselect all the descendants node
   *
   * @param node The node whose descendants needs to be selected/deselected
   */
  todoItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /**
   * Toggle a leaf to-do item selection. Check all the parents to see if they changed
   *
   * @param node The leaf to-do item selected, whose parents need to be checked
   */
  todoLeafItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.valueChange.emit(this.checklistSelection.selected);
  }

  /**
   * Checks all the parents when a leaf node is selected/unselected
   *
   * @param node The node whose parents we are checking
   */
  checkAllParentsSelection(node: TreeItemFlatNode): void {
    let parent: TreeItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /**
   * Check root node checked state and change it accordingly
   *
   * @param node The root node
   */
  checkRootNodeSelection(node: TreeItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /**
   * Get the parent node of a node
   *
   * @param node The node from which we get the parents
   * @returns the parent node if it exists, otherwise null
   */
  getParentNode(node: TreeItemFlatNode): TreeItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  // addNewItem(node: TodoItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   if (parentNode) {
  //     // eslint-disable-next-line no-underscore-dangle
  //     this._database.insertItem(parentNode, '');
  //     this.treeControl.expand(node);
  //   }
  // }

  /** Save the node to database */
  // saveNode(node: TreeItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   if (nestedNode) {
  //     // eslint-disable-next-line no-underscore-dangle
  //     this._database.updateItem(nestedNode, itemValue);
  //   }
  // }
}
