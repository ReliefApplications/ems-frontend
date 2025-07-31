import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  TemplateRef,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFilterComponent } from '@oort-front/shared';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Filter used by the resources component
 */
@Component({
  selector: 'app-api-configuration-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListFilterComponent,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    TranslateModule,
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  /** Loading state */
  @Input() loading = false;
  /** Roles list */
  @Output() filter = new EventEmitter<any>();
  /** Reference to expanded filter template */
  @ViewChild('expandedFilter')
  expandedFilter!: TemplateRef<any>;

  /** Form */
  public form = this.fb.group({
    status: [''],
  });
  /** Show expanded filter */
  public show = false;
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
      .subscribe((value) => {
        this.emitFilter(value);
      });
  }

  /**
   * Emits the filter value, so the main component can get it.
   *
   * @param value Value to be emitted.
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
