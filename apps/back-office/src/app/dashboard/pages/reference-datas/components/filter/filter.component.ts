import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Filter component of Reference Data page
 */
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  public form!: FormGroup;
  public search = new FormControl('');

  @Output() filter = new EventEmitter<any>();
  @Input() loading = false;

  /**
   * FilterComponent constructor
   *
   * @param fb Used to create reactive forms
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
    });
    this.search.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.form.controls.name.setValue(value);
      });
    this.form.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
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
    if (value.name) {
      filters.push({ field: 'name', operator: 'contains', value: value.name });
    }
    const filter = {
      logic: 'and',
      filters,
    };
    this.filter.emit(filter);
  }
}
