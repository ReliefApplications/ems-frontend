import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Composite filter group.
 */
@Component({
  selector: 'safe-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() fields: any[] = [];
  @Output() delete = new EventEmitter();

  /**
   * Getter for the filters
   *
   * @returns The filters in an array
   */
  get filters(): FormArray {
    return this.form.get('filters') as FormArray;
  }

  /**
   * Composite filter group.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

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
    console.log(this.filters);
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
