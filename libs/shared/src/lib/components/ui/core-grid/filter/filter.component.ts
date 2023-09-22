import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseFilterCellComponent,
  FilterService,
} from '@progress/kendo-angular-grid';
import { isEmpty, isNil } from 'lodash';

/**
 * Shared-grid-filter component
 */
@Component({
  selector: 'shared-grid-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class GridFilterComponent
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
  @Input() isNotArray = false;

  /** @returns empty default item */
  public get defaultItem(): any {
    return {
      // todo: translate
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  public choices: any[] = [];
  public op: any[] = [];

  private operatorsTranslations: { [key: string]: any } = {
    eq: () => this.translate.instant('kendo.grid.filterEqOperator'),
    neq: () => this.translate.instant('kendo.grid.filterNotEqOperator'),
    contains: () => this.translate.instant('kendo.grid.filterContainsOperator'),
    doesnotcontain: () =>
      this.translate.instant('kendo.grid.filterNotContainsOperator'),
    isempty: () => this.translate.instant('kendo.grid.filterIsEmptyOperator'),
    isnotempty: () =>
      this.translate.instant('kendo.grid.filterIsNotEmptyOperator'),
  } as const;

  mainOperators: any[] = [
    {
      text: '',
      value: 'eq',
    },
    {
      text: '',
      value: 'neq',
    },
  ];

  arrayOperators = [
    {
      text: '',
      value: 'contains',
    },
    {
      text: '',
      value: 'doesnotcontain',
    },
    {
      text: '',
      value: 'isempty',
    },
    {
      text: '',
      value: 'isnotempty',
    },
  ] as const;

  public selectedOperator!: string;

  /**
   * Constructor for shared-grid-filter
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
    this.selectedOperator = this.isNotArray ? 'eq' : 'contains';
    this.setOperators();
    this.choices = (this.data || []).slice();
    this.translate.onLangChange.subscribe(() => {
      this.setOperators();
    });
  }

  /**
   * Set current operators given the filter type and updates the text translations for each of them
   */
  private setOperators() {
    if (!this.isNotArray) {
      this.op = [...this.mainOperators, ...this.arrayOperators];
    } else {
      this.op = [...this.mainOperators];
    }
    this.op.forEach((operator) => {
      operator.text = this.operatorsTranslations[operator.value]();
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
    this.selectedOperator = this.isNotArray ? 'eq' : 'contains';
    this.filter = {
      filters: this.filter.filters.filter(
        (filter: any) => filter.field !== this.field
      ),
      logic: 'and',
    };
    this.applyFilter(this.filter);
  }
}
