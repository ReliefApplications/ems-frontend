import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { FilterService } from '@progress/kendo-angular-grid';

@Component({
  selector: 'safe-dropdown-filter-menu',
  templateUrl: './dropdown-filter-menu.component.html',
  styleUrls: ['./dropdown-filter-menu.component.scss'],
})
export class SafeDropdownFilterMenuComponent implements OnInit {
  @Input() public field = '';
  @Input() public filter: any;
  @Input() public data: any[] = [];
  public choices1: any[] = [];
  public choices2: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';
  @Input() public filterService?: FilterService;
  public form?: FormGroup;

  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  public get filters(): FormArray {
    return this.form?.get('filters') as FormArray;
  }

  public logics = [
    {
      text: 'Or',
      value: 'or',
    },
    {
      text: 'And',
      value: 'and',
    },
  ];

  public operators = [
    {
      text: 'Is equal to',
      value: 'eq',
    },
    {
      text: 'Is not equal to',
      value: 'neq',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.choices1 = this.data.slice();
    this.choices2 = this.data.slice();
    this.form = this.fb.group({
      logic: this.filter.logic,
      filters: this.fb.array([
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[0]
            ? this.filter.filters[0].operator
            : 'eq',
          value: this.fb.control(
            this.filter.filters[0] ? this.filter.filters[0].value : ''
          ),
        }),
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[1]
            ? this.filter.filters[1].operator
            : 'eq',
          value: this.fb.control(
            this.filter.filters[1] ? this.filter.filters[1].value : ''
          ),
        }),
      ]),
    });
    this.form.valueChanges.subscribe((value) => {
      this.filterService?.filter(value);
    });
  }

  public handleFilter(value: string, index: number): void {
    if (index === 1) {
      this.choices1 = this.data.filter(
        (x) =>
          x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.choices2 = this.data.filter(
        (x) =>
          x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
  }
}
