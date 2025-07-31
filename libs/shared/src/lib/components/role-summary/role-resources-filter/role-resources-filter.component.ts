import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Role filter component
 */
@Component({
  selector: 'shared-role-resources-filter',
  templateUrl: './role-resources-filter.component.html',
  styleUrls: ['./role-resources-filter.component.scss'],
})
export class FilterComponent implements OnInit {
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
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Role filter component
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
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
