import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ListFilterComponent, UnsubscribeComponent } from '@oort-front/shared';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

/**
 * Filter used by the reference data component
 */
@Component({
  selector: 'app-reference-data-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ListFilterComponent],
  template: `
    <form [formGroup]="form">
      <shared-list-filter
        [hasSiblingFilters]="false"
        [loading]="loading"
      ></shared-list-filter>
    </form>
  `,
})
export class FilterComponent extends UnsubscribeComponent implements OnInit {
  /**
   * Loading state
   */
  @Input() loading = false;
  /**
   * Event emitter to emit the filter value
   */
  @Output() filter = new EventEmitter<any>();

  /**
   * Form group
   */
  public form = this.fb.group({});

  /**
   * FilterComponent constructor.
   *
   * @param fb Used to create reactive forms.
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
      .subscribe((value: any) => {
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
    if (value?.search) {
      filters.push({
        field: 'name',
        operator: 'contains',
        value: value.search,
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
}
