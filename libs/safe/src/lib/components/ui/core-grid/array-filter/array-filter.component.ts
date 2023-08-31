import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseFilterCellComponent,
  FilterService,
} from '@progress/kendo-angular-grid';
import { isEmpty, isNil } from 'lodash';

/**
 * Safe-array-filter component
 */
@Component({
  selector: 'safe-array-filter',
  templateUrl: './array-filter.component.html',
  styleUrls: ['./array-filter.component.scss'],
})
export class SafeArrayFilterComponent
  extends BaseFilterCellComponent
  implements OnInit
{
  /** @returns selected value */
  public get selectedValue(): any {
    const filter = this.filterByField(this.field);
    return filter ? filter.value : null;
  }

  @Input() public field = '';
  @Input() public override filter: any;
  @Input() public data: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';

  /** @returns empty default item */
  public get defaultItem(): any {
    return {
      // todo: translate
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
    {
      text: this.translate.instant('kendo.grid.filterContainsOperator'),
      value: 'contains',
    },
    {
      text: this.translate.instant('kendo.grid.filterNotContainsOperator'),
      value: 'doesnotcontain',
    },
    {
      text: this.translate.instant('kendo.grid.filterIsEmptyOperator'),
      value: 'isempty',
    },
    {
      text: this.translate.instant('kendo.grid.filterIsNotEmptyOperator'),
      value: 'isnotempty',
    },
  ];
  public selectedOperator = 'contains';

  /**
   * Contructor for safe-array-filter
   *
   * @param filterService Filter service
   * @param translate Angular translate service
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
        {
          text: this.translate.instant('kendo.grid.filterContainsOperator'),
          value: 'contains',
        },
        {
          text: this.translate.instant('kendo.grid.filterNotContainsOperator'),
          value: 'doesnotcontain',
        },
        {
          text: this.translate.instant('kendo.grid.filterIsEmptyOperator'),
          value: 'isempty',
        },
        {
          text: this.translate.instant('kendo.grid.filterIsNotEmptyOperator'),
          value: 'isnotempty',
        },
      ];
    });
  }

  /**
   * Update the filter on item selection.
   * Remove filter if no option selected.
   *
   * @param value new filter value
   */
  public onChange(value: any): void {
    this.applyFilter(
      isNil(value) || isEmpty(value)
        ? this.removeFilter(this.field)
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
   * @param value new operator value
   */
  public onChangeOperator(value: any): void {
    this.selectedOperator = value.value;
    if (this.selectedValue) {
      this.onChange(this.selectedValue);
    }
  }

  /**
   * Handles filtering
   *
   * @param value new filter value
   */
  public handleFilter(value: string): void {
    this.choices = this.data.filter(
      (x) => x[this.textField].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  /**
   * Clears any set filters
   */
  public onClear() {
    this.selectedOperator = 'contains';
    this.filter = {
      filters: this.filter.filters.filter(
        (filter: any) => filter.field !== this.field
      ),
      logic: 'and',
    };
    this.applyFilter(this.filter);
  }
}
