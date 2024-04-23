import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';

/**
 * Composite sort group.
 */
@Component({
  selector: 'shared-sort-group',
  templateUrl: './sort-group.component.html',
  styleUrls: ['./sort-group.component.scss'],
})
export class SortGroupComponent {
  /** Sort form group */
  @Input() form!: UntypedFormGroup;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Show limit control, to limit the number of items to query */
  @Input() showLimit = false;

  /** Delete event */
  @Output() delete = new EventEmitter();

  /**
   * Getter for the sort fields
   *
   * @returns The sort fields in an array
   */
  get sortFields(): UntypedFormArray {
    return this.form.get('sort') as UntypedFormArray;
  }

  /**
   * Composite filter group.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: UntypedFormBuilder) {}

  /**
   * Remove sortField at index
   *
   * @param index sortField index
   */
  deleteSortField(index: number): void {
    this.sortFields.removeAt(index);
  }

  /**
   * Add new sortField row
   */
  addSortField(): void {
    const sortField = this.fb.group({
      field: '',
      order: 'asc',
    });
    this.sortFields.push(sortField);
  }
}
