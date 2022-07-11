import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { clone, get, isDate } from 'lodash';
import { SafeApiProxyService } from '../../../services/api-proxy.service';
import { SafeGridService } from '../../../services/grid.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

/**
 * Defines the operators available for filtering
 */
const OPERATORS: any = {
  eq: {
    value: 'eq',
    label: 'Is equal to',
  },
  neq: {
    value: 'neq',
    label: 'Is not equal to',
  },
  gte: {
    value: 'gte',
    label: 'Is greater than or equal to',
  },
  gt: {
    value: 'gt',
    label: 'Is greater than',
  },
  lte: {
    value: 'lte',
    label: 'Is less than or equal to',
  },
  lt: {
    value: 'lt',
    label: 'Is less than',
  },
  isnull: {
    value: 'isnull',
    label: 'Is null',
  },
  isnotnull: {
    value: 'isnotnull',
    label: 'Is not null',
  },
  isempty: {
    value: 'isempty',
    label: 'Is empty',
  },
  isnotempty: {
    value: 'isnotempty',
    label: 'Is not empty',
  },
  contains: {
    value: 'contains',
    label: 'Contains',
  },
  doesnotcontain: {
    value: 'doesnotcontain',
    label: 'Does not contain',
  },
  startswith: {
    value: 'startswith',
    label: 'Starts with',
  },
  endswith: {
    value: 'endswith',
    label: 'Ends with',
  },
};
/**
 * Defines the operators allowed for each type
 */
