import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GET_FORMS, GetFormsQueryResponse } from '../../../graphql/queries';
import { Form } from '../../../models/form.model';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { isMongoId } from '../../../utils/is-mongo-id';
import { addNewField } from '../../query-builder/query-builder-forms';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'safe-aggregation-builder',
  templateUrl: './aggregation-builder.component.html',
  styleUrls: ['./aggregation-builder.component.scss'],
})
export class SafeAggregationBuilderComponent implements OnInit {
  // === REACTIVE FORM ===
  @Input() aggregationForm: FormGroup = new FormGroup({});

  // === DATA ===
  private forms = new BehaviorSubject<Form[]>([]);
  public forms$!: Observable<Form[]>;
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public loading = true;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  public loadingGrid = true;
  public gridData: any = {
    data: [],
    total: 0,
  };

  // === FIELDS ===
  private queryName = '';
  private fields = new BehaviorSubject<any[]>([]);
  public fields$!: Observable<any[]>;
  private selectedFields = new BehaviorSubject<any[]>([]);
  public selectedFields$!: Observable<any[]>;
  private metaFields = new BehaviorSubject<any[]>([]);
  public metaFields$!: Observable<any[]>;
  private mappingFields = new BehaviorSubject<any[]>([]);
  public mappingFields$!: Observable<any[]>;
  public gridFields: any[] = [];

  get pipelineForm(): FormArray {
    return this.aggregationForm.get('pipeline') as FormArray;
  }

  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  ngOnInit(): void {
    // Data source query
    const variables: any = {
      first: ITEMS_PER_PAGE,
    };
    if (this.aggregationForm.value.dataSource) {
      variables.filter = {
        logic: 'and',
        filters: [
          {
            field: 'ids',
            operator: 'in',
            value: [this.aggregationForm.value.dataSource],
          },
        ],
      };
    }
    this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS,
      variables,
    });
    this.forms$ = this.forms.asObservable();
    this.formsQuery.valueChanges.subscribe((res) => {
      this.forms.next(res.data.forms.edges.map((x) => x.node));
      this.pageInfo = res.data.forms.pageInfo;
      this.loading = res.loading;
      this.initFields();
    });

    // Fields query
    this.fields$ = this.fields.asObservable();
    this.aggregationForm
      .get('dataSource')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((form: string) => {
        if (isMongoId(form)) {
          this.aggregationForm.get('sourceFields')?.setValue([]);
          this.updateFields(form);
        }
      });

    // Meta selected fields query
    this.selectedFields$ = this.selectedFields.asObservable();
    this.metaFields$ = this.metaFields.asObservable();
    this.aggregationForm
      .get('sourceFields')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((fieldsNames: string[]) => {
        this.updateSelectedAndMetaFields(fieldsNames);
      });

    // Preview grid and mapping fields
    this.mappingFields$ = this.mappingFields.asObservable();
    this.aggregationForm
      .get('pipeline')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((pipeline) => {
        this.initGrid(pipeline);
        this.mappingFields.next(
          this.aggregationBuilder.fieldsAfter(
            this.selectedFields.value,
            pipeline
          )
        );
      });
  }

  /**
   * Init all data necessary for the reactive form to work.
   */
  private initFields(): void {
    this.updateFields(this.aggregationForm.value.dataSource);
    this.updateSelectedAndMetaFields(this.aggregationForm.value.sourceFields);
    this.initGrid(this.aggregationForm.value.pipeline);
  }

  /**
   * Update fields depending on selected form.
   *
   * @param form New form to fetch fields from.
   */
  private updateFields(form: string): void {
    if (form) {
      const formName = this.forms.value.find((x) => x.id === form)?.name;
      this.queryName = formName
        ? this.queryBuilder.getQueryNameFromResourceName(formName)
        : '';
      const fields = this.queryBuilder.getFields(this.queryName);
      this.fields.next(fields.filter((x) => x.type.kind === 'SCALAR'));
    }
  }

  /**
   * Update selected, meta and mapping fields depending on tagbox value.
   *
   * @param fieldsNames Tagbox value.
   */
  private updateSelectedAndMetaFields(fieldsNames: string[]): void {
    if (fieldsNames && fieldsNames.length) {
      const currentFields = this.fields.value;
      const selectedFields = fieldsNames.map((x: string) =>
        currentFields.find((y) => x === y.name)
      );
      const formattedFields = this.formatFields(selectedFields);
      this.selectedFields.next(selectedFields);
      this.queryBuilder
        .buildMetaQuery({
          query: { name: this.queryName, fields: formattedFields },
        })
        ?.subscribe((res) => {
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.metaFields.next(res.data[field]);
            }
          }
        });
      this.mappingFields.next(
        this.aggregationBuilder.fieldsAfter(
          selectedFields,
          this.aggregationForm.get('pipeline')?.value
        )
      );
    }
  }

  /**
   * Init preview grid using pipeline parameters.
   *
   * @param pipeline Array of stages.
   */
  private initGrid(pipeline: any[]): void {
    if (this.aggregationForm.get('pipeline')?.valid && pipeline.length) {
      this.loadingGrid = true;
      this.gridFields = this.formatFields(
        this.aggregationBuilder.fieldsAfter(this.selectedFields.value, pipeline)
      );
      this.aggregationBuilder
        .buildAggregation(this.aggregationForm.value, false)
        .valueChanges.subscribe((res: any) => {
          this.gridData = {
            data: res.data.recordsAggregation,
            total: res.data.recordsAggregation.length,
          };
          this.loadingGrid = res.loading;
        });
    }
  }

  /**
   * Format fields so they are aligned with the queryBuilder format.
   *
   * @param fields Raw fields to format.
   * @return formatted fields.
   */
  private formatFields(fields: any[]): any[] {
    return fields.map((field: any) => {
      const formattedForm = addNewField(field, true);
      formattedForm.enable();
      return formattedForm.value;
    });
  }

  /**
   * Filter data sources by names.
   *
   * @param value string used to filter.
   */
  public onFilterDataSource(value: string): void {
    if (!this.loading) {
      this.loading = true;
      this.fetchMoreDataSources(false, value);
    }
  }

  /**
   * Fetch next page of data source to add to list.
   *
   * @param value string used to filter.
   */
  public onScrollDataSource(value: boolean): void {
    if (!this.loading && this.pageInfo.hasNextPage) {
      this.loading = true;
      this.fetchMoreDataSources(value);
    }
  }

  /**
   * Fetch more data sources using filtering and pagination.
   *
   * @param nextPage boolean to indicate if we must fetch the next page.
   */
  public fetchMoreDataSources(nextPage: boolean = false, filter: string = '') {
    const variables: any = {
      first: ITEMS_PER_PAGE,
    };
    if (filter) {
      variables.filter = {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: filter,
          },
        ],
      };
    }
    if (nextPage) {
      variables.afterCursor = this.pageInfo.endCursor;
    }
    this.formsQuery.fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          forms: {
            edges: prev.forms.edges.concat(
              fetchMoreResult.forms.edges.filter(
                (x) => !prev.forms.edges.some((y) => y.node.id === x.node.id)
              )
            ),
            pageInfo: fetchMoreResult.forms.pageInfo,
            totalCount: fetchMoreResult.forms.totalCount,
          },
        });
      },
    });
  }
}
