import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';

/**
 * Composite filter group.
 */
@Component({
  selector: 'shared-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnChanges {
  /** Filter reactive form group */
  @Input() form!: FormGroup;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Delete filter event emitter */
  @Output() delete = new EventEmitter();
  /** Reference to parent filter group, if any */
  @Input() parent: FilterGroupComponent | null = null;
  /** Can use context variables */
  @Input() canUseContext = false;
  /** Email Notification Check */
  @Input() isEmailNotification = false;
  /** Disable fields */
  @Input() isDisable = false;

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
      inTheLast: this.fb.group({
        number: [1],
        unit: ['days'],
      }),
    });
    this.filters.push(filter);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isDisable'] &&
      changes['isDisable'].previousValue !== changes['isDisable'].currentValue
    ) {
      if (this.isDisable) {
        this.form?.get('logic')?.disable();
      } else {
        this.form?.get('logic')?.enable();
      }
    }
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
