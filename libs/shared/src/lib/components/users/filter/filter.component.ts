import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Role } from '../../../models/user.model';

/**
 * Filter used by the resources component
 */
@Component({
  selector: 'app-users-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent extends UnsubscribeComponent implements OnInit {
  @Input() loading = false;
  @Input() roles: Role[] = [];
  @Output() filter = new EventEmitter<any>();
  /** Reference to expanded filter template */
  @ViewChild('expandedFilter')
  expandedFilter!: TemplateRef<any>;

  public form = this.fb.group({
    roleFilter: [null],
  });
  public show = false;

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
    this.filter.emit(value);
  }

  /**
   * Clears form.
   */
  clear(): void {
    this.form.reset();
  }
}
