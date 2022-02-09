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
  public choices: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';

  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

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
            operator: 'contains',
            value,
          })
    );
  }

  public handleFilter(value: string): void {
    this.choices = this.data.filter(
      (x) => x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
