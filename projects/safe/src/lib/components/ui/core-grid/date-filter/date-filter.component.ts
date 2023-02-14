import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { FIELD_TYPES, FILTER_OPERATORS } from '../../../filter/filter.const';

/**
 * Date Filter Component allows to use expressions or to select a date.
 */
@Component({
  selector: 'safe-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class SafeDateFilterComponent implements OnInit {
  @Input() public field = '';
  @Input() public filter: any;
  @Input() public valueField = '';
  @Input() public filterService?: FilterService;

  public form?: UntypedFormGroup;
  public firstDateMode = 'expression';
  public secondDateMode = 'date';

  public operatorsList: any[] = [];
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

  /** @returns The filters */
  public get filters(): UntypedFormArray {
    return this.form?.get('filters') as UntypedFormArray;
  }

  /**
   * Constructor for date filter component
   *
   * @param formBuilder This is the service used to build forms.
   * @param translate The translation service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public translate: TranslateService
  ) {
    const type = FIELD_TYPES.find((x) => x.editor === 'datetime');
    this.operatorsList = FILTER_OPERATORS.filter((x) =>
      type?.operators?.includes(x.value)
    );
    this.operatorsList.forEach((o) => {
      o.text = this.translate.instant(o.label);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      logic: this.filter.logic,
      filters: this.formBuilder.array([
        this.formBuilder.group({
          field: this.field,
          operator: this.filter.filters[0]
            ? this.filter.filters[0].operator
            : 'eq',
          value: this.formBuilder.control(
            this.filter.filters[0] ? this.filter.filters[0].value : ''
          ),
        }),
        this.formBuilder.group({
          field: this.field,
          operator: this.filter.filters[1]
            ? this.filter.filters[1].operator
            : 'eq',
          value: this.formBuilder.control(
            this.filter.filters[1] ? this.filter.filters[1].value : ''
          ),
        }),
      ]),
    });

    this.translate.onLangChange.subscribe(() => {
      this.logics = [
        {
          text: this.translate.instant('kendo.grid.filterEqOperator'),
          value: 'eq',
        },
        {
          text: this.translate.instant('kendo.grid.filterNotEqOperator'),
          value: 'neq',
        },
      ];
      this.operatorsList.forEach((o) => {
        o.text = this.translate.instant(o.text);
      });
    });

    this.form.valueChanges.subscribe((value) => {
      this.filterService?.filter(value);
    });
  }
}
