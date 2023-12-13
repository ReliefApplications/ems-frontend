import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/public-api';

/**
 * Grid filter menu, used by grid when filtering by multi choices question or by dropdown filter menu
 */
@Component({
  selector: 'shared-grid-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class GridFilterMenuComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Field */
  @Input() public field = '';
  /** Filter */
  @Input() public filter: any;
  /** Data */
  @Input() public data: any[] = [];
  /** Text field */
  @Input() public textField = '';
  /** Value field */
  @Input() public valueField = '';
  /** Filter service */
  @Input() public filterService?: FilterService;
  /** Is not array */
  @Input() isNotArray = false;

  /** Choices 1 */
  public choices1: any[] = [];
  /** Choices 2 */
  public choices2: any[] = [];
  /** Form */
  public form?: UntypedFormGroup;

  /** Default value */
  private defaultValue!: string | Array<any>;
  /** Default operator */
  private defaultOperator!: string;

  /** @returns default item choice */
  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  /** @returns filters as form Array. */
  public get filters(): UntypedFormArray {
    return this.form?.get('filters') as UntypedFormArray;
  }

  /** Logics */
  public logics = [
    {
      text: this.translate.instant('kendo.grid.filterOrLogic'),
      value: 'or',
    },
    {
      text: this.translate.instant('kendo.grid.filterAndLogic'),
      value: 'and',
    },
  ] as const;

  /** Operators */
  public operators = [
    {
      text: this.translate.instant('kendo.grid.filterEqOperator'),
      value: 'eq',
    },
    {
      text: this.translate.instant('kendo.grid.filterNotEqOperator'),
      value: 'neq',
    },
  ];

  /** Array operators */
  arrayOperators = [
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
  ] as const;

  /**
   * Filter grid menu, used by grid, when filtering by multi choices question or by dropdown filter menu
   *
   * @param fb Angular form builder
   * @param translate Angular translate service
   */
  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.defaultValue = this.isNotArray ? '' : [];
    this.defaultOperator = this.isNotArray ? 'eq' : 'contains';
    if (!this.isNotArray) {
      this.operators = [...this.operators, ...this.arrayOperators];
    }
    this.choices1 = (this.data || []).slice();
    this.choices2 = (this.data || []).slice();
    this.form = this.fb.group({
      logic: this.filter.logic,
      filters: this.fb.array([
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[0]
            ? this.filter.filters[0].operator
            : this.defaultOperator,
          value: this.fb.control(
            this.filter.filters[0]
              ? this.filter.filters[0].value
              : this.defaultValue
          ),
        }),
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[1]
            ? this.filter.filters[1].operator
            : this.defaultOperator,
          value: this.fb.control(
            this.filter.filters[1]
              ? this.filter.filters[1].value
              : this.defaultValue
          ),
        }),
      ]),
    });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.filterService?.filter(value);
    });
  }

  /**
   * Handle filter update
   *
   * @param value new filter value
   * @param index index of filter to update
   */
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
