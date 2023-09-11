import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { Form } from '../../models/form.model';
import { createFilterGroup } from './query-builder-forms';
import { LayoutPreviewData } from './tab-layout-preview/tab-layout-preview.component';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Main query builder component.
 * Enables admin user to build a query from GraphQL API schema.
 */
@Component({
  selector: 'safe-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class SafeQueryBuilderComponent
  extends SafeUnsubscribeComponent
  implements OnChanges
{
  // === QUERY BUILDER ===
  public availableQueries?: Observable<any[]>;
  public availableFields: any[] = [];

  public allQueries: any[] = [];
  public filteredQueries: any[] = [];

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

  @Input() form?: FormGroup;
  @Input() canExpand = true;
  @Input() canSelectDataSet = true;
  @Input() templates: Form[] = [];
  @Input() queryName? = '';
  @Input() layoutPreviewData: LayoutPreviewData | null = null;
  @Input() showStyle = true;
  @Input() showFilter = true;
  @Input() showSort = true;

  // Tab options
  @Input() showLimit = false;

  // === FIELD EDITION ===
  public isField = false;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param fb This is the Angular FormBuilder service.
   * @param queryBuilder This is the service that will be used to build the query.
   */
  constructor(
    private fb: FormBuilder,
    private queryBuilder: QueryBuilderService
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
          this.form?.setControl(
            'filter',
            createFilterGroup(this.form?.value.filter)
          );
        }
      });
      this.form?.controls.name.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value !== this.form?.value.name) {
            if (this.allQueries.find((x) => x === value)) {
              this.availableFields = this.queryBuilder.getFields(value);
              this.form?.setControl('filter', createFilterGroup(null));
              this.form?.setControl(
                'fields',
                this.fb.array([], Validators.required)
              );
              this.form?.setControl(
                'sort',
                this.fb.group({
                  field: [''],
                  order: ['asc'],
                })
              );
            } else {
              this.availableFields = [];
              this.form?.setControl('filter', createFilterGroup(null));
              this.form?.setControl('fields', this.fb.array([]));
              this.form?.setControl(
                'sort',
                this.fb.group({
                  field: [''],
                  order: ['asc'],
                })
              );
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
