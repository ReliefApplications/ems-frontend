import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Role } from 'libs/safe/src/lib/models/user.model';

/**
 * Filter component of users page.
 */
@Component({
  selector: 'safe-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  public form!: UntypedFormGroup;
  public search = new UntypedFormControl('');
  public show = false;

  @Output() filter = new EventEmitter<any>();
  @Input() loading = false;
  @Input() roles: Role[] = [];

  /**
   * Filter component of applications page.
   *
   * @param formBuilder Angular form builder
   */
  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [''],
      role: [''],
    });
    this.form.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.emitFilter(value);
      });
    // this way we can wait for 0.2s before sending an update
    this.search.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.form.controls.name.setValue(value);
      });
  }

  /**
   * Emits the filter value, so the main component can get it.
   *
   * @param value filter value
   */
  private emitFilter(value: any): void {
    const filters: any[] = [];
    if (value.name) {
      filters.push({ field: 'name', operator: 'contains', value: value.name });
    }
    if (value.role) {
      filters.push({ field: 'roles', operator: 'eq', value: value.role });
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
    this.search.reset();
  }
}
