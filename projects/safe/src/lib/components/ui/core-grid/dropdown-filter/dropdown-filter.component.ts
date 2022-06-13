import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseFilterCellComponent,
  FilterService,
} from '@progress/kendo-angular-grid';

/**
 * Safe-dropdown-filter component
 */
@Component({
  selector: 'safe-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss'],
})
export class SafeDropdownFilterComponent
  extends BaseFilterCellComponent
  implements OnInit
{
  /**
   * Returns the selected value
   */
  public get selectedValue(): any {
    const filter = this.filterByField(this.field);
    return filter ? filter.value : null;
  }

  @Input() public field = '';
  @Input() public filter: any;
  @Input() public data: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';

  /**
   * Returns the default item
   */
  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  public choices: any[] = [];
  public op: any[] = [
    {
      text: this.translate.instant('kendo.grid.filterEqOperator'),
      value: 'eq',
    },
    {
      text: this.translate.instant('kendo.grid.filterNotEqOperator'),
      value: 'neq',
    },
  ];
  public selectedOperator = 'eq';

  /**
   * Contructor for safe-dropdown-filter
   *
   * @param filterService
   * @param translate
   */
  constructor(
    filterService: FilterService,
    public translate: TranslateService
  ) {
    super(filterService);
  }

  ngOnInit(): void {
    this.choices = this.data.slice();
    console.log(this.choices, this.operators);
  }

  /**
   * Updates the filter on item selection
   *
   * @param value
   */
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

  /**
   * Updates de operation used in filtering
   *
   * @param value
   */
  public onChangeOperator(value: any): void {
    this.selectedOperator = value.value;
    if (this.selectedValue) {
      this.onChange(this.selectedValue);
    }
  }

  /**
   * Clears any set filters
   */
  public onClear() {
    this.selectedOperator = 'eq';
    this.filter = {
      filters: [],
      logic: 'and',
    };
    this.applyFilter(this.filter);
  }

  /**
   * Handles filtering
   *
   * @param value
   */
  public handleFilter(value: string): void {
    this.choices = this.data.filter(
      (x) => x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
