import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { QueryBuilderService } from 'libs/shared/src/lib/services/query-builder/query-builder.service';
import { cloneDeep } from 'lodash';
import { FilterModule } from '../../../../filter/filter.module';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { Observable, takeUntil } from 'rxjs';
import { FILTER_OPERATORS } from '../../../../filter/filter.const';

/**
 *
 */
const formBuilder = new FormBuilder();
/**
 *
 */
@Component({
  selector: 'shared-filter-builder',
  standalone: true,
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss'],
  imports: [FilterModule],
})
export class FilterBuilderComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() form!: FormGroup;
  @Input() canExpand = true;
  @Input() queryName? = '';
  public query: any;
  public formUntyped: UntypedFormGroup = new UntypedFormGroup({});
  public filterFields: any[] = [];
  public availableFields: any[] = [];
  public filteredQueries: any[] = [];
  public allQueries: any[] = [];
  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;
  // === FIELD EDITION ===
  public isField = false;
  // === QUERY BUILDER ===
  public availableQueries?: Observable<any[]>;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();

  /**
   * Getter for the available scalar fields
   *
   * @returns the available scalar fields
   */
  get availableScalarFields(): any[] {
    return this.availableFields.filter(
      (x) => x.type.kind === 'SCALAR' || x.type.kind === 'OBJECT'
    );
    // return this.availableFields.filter((x) => x.type.kind === 'SCALAR');
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder This is the service that will be used to build the query.
   * @param fb This is the Angular FormBuilder service.
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildSettings();
    this.query = this.form.getRawValue();
    this.queryBuilder.getFilterFields(this.query).then((fields) => {
      const cloneFields = cloneDeep(fields);
      this.setCustomEditors(cloneFields);
      this.filterFields = cloneFields;
    });
    this.formUntyped = this.form.controls.filter as UntypedFormGroup;
    console.log(
      this.form,
      this.form,
      this.query,
      'estou aqui dentro filterbuilder'
    );
  }

  /**
   * Set custom editors for some fields.
   *
   * @param fields list of fields.
   */
  private setCustomEditors(fields: any[]): void {
    for (const field of fields) {
      if (field.fields) {
        this.setCustomEditors(field.fields);
      } else {
        switch (field.editor) {
          case 'date':
          case 'datetime': {
            Object.assign(field, { filter: { template: this.dateEditor } });
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  ngOnChanges(): void {
    this.buildSettings();
  }

  /**
   * Builds the form from the type of field / query we inject.
   */
  buildSettings(): void {
    if (this.form?.value.type) {
      this.isField = true;
      this.availableFields = this.queryBuilder
        .getFieldsFromType(this.form?.value.type)
        .filter((x) => this.canExpand || x.type.kind !== 'LIST');
      if (this.form?.get('filter')) {
        this.form?.setControl(
          'filter',
          this.createFilterGroup(this.form?.value.filter)
        );
      }
    } else {
      this.availableQueries = this.queryBuilder.availableQueries$;
      this.availableQueries.subscribe((res) => {
        if (res && res.length > 0) {
          if (this.queryName) {
            this.allQueries = res
              .filter((x) => x.name === this.queryName)
              .map((x) => x.name);
            if (this.allQueries.length === 1) {
              this.form?.get('name')?.setValue(this.allQueries[0]);
            }
          } else {
            this.allQueries = res.filter((x) => x.name).map((x) => x.name);
          }
          this.filteredQueries = this.filterQueries(this.form?.value.name);
          this.availableFields = this.queryBuilder.getFields(
            this.form?.value.name
          );
          if (this.form?.get('filter')) {
            this.form?.setControl(
              'filter',
              this.createFilterGroup(this.form?.value.filter)
            );
          }
        }
      });
      const setFormBuilderControls = (
        fieldControlRequired: boolean = false
      ) => {
        this.form?.setControl('filter', this.createFilterGroup(null));
        this.form?.setControl(
          'fields',
          fieldControlRequired
            ? this.fb.array([], Validators.required)
            : this.fb.array([])
        );
        this.form?.setControl(
          'sort',
          this.fb.group({
            field: [''],
            order: ['asc'],
          })
        );
      };
      this.form?.controls.name.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value !== this.form?.value.name) {
            if (this.allQueries.find((x) => x === value)) {
              this.availableFields = this.queryBuilder.getFields(value);
              setFormBuilderControls(true);
            } else {
              this.availableFields = [];
              setFormBuilderControls();
            }
            this.filteredQueries = this.filterQueries(value);
          }
        });
    }
  }

  /**
   * Closes the form.
   */
  onCloseField(): void {
    this.closeField.emit(true);
  }

  /**
   * Sets a new value for the form.
   *
   * @param newForm new form value.
   */
  setForm(newForm: FormGroup): void {
    this.form = newForm;
    this.buildSettings();
  }

  /**
   * Builds a filter form
   *
   * @param filter Initial filter
   * @returns Filter form
   */
  createFilterGroup = (filter: any) => {
    if (filter?.filters) {
      const filters = filter.filters.map((x: any) => this.createFilterGroup(x));
      return formBuilder.group({
        logic: filter.logic || 'and',
        filters: formBuilder.array(filters),
      });
    }
    if (filter?.field) {
      const group = formBuilder.group({
        field: filter.field,
        operator: filter.operator || 'eq',
        value: Array.isArray(filter.value) ? [filter.value] : filter.value,
      });
      if (
        FILTER_OPERATORS.find((op) => op.value === filter.operator)
          ?.disableValue
      ) {
        group.get('value')?.disable();
      }
      return group;
    }
    return formBuilder.group({
      logic: 'and',
      filters: formBuilder.array([]),
    });
  };

  /**
   * Filters the queries using text value.
   *
   * @param value search value
   * @returns filtered list of queries.
   */
  private filterQueries(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allQueries.filter((x) => x.toLowerCase().includes(filterValue));
  }
}
