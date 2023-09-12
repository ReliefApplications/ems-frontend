import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '@progress/kendo-angular-grid';

/** Component for dropdown filter menu */
@Component({
  selector: 'safe-dropdown-filter-menu',
  templateUrl: './dropdown-filter-menu.component.html',
  styleUrls: ['./dropdown-filter-menu.component.scss'],
})
export class SafeDropdownFilterMenuComponent implements OnInit {
  @Input() public field = '';
  @Input() public filter: any;
  @Input() public data: any[] = [];
  public choices1: any[] = [];
  public choices2: any[] = [];
  @Input() public textField = '';
  @Input() public valueField = '';
  @Input() public filterService?: FilterService;
  public form!: ReturnType<typeof this.createFormGroup>;

  /** @returns The default item */
  public get defaultItem(): any {
    return {
      [this.textField]: 'Select item...',
      [this.valueField]: null,
    };
  }

  /** @returns The filters */
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
  ];

  /**
   * Constructor of the component
   *
   * @param fb The form builder
   * @param translate The translation service
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
      logic: this.fb.nonNullable.control<string>(this.filter.logic),
      filters: this.fb.array([
        this.fb.group({
          field: this.field,
          operator: this.fb.nonNullable.control<string>(
            this.filter.filters[0] ? this.filter.filters[0].operator : 'eq'
          ),
          value: this.fb.control(
            this.filter.filters[0] ? this.filter.filters[0].value : ''
          ),
        }),
        this.fb.group({
          field: this.field,
          operator: this.fb.nonNullable.control<string>(
            this.filter.filters[1] ? this.filter.filters[1].operator : 'eq'
          ),
          value: this.fb.control(
            this.filter.filters[1] ? this.filter.filters[1].value : ''
          ),
        }),
      ]),
    });
  }

  /**
   * Handle the filters
   *
   * @param value The new value
   * @param index The index
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
