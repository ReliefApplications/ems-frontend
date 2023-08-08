import {
  AfterViewInit,
  Component,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/** Tree to handle expansion of menus */
interface ExpansionTree {
  expanded?: boolean;
  [key: string]: ExpansionTree | boolean | undefined;
}

/**
 * Fields dropdown component.
 */
@Component({
  selector: 'safe-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class SafeFieldDropdownComponent implements AfterViewInit {
  @Input() fieldControl!: UntypedFormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() nullable = false;
  @ViewChildren('field') fieldComponents!: QueryList<any>;
  @ViewChild('menu') selectMenu!: any;
  public expansionTree: ExpansionTree = {};

  /**
   * Builds the expansion tree recursively
   *
   * @param fields fields to add to the tree
   * @param expansionTreeInstance expansion tree node to be furnished
   */
  buildExpansionTree(fields: any[], expansionTreeInstance: ExpansionTree) {
    if (!fields) {
      return;
    }
    for (const field of fields) {
      if (field.type.kind === 'LIST' || field.type.kind === 'OBJECT') {
        expansionTreeInstance[field.name] = { expanded: false };
        this.buildExpansionTree(
          field.fields,
          expansionTreeInstance[field.name] as ExpansionTree
        );
      }
    }
  }

  ngAfterViewInit(): void {
    this.selectMenu.forceOptionList(this.fieldComponents);
    this.buildExpansionTree(this.fields, this.expansionTree);
  }

  /**
   * expands target node
   *
   * @param path path to be expanded
   */
  toggleNodeExpansion(path: string): void {
    const pathSegments = path.split('.');
    let node = this.expansionTree;

    if (!node) {
      return;
    }

    for (const segment of pathSegments) {
      node = node[segment] as ExpansionTree;
    }
    node.expanded = !node.expanded;
  }
}
