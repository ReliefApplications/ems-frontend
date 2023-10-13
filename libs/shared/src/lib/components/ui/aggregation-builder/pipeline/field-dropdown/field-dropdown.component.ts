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

/** Separator used between field names */
const NESTED_FIELD_NAME_SEPARATOR = '.' as const;

/**
 * Fields dropdown component.
 */
@Component({
  selector: 'shared-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class FieldDropdownComponent implements AfterViewInit, OnChanges {
  @Input() fieldControl!: UntypedFormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() nullable = false;

  @ViewChildren('field') fieldComponents!: QueryList<any>;
  @ViewChild('menu') selectMenu!: any;
  private currentValueUnnested = false;
  public expansionTree: ExpansionTree = {};

  /** Separator for nested field names */
  public separator = NESTED_FIELD_NAME_SEPARATOR;

  ngAfterViewInit(): void {
    this.selectMenu.forceOptionList(this.fieldComponents);
    if (
      !this.fieldControl.value ||
      !this.fieldControl.value.includes(this.separator)
    ) {
      this.currentValueUnnested = true; //unnesting needs to be done only if there is a value to be unnested at first
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fields?.currentValue != changes.fields?.previousValue) {
      this.expansionTree = {};
      this.buildExpansionTree(this.fields, this.expansionTree);
      this.unnestCurrentValue(); //we unnest as soon as our fields are loaded
    }
    if (changes.fieldControl?.currentValue.value) {
      this.currentValueUnnested = !this.fieldControl.value.includes(
        this.separator
      ); //forces the new field to be unnested
      if (this.fields) {
        this.unnestCurrentValue();
      }
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
        expansionTreeInstance[field.name] = {
          expanded: fields.length === 1 ? true : false,
        }; //if it is the only field, we unnest it automatically
        this.buildExpansionTree(
          field.fields,
          expansionTreeInstance[field.name] as ExpansionTree
        );
      }
    }
  }

  /** Unnests the value that is displayed inside of the select menu */
  unnestCurrentValue() {
    if (!this.currentValueUnnested) {
      const array: string[] = this.fieldControl.value.split(this.separator);
      for (let i = 1; i < array.length; i++) {
        this.currentValueUnnested = this.toggleNodeExpansion(
          array.slice(0, i).join(this.separator),
          true
        );
      }
    }
  }

  /**
   * expands target node
   *
   * @param path path to be expanded
   * @param expand force a state for the expansion
   * @returns whether the operation was a success
   */
  toggleNodeExpansion(path: string, expand?: boolean): boolean {
    const pathSegments = path.split('.');
    let node = this.expansionTree;

    if (!node) {
      return false;
    }

    for (const segment of pathSegments) {
      node = node[segment] as ExpansionTree;
    }
    node.expanded = expand ?? !node.expanded;
    return true;
  }
}
