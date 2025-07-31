import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Filter component of applications page.
 */
@Component({
  selector: 'app-applications-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  /** Loading indicator */
  @Input() loading = false;
  /** Filter update event */
  @Output() filter = new EventEmitter<any>();
  /** Filter form group */
  public form = this.fb.group({
    startDate: [null],
    endDate: [null],
    status: [''],
  });
  /** Should expand filter */
  public expanded = false;
  /** Reference to expanded filter template */
  @ViewChild('expandedFilter')
  expandedFilter!: TemplateRef<any>;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Filter component of applications page.
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
