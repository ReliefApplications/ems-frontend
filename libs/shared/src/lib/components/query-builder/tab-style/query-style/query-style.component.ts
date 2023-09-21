import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Field,
  QueryBuilderService,
} from '../../../../services/query-builder/query-builder.service';
import { flattenDeep } from 'lodash';

/**
 * Query style component.
 * Used by Grid Layout Settings.
 */
@Component({
  selector: 'shared-query-style',
  templateUrl: './query-style.component.html',
  styleUrls: ['./query-style.component.scss'],
})
/**
 * QueryStyleComponent is a component that allows the user to customize the style of a query.
 */
export class QueryStyleComponent implements OnInit {
  /** The query object to be styled. */
  @Input() query: any;

  /** The form group used to manage the form controls. */
  @Input() form!: UntypedFormGroup;

  /** The form control used to manage the whole row toggle. */
  public wholeRow!: UntypedFormControl;

  /** The list of filter fields available for the query. */
  public filterFields: Field[] = [];

  public checkedKeys: any[] = [];

  public fieldNodes: any[] = [];

  /** Event emitter for closing the edition of the query style. */
  @Output() closeEdition = new EventEmitter<any>();

  /**
   * Constructor for the query style component.
   *
   * @param queryBuilder - The service used to build the query.
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.fieldNodes = this.setFieldNodes();

    const fields = this.form.get('fields')?.value || [];

    if (fields.length > 0) {
      this.wholeRow = new UntypedFormControl(false);
      /** Update checked keys from nodes & selected fields */
      const flatNodes = this.flatNodes();
      const selectedFields = this.form.get('fields')?.value || [];
      const checkedKeys = [];
      for (const field of selectedFields) {
        const node = flatNodes.find((node) => node.path === field);
        if (node) {
          checkedKeys.push(node.id);
        }
      }
      this.checkedKeys = checkedKeys;
    } else {
      this.wholeRow = new UntypedFormControl(true);
    }
    this.wholeRow.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('fields')?.setValue([]);
      }
    });

    this.queryBuilder.getFilterFields(this.query).then((f) => {
      this.filterFields = f;
    });
  }

  /**
   * Set field nodes from query definition
   *
   * @returns list of field nodes ( used by tree view )
   */
  private setFieldNodes() {
    const getNode = (field: any, index: number, parent?: any) => {
      const id = parent ? `${parent.id}_${index}` : `${index}`;
      const path = parent ? `${parent.name}.${field.name}` : field.name;
      return {
        id,
        name: field.name,
        ...(field.fields && {
          fields: field.fields.map((subField: any, index: number) =>
            getNode(subField, index, { id, name: field.name })
          ),
        }),
        path,
      };
    };

    const nodes = (this.query.fields || []).map((field: any, index: number) =>
      getNode(field, index)
    );
    return nodes;
  }

  /**
   * Toggles boolean controls.
   *
   * @param controlName - The name of the form control.
   */
  onToggle(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(!control.value);
    }
  }

  /**
   * Handle checking from tree view, updating the form group value
   */
  handleChecking(): void {
    const flatNodes = this.flatNodes();
    const selectedFields = [];
    for (const key of this.checkedKeys) {
      const node = flatNodes.find((node) => key === node.id);
      if (node) {
        if (node.fields) {
          for (const subNode of node.fields) {
            selectedFields.push(subNode.path);
          }
        } else {
          selectedFields.push(node.path);
        }
      }
    }
    this.form.get('fields')?.setValue(selectedFields);
  }

  /**
   * Create a flat array from the nodes
   * Each node lists its children nodes ( if any )
   *
   * @returns flat array of nodes
   */
  flatNodes() {
    const flatNode = (node: any) => {
      if (node.fields) {
        return flattenDeep([
          {
            ...node,
            fields: flattenDeep(
              node.fields.map((subNode: any) => flatNode(subNode))
            ),
          },
          node.fields.map((subNode: any) => flatNode(subNode)),
        ]);
      } else {
        return [node];
      }
    };
    return flattenDeep(this.fieldNodes.map((node) => flatNode(node)));
  }
}
