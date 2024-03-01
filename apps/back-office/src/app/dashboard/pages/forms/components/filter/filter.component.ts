import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UnsubscribeComponent } from '@oort-front/shared';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * Filter component of Forms page.
 */
@Component({
  selector: 'app-forms-filter',
  templateUrl: './filter.component.html',
})
export class FilterComponent extends UnsubscribeComponent implements OnInit {
  /** Input decorator for Loading state */
  @Input() loading = false;
  /** Output decorator for Event emitter to emit the filter value */
  @Output() filter = new EventEmitter<any>();
  /** Reference to expanded filter template */
  @ViewChild('expandedFilter')
  expandedFilter!: TemplateRef<any>;

  /** Form group */
  public form = this.fb.group({
    startDate: [null],
    endDate: [null],
    status: [''],
    core: [null],
  });
  /** Show filter */
  public show = false;

  /**
   * Filter component of forms page
   *
   * @param fb Shared form builder service.
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
   * Emit the filter value, so the main component can get it.
   *
   * @param value new filter value
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
    if (value.status) {
      filters.push({ field: 'status', operator: 'eq', value: value.status });
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
    if (value.core != null) {
      if (value.core) {
        filters.push({ field: 'core', operator: 'eq', value: true });
      } else {
        filters.push({ field: 'core', operator: 'neq', value: true });
      }
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
