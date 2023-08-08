import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
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
export class SafeFieldDropdownComponent implements AfterViewInit, OnChanges {
  @Input() fieldControl!: UntypedFormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() nullable = false;
  @ViewChildren('field') fieldComponents!: QueryList<any>;
  @ViewChild('menu') selectMenu!: any;
  private currentValueUnnested = false;
  public expansionTree: ExpansionTree = {};

  ngAfterViewInit(): void {
    this.selectMenu.forceOptionList(this.fieldComponents);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fields.currentValue != changes.fields.previousValue) {
      this.expansionTree = {};
      this.buildExpansionTree(this.fields, this.expansionTree);
      this.unnestCurrentValue();
    }
  }

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

  /** Unnests the value that is displayed inside of the select menu */
  unnestCurrentValue() {
    if (!this.fieldControl.value || !this.fieldControl.value.includes('.')) {
      this.currentValueUnnested = true;
    }
    if (!this.currentValueUnnested) {
      const array: string[] = this.fieldControl.value.split('.');
      for (let i = 1; i < array.length; i++) {
        this.toggleNodeExpansion(array.slice(0, i).join('.'));
      }
      this.currentValueUnnested = this.toggleNodeExpansion(array.join('.'));
    }
  }

  /**
   * expands target node
   *
   * @param path path to be expanded
   * @returns whether the operation was a success
   */
  toggleNodeExpansion(path: string): boolean {
    const pathSegments = path.split('.');
    let node = this.expansionTree;

    if (!node) {
      return false;
    }

    for (const segment of pathSegments) {
      console.log(node, segment);
      node = node[segment] as ExpansionTree;
    }
    node.expanded = !node.expanded;
    return true;
  }
}
