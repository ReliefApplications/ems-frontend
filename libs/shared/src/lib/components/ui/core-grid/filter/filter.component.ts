import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseFilterCellComponent,
  FilterService,
} from '@progress/kendo-angular-grid';
import { isEmpty, isNil } from 'lodash';
import { Subject, takeUntil } from 'rxjs';

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
  implements OnInit, OnDestroy
{
  /** @returns selected value */
  public get selectedValue(): any {
    const filter = this.filterByField(this.field);
    return filter ? filter.value : null;
  }

  /** Field */
  @Input() public field = '';
  /** Filter */
  @Input() public override filter: any;
  /** Data */
  @Input() public data: any[] = [];
  /** Text field */
  @Input() public textField = '';
  /** Value field */
  @Input() public valueField = '';
  /** Is not array */
  @Input() isNotArray = false;

  /** @returns empty default item */
  public get defaultItem(): any {
    return {
      // todo: translate
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  /** Choices */
  public choices: any[] = [];
  /** Operators */
  public op: any[] = [];

  /** Operators translations */
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

  /** Main operators */
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

  /** Array operators */
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

  /** Selected operator */
  public selectedOperator!: string;
  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();

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
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
