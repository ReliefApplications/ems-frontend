import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';

/**
 * Composite filter group.
 */
@Component({
  selector: 'shared-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent {
  /** Filter reactive form group */
  @Input() form!: FormGroup;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Delete filter event emitter */
  @Output() delete = new EventEmitter();
  /** Reference to parent filter group, if any */
  @Input() parent: FilterGroupComponent | null = null;

  /**
   * Getter for the filters
   *
   * @returns The filters in an array
   */
  get filters(): UntypedFormArray {
    return this.form.get('filters') as UntypedFormArray;
  }

  /**
   * Composite filter group.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  /**
   * Remove filter at index
   *
   * @param index filter index
   */
  deleteFilter(index: number): void {
    this.filters.removeAt(index);
  }

  /**
   * Add new filter row
   */
  addFilter(): void {
    const filter = this.fb.group({
      field: '',
      operator: 'eq',
      value: null,
    });
    this.filters.push(filter);
  }

  /**
   * Add new filter group
   */
  addGroup(): void {
    const filter = this.fb.group({
      logic: 'and',
      filters: this.fb.array([]),
    });
    this.filters.push(filter);
  }
}
