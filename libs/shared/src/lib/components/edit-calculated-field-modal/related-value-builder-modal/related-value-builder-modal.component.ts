import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { FilterModule } from '../../filter/filter.module';
import { createFilterGroup } from '../../query-builder/query-builder-forms';
import { GET_RESOURCE_RELATED_FIELDS } from './graphql/queries';

/**
 * Interface describing the structure of the data displayed in the dialog
 */
interface DialogData {
  /** Id of the resource the calculated field belongs to */
  resourceId: string;
}

/** One reverse link usable by a related-record aggregation */
interface RelatedFieldOption {
  /** Reverse link name, as used in the expression */
  relatedName: string;
  /** Name of the field carrying the link on the related resource */
  fieldName: string;
  /** Id of the related resource */
  resourceId: string;
  /** Name of the related resource */
  resourceName: string;
  /** Fields of the related resource */
  fields: any[];
}

/** Available related-record aggregations */
const AGGREGATIONS = [
  'relatedValue',
  'relatedCount',
  'relatedExists',
  'relatedSum',
  'relatedMin',
  'relatedMax',
  'relatedAvg',
];

/** Aggregations that extract or aggregate a value field */
const VALUE_FIELD_AGGREGATIONS = [
  'relatedValue',
  'relatedSum',
  'relatedMin',
  'relatedMax',
  'relatedAvg',
];

/**
 * Child metadata entries that cannot be used to filter the related records:
 * the aggregation runs inside a lookup sub-pipeline, where the lookups
 * populating these fields are not available.
 */
const EXCLUDED_FILTER_FIELDS = [
  'id',
  'form',
  'lastUpdateForm',
  'createdBy',
  'lastUpdatedBy',
];

/** Record-level fields usable to sort the related records */
const INFO_SORT_FIELDS = ['createdAt', 'modifiedAt', 'incrementalId'];

