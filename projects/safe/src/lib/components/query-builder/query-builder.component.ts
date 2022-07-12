import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder.service';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { Overlay } from '@angular/cdk/overlay';
import { Form } from '../../models/form.model';
import { createFilterGroup } from './query-builder-forms';
import { scrollFactory } from '../../utils/scroll-factory';
import { LayoutPreviewData } from './tab-layout-preview/tab-layout-preview.component';

/**
 * Main query builder component.
 * Enables admin user to build a query from GraphQL API schema.
 */
@Component({
  selector: 'safe-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeQueryBuilderComponent implements OnInit {
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

  // === FIELD EDITION ===
  public isField = false;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param formBuilder This is the Angular FormBuilder service.
   * @param queryBuilder This is the service that will be used to build the query.
   */
  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) {}

  /**
   * Allows to inject the component without creating circular dependency.
   */
  ngOnInit(): void {
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
      this.form?.controls.name.valueChanges.subscribe((res) => {
        if (this.allQueries.find((x) => x === res)) {
          this.availableFields = this.queryBuilder.getFields(res);
          this.form?.setControl('filter', createFilterGroup(null));
          this.form?.setControl(
            'fields',
            this.formBuilder.array([], Validators.required)
          );
          this.form?.setControl(
            'sort',
            this.formBuilder.group({
              field: [''],
              order: ['asc'],
            })
          );
        } else {
          this.availableFields = [];
          this.form?.setControl('filter', createFilterGroup(null));
          this.form?.setControl('fields', this.formBuilder.array([]));
          this.form?.setControl(
            'sort',
            this.formBuilder.group({
              field: [''],
              order: ['asc'],
            })
          );
        }
        this.filteredQueries = this.filterQueries(res);
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
