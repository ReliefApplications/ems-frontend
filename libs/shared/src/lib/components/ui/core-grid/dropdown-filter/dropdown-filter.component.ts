import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseFilterCellComponent,
  FilterService,
} from '@progress/kendo-angular-grid';

/**
 * -dropdown-filter component
 */
@Component({
  selector: 'shared-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss'],
})
export class DropdownFilterComponent
  extends BaseFilterCellComponent
  implements OnInit
{
  /** @returns The selected value */
  public get selectedValue(): any {
    const filter = this.filterByField(this.field);
    return filter ? filter.value : null;
  }

  @Input() public field = '';
  @Input() public override filter: any;
  @Input() public data: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';

  /** @returns The default item */
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
   * Contructor for shared-dropdown-filter
   *
   * @param filterService The filter service
   * @param translate The translation service
   */
  constructor(
    filterService: FilterService,
    public translate: TranslateService
  ) {
    super(filterService);
  }

  ngOnInit(): void {
    this.choices = this.data.slice();
    this.translate.onLangChange.subscribe(() => {
      this.op = [
        {
          text: this.translate.instant('kendo.grid.filterEqOperator'),
          value: 'eq',
        },
        {
          text: this.translate.instant('kendo.grid.filterNotEqOperator'),
          value: 'neq',
        },
      ];
    });
  }

  /**
   * Updates the filter on item selection
   *
   * @param value The new value
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
   * @param value The new value
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
      filters: this.filter.filters.filter(
        (filter: any) => filter.field !== this.field
      ),
      logic: 'and',
    };
    this.applyFilter(this.filter);
  }

  /**
   * Handles filtering
   *
   * @param value The new value
   */
  public handleFilter(value: string): void {
    this.choices = this.data.filter(
      (x) => x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
