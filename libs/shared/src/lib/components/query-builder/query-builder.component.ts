import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { Form } from '../../models/form.model';
import { createFilterGroup, createSortRowForm } from './query-builder-forms';
import { LayoutPreviewData } from './tab-layout-preview/tab-layout-preview.component';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { RestService } from '../../services/rest/rest.service';

/** Form option and ordered fields returned by the layout REST endpoint. */
export interface LayoutFormFields {
  id: string;
  name: string;
  fields: string[];
}

/** GraphQL metadata source response. */
interface QuerySourceResponse {
  _source?: string;
}

/**
 * Main query builder component.
 * Enables admin user to build a query from GraphQL API schema.
 */
@Component({
  selector: 'shared-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  /** Form group */
  @Input() form?: FormGroup;
  /** CanExpand boolean control */
  @Input() canExpand = true;
  /** CanSelectDataSet boolean control */
  @Input() canSelectDataSet = true;
  /** Templates form */
  @Input() templates: Form[] = [];
  /** Query string */
  @Input() queryName? = '';
  /** Layout preview data */
  @Input() layoutPreviewData: LayoutPreviewData | null = null;
  /** Style show boolean control */
  @Input() showStyle = true;
  /** Filter show boolean control */
  @Input() showFilter = true;
  /** Sort show boolean control */
  @Input() showSort = true;
  /** Toggles the column width parameter */
  @Input() showColumnWidth = false;
  /** Show limit option */
  @Input() showLimit = false;
  /** Enables form-based field filtering for layout configuration. */
  @Input() enableFormFieldFilter = false;
  /** Close field event emitter */
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();
  /** Is field boolean control */
  public isField = false;
  /** Available queries observable */
  public availableQueries?: Observable<any[]>;
  /** Available fields */
  public availableFields: any[] = [];
  /** All queries array */
  public allQueries: any[] = [];
  /** Filtered queries array */
  public filteredQueries: any[] = [];
  /** Selected text fields */
  public selectedTextFields: any[] = [];
  /** Forms available for filtering fields in layouts. */
  public layoutForms: LayoutFormFields[] = [];

  /**
   * Getter for the available scalar fields
   *
   * @returns the available scalar fields
   */
  get availableScalarFields(): any[] {
    return this.availableFields.filter(
      (x) => x.type.kind === 'SCALAR' || x.type.kind === 'OBJECT'
    );
  }

  /**
   * Main query builder component.
   * Enables admin user to build a query from GraphQL API schema.
   *
   * @param fb This is the Angular FormBuilder service.
   * @param queryBuilder This is the service that will be used to build the query.
   * @param restService Service used to load resource forms.
   */
  constructor(
    private fb: FormBuilder,
    private queryBuilder: QueryBuilderService,
    private restService: RestService
  ) {
    super();
  }

  /**
   * Allows to inject the component without creating circular dependency.
   */
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
          createFilterGroup(this.form?.value.filter)
        );
      }
      if (this.form?.get('displayField')) {
        // Build list of selected text fields on loading & form changes.
        const setSelectedTextFields = () => {
          const fields = this.form?.getRawValue().fields || [];
          this.selectedTextFields = fields.filter((x: any) =>
            ['String', 'ID'].includes(x.type)
          );
        };
        setSelectedTextFields();
        this.form
          .get('fields')
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            setSelectedTextFields();
          });
      }
    } else {
      this.availableQueries = this.queryBuilder.availableQueries$;
      this.availableQueries.subscribe((queries) => {
        if (queries && queries.length > 0) {
          if (this.queryName) {
            this.allQueries = queries
              .filter((x) => x.name === this.queryName)
              .map((x) => x.name);
            if (this.allQueries.length === 1) {
              this.form?.get('name')?.setValue(this.allQueries[0]);
            }
          } else {
            this.allQueries = queries.filter((x) => x.name).map((x) => x.name);
          }
          this.filteredQueries = this.filterQueries(this.form?.value.name);
          this.availableFields = this.queryBuilder.getFields(
            this.form?.value.name
          );
          if (this.enableFormFieldFilter) {
            void this.loadLayoutForms(this.form?.value.name);
          }
          this.form?.setControl(
            'filter',
            createFilterGroup(this.form?.value.filter)
          );
        }
      });
      const setFormBuilderControls = (fieldControlRequired = false) => {
        this.form?.setControl('filter', createFilterGroup(null));
        this.form?.setControl(
          'fields',
          fieldControlRequired
            ? this.fb.array([], Validators.required)
            : this.fb.array([])
        );
        this.form?.setControl('sort', this.fb.array([createSortRowForm(null)]));
      };
      this.form?.controls.name.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value !== this.form?.value.name) {
            if (this.allQueries.find((x) => x === value)) {
              this.availableFields = this.queryBuilder.getFields(value);
              if (this.enableFormFieldFilter) {
                void this.loadLayoutForms(value);
              }
              setFormBuilderControls(true);
            } else {
              this.availableFields = [];
              this.layoutForms = [];
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
   * Loads the forms associated with the resource behind the selected dataset.
   * The endpoint returns pre-ordered fields, avoiding client-side form parsing.
   *
   * @param queryName Current dataset query name.
   */
  private async loadLayoutForms(queryName: string): Promise<void> {
    this.layoutForms = [];
    const sourceQuery = this.queryBuilder.sourceQuery(queryName);
    if (!sourceQuery) return;

    try {
      const sourceResult = (await firstValueFrom(sourceQuery)) as {
        data: Record<string, QuerySourceResponse>;
      };
      const source = Object.values(sourceResult.data).find(
        (value) => value._source
      )?._source;
      if (!source || this.form?.value.name !== queryName) return;

      const forms = await firstValueFrom(
        this.restService.get(`/layouts/resources/${source}/forms`)
      );
      if (this.form?.value.name === queryName && Array.isArray(forms)) {
        this.layoutForms = forms as LayoutFormFields[];
      }
    } catch {
      if (this.form?.value.name === queryName) {
        this.layoutForms = [];
      }
    }
  }

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
