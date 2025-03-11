import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UnsubscribeComponent } from '@oort-front/shared';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

/**
 * Triggers filter component.
 */
@Component({
  selector: 'app-triggers-filter',
  templateUrl: './triggers-filter.component.html',
  styleUrls: ['./triggers-filter.component.scss'],
})
export class TriggersFilterComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Event emitter for filter */
  @Output() filter = new EventEmitter<any>();
  /** Loading status */
  @Input() loading = false;
  /** Form */
  public form = this.fb.group({
    startDate: [null],
    endDate: [null],
  });
  /** Show flag */
  public show = false;

  /**
   * Triggers filter component.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.emitFilter(value);
      });
  }

  /**
   * Emits the filter value, so the main component can get it.
   *
   * @param value filter value
   */
  private emitFilter(value: any): void {
    const filters: any[] = [];
    if (value.search) {
      filters.push({
        field: 'name',
        operator: 'contains',
        value: value.search,
      });
    }
    if (value.startDate) {
      filters.push({
        field: 'createdAt',
        operator: 'gte',
        value: value.startDate,
      });
    }
    if (value.endDate) {
      filters.push({
        field: 'createdAt',
        operator: 'lte',
        value: value.endDate,
      });
    }
    const filter = {
      logic: 'and',
      filters,
    };
    this.filter.emit(filter);
  }

  /**
   * Clears form.
   */
  clear(): void {
    this.form.reset();
  }

  /**
   * Clears date range.
   */
  clearDateFilter(): void {
    this.form.setValue({
      ...this.form.getRawValue(),
      startDate: null,
      endDate: null,
    });
  }
}