const TYPES: any = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Int: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Float: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  // eslint-disable-next-line id-blacklist, @typescript-eslint/naming-convention
  String: {
    defaultOperator: 'eq',
    operators: [
      'eq',
      'neq',
      'contains',
      'doesnotcontain',
      'startswith',
      'endswith',
      'isnull',
      'isnotnull',
      'isempty',
      'isnotempty',
    ],
  },
  // eslint-disable-next-line id-blacklist, @typescript-eslint/naming-convention
  ID: {
    defaultOperator: 'contains',
    operators: ['eq', 'neq', 'contains', 'doesnotcontain', 'startswith'],
  },
  // eslint-disable-next-line id-blacklist, @typescript-eslint/naming-convention
  Form: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq'],
  },
  // eslint-disable-next-line id-blacklist, @typescript-eslint/naming-convention
  Boolean: {
    defaultOperator: 'eq',
    operators: ['eq'],
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Date: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DateTime: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Time: {
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JSON: {
    defaultOperator: 'contains',
    operators: [
      'eq',
      'neq',
      'contains',
      'doesnotcontain',
      'isempty',
      'isnotempty',
    ],
  },
};

/**
 * Defines the data types available
 */
const AVAILABLE_TYPES = [
  'Int',
  'Float',
  'String',
  'Boolean',
  'Date',
  'DateTime',
  'Time',
  'JSON',
  'ID',
  'Form',
];

/**
 * Component for displaying the filtering options
 */
@Component({
  selector: 'safe-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss'],
})
export class SafeTabFilterComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() query: any;
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  public selectedFields: any[] = [];

  public types: any = TYPES;
  private metaQuery: any;

  public operators: any = OPERATORS;

  /**
   * Getter for the filters
   *
   * @returns The filters in an array
   */
  get filters(): FormArray {
    return this.form.get('filters') as FormArray;
  }

  private inputs = '';

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param formBuilder This is the service that will be used to build forms.
   * @param queryBuilder This is the service that will be used to build the query.
   * @param apiProxyService This is the service that will be used to make the API call.
   * @param gridService Shared grid service
   */
  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService,
    private apiProxyService: SafeApiProxyService,
    private gridService: SafeGridService
  ) {}

  ngOnInit(): void {
    // TODO: move somewhere else
    if (this.query) {
      // Get MetaData from all scalar fields of the datasource
      const queryWithAllScalarField = clone(this.query);
      queryWithAllScalarField.fields = this.fields;
      this.metaQuery = this.queryBuilder.buildMetaQuery(
        queryWithAllScalarField
      );
      if (this.metaQuery) {
        this.metaQuery.subscribe(async (res: any) => {
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.metaFields = Object.assign({}, res.data[field]);
              await this.gridService.populateMetaFields(this.metaFields);
            }
          }
        });
      }
    } else {
      this.gridService.populateMetaFields(this.metaFields);
    }
    this.form.value?.filters.forEach((x: any, index: number) => {
      let field = this.fields.find((y) => y.name === x?.field?.split('.')[0]);
      if (field) {
        let name = field.name;
        if (field.type.kind === 'OBJECT') {
          field = field.type.fields.find(
            (y: any) => y.name === x.field.split('.')[1]
          );
          name += `.${field.name}`;
        }
        if (field && field.type && AVAILABLE_TYPES.includes(field.type.name)) {
          const type = field.name === 'form' ? 'Form' : field.type.name;
          this.selectedFields.splice(index, 1, {
            name,
            type,
          });
          if (['Date', 'DateTime'].includes(type)) {
            const valueAsDate = new Date(x.value);
            if (isDate(valueAsDate) && isNaN(valueAsDate.getTime())) {
              const formGroup = this.filters.at(index) as FormGroup;
              formGroup.get('useExpression')?.setValue(true);
            }
          }
        } else {
          this.selectedFields.splice(index, 1, {});
        }
      } else {
        this.selectedFields.splice(index, 1, {});
      }
    });
  }

  getMeta(name: string): any {
    return get(this.metaFields, name, null);
  }

  /**
   * Set the current date to today
   *
   * @param filterName Name of the filter to set the date to
   */
  setCurrentDate(filterName: string): void {
    this.form.controls[filterName].setValue('today()');
  }

  /**
   * Change editor for a field.
   * It is possible, for date questions, to use text editor instead of date selection.
   *
   * @param index index of filter field
   */
  onChangeEditor(index: number): void {
    const formGroup = this.filters.at(index) as FormGroup;
    formGroup
      .get('useExpression')
      ?.setValue(!formGroup.get('useExpression')?.value);
    formGroup.get('value')?.setValue(null);
  }

  /**
   * Handles the onKey event
   *
   * @param e Event to handle
   * @param filterName Name of the filter where the user typed
   */
  onKey(e: any, filterName: string): void {
    if (e.target.value === '') {
      this.inputs = '';
    }
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
    if (
      this.inputs.length > 9 &&
      !RegExp('\\d{4}\\/(0?[1-9]|1[012])\\/(0?[1-9]|[12][0-9]|3[01])*').test(
        this.inputs
      )
    ) {
      this.form.controls[filterName].setErrors({ incorrect: true });
    }
  }

  /**
   * Adds a filter
   */
  onAddFilter(): void {
    const filter = this.formBuilder.group({
      field: '',
      operator: 'eq',
      value: null,
      useExpression: false,
    });
    this.filters.push(filter);
    this.selectedFields.push({});
  }

  /**
   * Handles the setting of a field
   *
   * @param e The event to handle
   * @param index The index of the field to set
   */
  onSetField(e: any, index: number): void {
    if (e.value) {
      let field = this.fields.find((x) => x.name === e.value.split('.')[0]);
      let name = field.name;
      if (field.type.kind === 'OBJECT') {
        field = field.type.fields.find(
          (x: any) => x.name === e.value.split('.')[1]
        );
        name += `.${field.name}`;
      }
      if (field && field.type && AVAILABLE_TYPES.includes(field.type.name)) {
        const type = field.name === 'form' ? 'Form' : field.type.name;
        const operator = TYPES[type].defaultOperator;
        this.filters.at(index).get('operator')?.setValue(operator);
        this.filters.at(index).get('value')?.setValue(null);
        this.selectedFields.splice(index, 1, {
          name,
          type,
        });
      } else {
        this.selectedFields.splice(index, 1, {});
      }
    } else {
      this.selectedFields.splice(index, 1, {});
    }
  }

  /**
   * Deletes a filter
   *
   * @param index The index of the filter to delete
   */
  onDeleteFilter(index: number): void {
    this.filters.removeAt(index);
    this.selectedFields.splice(index, 1);
  }

  /**
   * Deletes a filter group
   *
   * @param index The index of the filter group to delete
   */
  onDeleteFilterGroup(index: number): void {
    this.filters.removeAt(index);
    this.selectedFields.splice(index, 1);
  }

  /**
   * Adds a filter group
   */
  onAddFilterGroup(): void {
    const filter = this.formBuilder.group({
      logic: 'and',
      filters: this.formBuilder.array([]),
    });
    this.filters.push(filter);
    this.selectedFields.push({});
  }
}
