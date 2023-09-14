import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '@progress/kendo-angular-grid';

/**
 * Array Filter menu, used by grid, when filtering by multi choices question.
 */
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
  public form!: ReturnType<typeof this.createFormGroup>;

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

  public logics = [
    {
      text: this.translate.instant('kendo.grid.filterOrLogic'),
      value: 'or',
    },
    {
      text: this.translate.instant('kendo.grid.filterAndLogic'),
      value: 'and',
    },
  ];

  public operators = [
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

  /**
   * Array Filter menu, used by grid, when filtering by multi choices question.
   *
   * @param fb Angular form builder
   * @param translate Angular translate service
   */
  constructor(private fb: FormBuilder, private translate: TranslateService) {}

  ngOnInit(): void {
    this.choices1 = (this.data || []).slice();
    this.choices2 = (this.data || []).slice();
    this.form = this.createFormGroup();
    this.form.valueChanges.subscribe((value) => {
      this.filterService?.filter(value as any);
    });
  }

  /**
   * Create form group
   *
   * @returns form group
   */
  private createFormGroup() {
    return this.fb.group({
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
