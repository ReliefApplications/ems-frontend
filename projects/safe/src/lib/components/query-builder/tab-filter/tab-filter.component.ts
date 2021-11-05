import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SafeApiProxyService } from '../../../services/api-proxy.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

const OPERATORS: any = {
  eq: {
    value: 'eq',
    label: 'Is equal to'
  },
  neq: {
    value: 'neq',
    label: 'Is not equal to'
  },
  gte: {
    value: 'gte',
    label: 'Is greater than or equal to'
  },
  gt: {
    value: 'gt',
    label: 'Is greater than'
  },
  lte: {
    value: 'lte',
    label: 'Is less than or equal to'
  },
  lt: {
    value: 'lt',
    label: 'Is less than'
  },
  isnull: {
    value: 'isnull',
    label: 'Is null'
  },
  isnotnull: {
    value: 'isnotnull',
    label: 'Is not null'
  },
  isempty: {
    value: 'isempty',
    label: 'Is empty'
  },
  isnotempty: {
    value: 'isnotempty',
    label: 'Is not empty'
  },
  contains: {
    value: 'contains',
    label: 'Contains'
  },
  doesnotcontain: {
    value: 'doesnotcontain',
    label: 'Does not contain'
  },
  startswith: {
    value: 'startswith',
    label: 'Starts with'
  },
  endswith: {
    value: 'endswith',
    label: 'Ends with'
  }
};

const TYPES: any = {
  Int: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull']
  },
  String: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'contains', 'doesnotcontain', 'startswith', 'endswith', 'isnull', 'isnotnull', 'isempty', 'isnotempty']
  },
  Boolean: {
    defaultOperator: 'eq',
    operators: ['eq']
  },
  Date: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull']
  },
  DateTime: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull']
  },
  Time: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull']
  },
  JSON: {
    defaultOperator: 'contains',
    operators: ['eq', 'neq', 'contains', 'doesnotcontain', 'isempty', 'isnotempty']
  }
};

const AVAILABLE_TYPES = ['Int', 'String', 'Boolean', 'Date', 'DateTime', 'Time', 'JSON'];

@Component({
  selector: 'safe-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss']
})
export class SafeTabFilterComponent implements OnInit {

  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() settings: any;
  @Input() canDelete = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  public selectedFields: any[] = [];

  public types: any = TYPES;
  private metaQuery: any;
  public metaFields: any;

  public operators: any = OPERATORS;

  get filters(): FormArray {
    return this.form.get('filters') as FormArray;
  }

  private inputs = '';

  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService,
    private apiProxyService: SafeApiProxyService,
    ) { }

  async ngOnInit(): Promise<void> {
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings, false);
    if (this.metaQuery) {
      await this.metaQuery.subscribe(async (res: any) => {
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            this.metaFields = Object.assign({}, res.data[field]);
            await this.populateMetaFields();
          }
        }
      });
    }
    this.form.value?.filters.forEach((x: any, index: number) => {
      if (x.field) {
        const field = this.fields.find(y => y.name === x.field);
        if (field && field.type && AVAILABLE_TYPES.includes(field.type.name)) {
          const type = field.type.name;
          this.selectedFields.splice(index, 1, {
            name: field.name,
            type
          });
        } else {
          this.selectedFields.splice(index, 1, {});
        }
      } else {
        this.selectedFields.splice(index, 1, {});
      }
    });
  }

  /**
   * Fetch choices from URL if needed
   */
   private async populateMetaFields(): Promise<void> {
    for (const fieldName of  Object.keys(this.metaFields)) {
      const meta = this.metaFields[fieldName];
      if (meta.choicesByUrl) {
        const url: string = meta.choicesByUrl.url;
        const localRes = localStorage.getItem(url);
        if (localRes) {
          this.metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(JSON.parse(localRes), meta.choicesByUrl)
          };
        } else {
          const res: any = await this.apiProxyService.promisedRequestWithHeaders(url);
          localStorage.setItem(url, JSON.stringify(res));
          this.metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(res, meta.choicesByUrl)
          };
        }
      }
    }
  }

  /**
   * Extracts choices using choicesByUrl properties
   * @param res Result of http request.
   * @param choicesByUrl Choices By Url property.
   * @returns list of choices.
   */
   private extractChoices(res: any, choicesByUrl: { path?: string, value?: string, text?: string}): {value: string, text: string}[] {
    const choices = choicesByUrl.path ? [...res[choicesByUrl.path]] : [...res];
    return choices ? choices.map((x: any) => ({
      value: (choicesByUrl.value ? x[choicesByUrl.value] : x).toString(),
      text: choicesByUrl.text ? x[choicesByUrl.text] : choicesByUrl.value ? x[choicesByUrl.value] : x
    })) : [];
  }

  setCurrentDate(filterName: string): void {
    this.form.controls[filterName].setValue('today()');
  }

  onKey(e: any, filterName: string): void {
    if (e.target.value === '') { this.inputs = ''; }
    if (e.keyCode === 8) {
      this.inputs = this.inputs.slice(0, this.inputs.length - 1);
    }
    if (this.inputs.length <= 9) {
      if (RegExp('^[0-9]*$').test(e.key)) {
        if (this.inputs.length === 3 || this.inputs.length === 6) {
          this.inputs += e.key + '/';
          e.target.value += '/';
        } else {
          this.inputs += e.key;
        }
      } else if (e.key === '/') {
        e.stopPropagation();
        this.inputs = this.inputs.slice(0, this.inputs.length - 1);
      } else {
        e.stopPropagation();
        e.target.value = e.target.value.replace(/[^0-9\/]/g, '');
      }
    } else {
      e.stopPropagation();
      e.target.value = this.inputs;
    }
    if (this.inputs.length > 9 && !RegExp('\\d{4}\\/(0?[1-9]|1[012])\\/(0?[1-9]|[12][0-9]|3[01])*').test(this.inputs)) {
      this.form.controls[filterName].setErrors({incorrect: true});
    }
  }

  onAddFilter(): void {
    const filter = this.formBuilder.group({
      field: '',
      operator: 'eq',
      value: null
    });
    this.filters.push(filter);
    this.selectedFields.push({});
  }

  onSetField(e: any, index: number): void {
    if (e.value) {
      const field = this.fields.find(x => x.name === e.value);
      if (field && field.type && AVAILABLE_TYPES.includes(field.type.name)) {
        const type = field.type.name;
        const operator = TYPES[type].defaultOperator;
        this.filters.at(index).get('operator')?.setValue(operator);
        this.filters.at(index).get('value')?.setValue(null);
        this.selectedFields.splice(index, 1, {
          name: field.name,
          type
        });
      } else {
        this.selectedFields.splice(index, 1, {});
      }
    } else {
      this.selectedFields.splice(index, 1, {});
    }
  }

  onDeleteFilter(index: number): void {
    this.filters.removeAt(index);
    this.selectedFields.splice(index, 1);
  }

  onDeleteFilterGroup(index: number): void {
    this.filters.removeAt(index);
    this.selectedFields.splice(index, 1);
  }

  onAddFilterGroup(): void {
    const filter = this.formBuilder.group({
      logic: 'and',
      filters: this.formBuilder.array([])
    });
    this.filters.push(filter);
    this.selectedFields.push({});
  }
}
