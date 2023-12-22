import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';

/**
 * Filter used by the roles component
 */
@Component({
  selector: 'app-roles-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent extends UnsubscribeComponent implements OnInit {
  /** Loading state */
  @Input() loading = false;
  /** Event emitter for filter */
  @Output() filter = new EventEmitter<any>();

  /** Form */
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
    this.filter.emit(value);
  }
}
