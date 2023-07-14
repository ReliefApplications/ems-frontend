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
  selector: 'safe-sort-group',
  templateUrl: './sort-group.component.html',
  styleUrls: ['./sort-group.component.scss'],
})
export class SortGroupComponent {
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];
  @Input() showLimit = false;

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
      first: null,
    });
    this.sortFields.push(sortField);
  }
}
