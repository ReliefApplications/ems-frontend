import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Field,
  QueryBuilderService,
} from '../../../../services/query-builder/query-builder.service';
import { ListBoxToolbarConfig } from '@progress/kendo-angular-listbox';
// import {
//   ChecklistDatabase,
//   TreeItemFlatNode,
// } from '../../../checkbox-tree/checkbox-tree.component';

/**
 * Query style component.
 * Used by Grid Layout Settings.
 */
@Component({
  selector: 'shared-query-style',
  templateUrl: './query-style.component.html',
  styleUrls: ['./query-style.component.scss'],
})
export class QueryStyleComponent implements OnInit {
  @Input() query: any;
  @Input() form!: UntypedFormGroup;
  public wholeRow!: UntypedFormControl;

  public filterFields: Field[] = [];

  public availableFields: string[] = [];
  public selectedFields: string[] = [];
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: ['transferFrom', 'transferTo', 'transferAllFrom', 'transferAllTo'],
  };

  @Output() closeEdition = new EventEmitter<any>();

  // checklist!: ChecklistDatabase;

  /**
   * Constructor for the query style component
   *
   * @param queryBuilder This is the service that will be used to build the query.
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  ngOnInit(): void {
    // this.checklist = new ChecklistDatabase(
    //   this.getChecklist(this.query.fields)
    // );
    const fields = this.form.get('fields')?.value || [];
    if (fields.length > 0) {
      this.wholeRow = new UntypedFormControl(false);
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
    this.selectedFields = [...fields];
    //available fields are all fields that are not selected
    this.availableFields = [
      ...this.query.fields
        .map((x: any) => x.name)
        .filter((x: any) => !this.selectedFields.includes(x)),
    ];
  }

  /**
   * Builds the checklist from list of fields.
   *
   * @param fields List of fields
   * @returns Checklist database as object.
   */
  private getChecklist(fields: any[]): any {
    return fields.reduce((o, field) => {
      if (field.fields) {
        return { ...o, [field.name]: this.getChecklist(field.fields) };
      } else {
        return { ...o, [field.name]: null };
      }
    }, {});
  }

  /**
   * Toggles boolean controls.
   *
   * @param controlName name of form control.
   */
  onToggle(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(!control.value);
    }
  }

  /**
   * Updates fields value.
   *
   * @param items list of selected tree items.
   */
  // onChange(items: TreeItemFlatNode[]) {
  //   this.form.get('fields')?.setValue(items.map((x) => x.path));
  // }
}
