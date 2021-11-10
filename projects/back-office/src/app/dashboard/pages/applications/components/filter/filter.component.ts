import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public form!: FormGroup;
  public show = false;
  @Output() filter = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      search: [''],
      startDate: [null],
      endDate: [null],
      status: ['']
    });
    this.form.valueChanges.subscribe((res) => {
      const filters: any[] = [];
      if (res.search) {
        filters.push({ field: 'name', operator: 'contains', value: res.search });
      }
      if (res.status) {
        filters.push({ field: 'status', operator: 'eq', value: res.status });
      }
      if (res.startDate) {
        filters.push({ field: 'createdAt', operator: 'gte', value: res.startDate });
      }
      if (res.endDate) {
        filters.push({ field: 'createdAt', operator: 'lte', value: res.startDate });
      }
      const filter = {
        logic: 'and',
        filters
      };
      this.filter.emit(filter);
    });
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
    this.form.setValue({ ...this.form.value, startDate: null, endDate: null });
  }
}
