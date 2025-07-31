import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ListFilterComponent } from '@oort-front/shared';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
export class FilterComponent implements OnInit {
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
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * FilterComponent constructor.
   *
   * @param fb Used to create reactive forms.
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
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
