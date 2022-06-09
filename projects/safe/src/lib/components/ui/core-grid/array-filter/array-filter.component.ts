import { Component, Input, OnInit } from '@angular/core';
import {
  BaseFilterCellComponent,
  FilterService,
} from '@progress/kendo-angular-grid';

@Component({
  selector: 'safe-array-filter',
  templateUrl: './array-filter.component.html',
  styleUrls: ['./array-filter.component.scss'],
})
export class SafeArrayFilterComponent
  extends BaseFilterCellComponent
  implements OnInit
{
  public get selectedValue(): any {
    const filter = this.filterByField(this.field);
    return filter ? filter.value : null;
  }

  @Input() public field = '';
  @Input() public filter: any;
  @Input() public data: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';

  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  public choices: any[] = [];
  public op: any[] = [
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
  public selectedOperator = "contains";

  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit(): void {
    this.choices = this.data.slice();
  }

  public onChange(value: any): void {
    this.applyFilter(
      value === null
        ? this.removeFilter(this.valueField)
        : this.updateFilter({
            field: this.field,
            operator: this.selectedOperator,
            value,
          })
    );
  }

  public onChangeOperator(value: any): void {
    this.selectedOperator = value.value;
    if (this.selectedValue) {
      this.onChange(this.selectedValue);
    }
  }

  public handleFilter(value: string): void {
    this.choices = this.data.filter(
      (x) => x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  /** Clears any set filters */
  public onClear() {
    this.selectedOperator = 'contains';
    this.filter = {
      filters: [],
      logic: 'and',
    };
    this.applyFilter(this.filter);
  }
}