/**
 * Modal guiding the user through the configuration of a related-record
 * aggregation ({{calc.related*(...)}}). Emits the built expression on close,
 * so the calculated-field modal can insert it in the expression editor.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    SpinnerModule,
    TooltipModule,
    FilterModule,
  ],
  selector: 'shared-related-value-builder-modal',
  templateUrl: './related-value-builder-modal.component.html',
})
export class RelatedValueBuilderModalComponent implements OnInit, OnDestroy {
  /** Whether the reverse links are being fetched */
  public loading = true;
  /** Reverse links available on the resource */
  public relatedFields: RelatedFieldOption[] = [];
  /** Available aggregations */
  public aggregations = AGGREGATIONS;
  /** Builder form */
  public form = this.fb.group({
    relatedName: [null as string | null, Validators.required],
    aggregation: ['relatedCount', Validators.required],
    valueField: [null as string | null],
    sortField: [null as string | null],
    sortOrder: ['desc'],
  });
  /** Composite filter applied to the related records */
  public filterGroup: UntypedFormGroup = createFilterGroup(null);
  /** Fields metadata passed to the filter builder */
  public filterFields: any[] = [];
  /** Whether the related resource metadata is being fetched */
  public filterLoading = false;
  /** Emits on destroy, to unsubscribe */
  private destroy$ = new Subject<void>();

  /** @returns The selected reverse link */
  get selected(): RelatedFieldOption | undefined {
    return this.relatedFields.find(
      (x) => x.relatedName === this.form.value.relatedName
    );
  }

  /** @returns Whether the selected aggregation needs a value field */
  get needsValueField(): boolean {
    return VALUE_FIELD_AGGREGATIONS.includes(
      this.form.value.aggregation as string
    );
  }

  /** @returns Whether the selected aggregation needs a sort field & order */
  get needsSort(): boolean {
    return this.form.value.aggregation === 'relatedValue';
  }

  /** @returns Fields of the related resource usable as value field, sorted by name */
  get valueFieldOptions(): string[] {
    return (this.selected?.fields || [])
      .map((x: any) => x.name)
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  /** @returns Fields usable to sort the related records, sorted by name */
  get sortFieldOptions(): string[] {
    return [...this.valueFieldOptions, ...INFO_SORT_FIELDS].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  /**
   * @returns The built {{calc.related*(...)}} expression, or null while the
   * configuration is incomplete or invalid.
   */
  get expression(): string | null {
    if (!this.form.valid || this.hasQuoteIssue) {
      return null;
    }
    const value = this.form.getRawValue();
    const args = [`'${value.relatedName}'`];
    if (this.needsValueField) {
      args.push(`'${value.valueField}'`);
    }
    if (this.needsSort) {
      args.push(`'${value.sortField}'`, `'${value.sortOrder}'`);
    }
    const filter = this.cleanFilter(this.filterGroup.getRawValue());
    if (filter) {
      args.push(`'${JSON.stringify(filter)}'`);
    }
    return `{{calc.${value.aggregation}(${args.join('; ')})}}`;
  }

  /**
   * @returns Whether the filter contains a single quote, which cannot be
   * escaped inside the expression syntax.
   */
  get hasQuoteIssue(): boolean {
    const filter = this.cleanFilter(this.filterGroup.getRawValue());
    return !!filter && JSON.stringify(filter).includes("'");
  }

  /**
   * Modal guiding the configuration of a related-record aggregation.
   *
   * @param dialogRef Reference of the dialog
   * @param fb Angular form builder
   * @param apollo Apollo client, to fetch the resource reverse links
   * @param queryBuilder Query builder service, to fetch the related resource metadata
   * @param data Data passed to the modal (resource id)
   */
  constructor(
    public dialogRef: DialogRef<string | undefined>,
    private fb: FormBuilder,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.fetchRelatedFields();
    this.form
      .get('relatedName')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.patchValue({ valueField: null, sortField: null });
        this.filterGroup = createFilterGroup(null);
        this.fetchFilterFields();
      });
    this.form
      .get('aggregation')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateValidators());
    this.updateValidators();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Closes the modal, sending the built expression.
   */
  onSubmit(): void {
    const expression = this.expression;
    if (expression) {
      this.dialogRef.close(expression);
    }
  }

  /**
   * Fetches the reverse links of the resource.
   */
  private async fetchRelatedFields(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.apollo.query<{ resource: { relatedFields: any[] } }>({
          query: GET_RESOURCE_RELATED_FIELDS,
          variables: { id: this.data.resourceId },
        })
      );
      this.relatedFields = get(data, 'resource.relatedFields') || [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * Fetches the fields metadata of the selected related resource, through the
   * same query the query builder uses for grid filters, so choice options
   * coming from external sources (REST / GraphQL APIs, reference data) are
   * resolved by the server.
   */
  private async fetchFilterFields(): Promise<void> {
    const selected = this.selected;
    this.filterFields = [];
    if (!selected) {
      return;
    }
    this.filterLoading = true;
    try {
      const { data } = await firstValueFrom(
        this.queryBuilder.getQueryMetaData(selected.resourceId)
      );
      this.filterFields = (get(data, 'resource.metadata') || [])
        .filter(
          (x: any) =>
            x.filterable !== false &&
            !EXCLUDED_FILTER_FIELDS.includes(x.name) &&
            // Sub-fields of linked records are not available inside the
            // related-record aggregation, so they cannot be filtered on
            !['resource', 'resources'].includes(x.type)
        )
        .map((x: any) => ({ ...x }));
    } finally {
      this.filterLoading = false;
    }
  }

  /**
   * Aligns the value / sort validators with the selected aggregation.
   */
  private updateValidators(): void {
    const valueField = this.form.get('valueField');
    const sortField = this.form.get('sortField');
    valueField?.setValidators(
      this.needsValueField ? [Validators.required] : []
    );
    sortField?.setValidators(this.needsSort ? [Validators.required] : []);
    valueField?.updateValueAndValidity({ emitEvent: false });
    sortField?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Strips incomplete rows and internal editor state from the filter form
   * value, so the expression only carries meaningful filter descriptors.
   *
   * @param filter Raw filter form value
   * @returns Cleaned filter, or null when no complete row remains
   */
  private cleanFilter(filter: any): any {
    if (!filter) {
      return null;
    }
    if (filter.filters) {
      const filters = filter.filters
        .map((x: any) => this.cleanFilter(x))
        .filter((x: any) => x);
      return filters.length > 0
        ? { logic: filter.logic || 'and', filters }
        : null;
    }
    if (filter.field && filter.operator) {
      const row: any = { field: filter.field, operator: filter.operator };
      if (filter.operator === 'inthelast') {
        row.inTheLast = filter.inTheLast;
      } else if (filter.value !== undefined && filter.value !== null) {
        row.value = filter.value;
      }
      return row;
    }
    return null;
  }
}
