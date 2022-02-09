import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from '@progress/kendo-angular-grid';

@Component({
  selector: 'safe-array-filter-menu',
  templateUrl: './array-filter-menu.component.html',
  styleUrls: ['./array-filter-menu.component.scss'],
})
export class SafeArrayFilterMenuComponent implements OnInit {
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
    {
      text: 'Contains',
      value: 'contains',
    },
    {
      text: 'Does not contain',
      value: 'doesnotcontain',
    },
    {
      text: 'Is empty',
      value: 'isempty',
    },
    {
      text: 'Is not empty',
      value: 'isnotempty',
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
            : 'contains',
          value: this.fb.control(
            this.filter.filters[0] ? this.filter.filters[0].value : []
          ),
        }),
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[1]
            ? this.filter.filters[1].operator
            : 'contains',
          value: this.fb.control(
            this.filter.filters[1] ? this.filter.filters[1].value : []
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
