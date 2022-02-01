import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GET_FORMS, GetFormsQueryResponse } from '../../../graphql/queries';
import { Form } from '../../../models/form.model';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'safe-aggregation-builder',
  templateUrl: './aggregation-builder.component.html',
  styleUrls: ['./aggregation-builder.component.scss'],
})
export class SafeAggregationBuilderComponent implements OnInit {
  // === DATA ===
  @Input() settings: any;
  // Data sources
  private forms = new BehaviorSubject<Form[]>([]);
  public forms$!: Observable<Form[]>;
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public loading = true;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  // Fields
  private queryName = '';
  private fields = new BehaviorSubject<any[]>([]);
  public fields$!: Observable<any[]>;
  private selectedFields = new BehaviorSubject<any[]>([]);
  public selectedFields$!: Observable<any[]>;
  private metaFields = new BehaviorSubject<any[]>([]);
  public metaFields$!: Observable<any[]>;

  // === REACTIVE FORM ===
  aggregationForm: FormGroup = new FormGroup({});

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  ngOnInit(): void {
    // Initialize the FormGroup
    this.aggregationForm = this.formBuilder.group({
      dataSource: [
        this.settings && this.settings.dataSource
          ? this.settings.dataSource
          : null,
        Validators.required,
      ],
      sourceFields: [
        this.settings && this.settings.sourceFields
          ? this.settings.sourceFields
          : [],
        Validators.required,
      ],
      pipeline: this.formBuilder.array(
        this.settings && this.settings.pipeline && this.settings.pipeline.length
          ? this.settings.pipeline.map((x: any) =>
              this.aggregationBuilder.stageForm(x)
            )
          : []
      ),
    });

    // Data source query
    this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS,
      variables: {
        first: ITEMS_PER_PAGE,
      },
    });
    this.forms$ = this.forms.asObservable();
    this.formsQuery.valueChanges.subscribe((res) => {
      this.forms.next(res.data.forms.edges.map((x) => x.node));
      this.pageInfo = res.data.forms.pageInfo;
      this.loading = res.loading;
    });

    // Fields query
    this.fields$ = this.fields.asObservable();
    this.aggregationForm
      .get('dataSource')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((form) => {
        if (form && form.id) {
          this.aggregationForm.get('sourceFields')?.setValue([]);
          this.queryName = form.name
            ? this.queryBuilder.getQueryNameFromResourceName(form.name)
            : '';
          const fields = this.queryBuilder.getFields(this.queryName);
          console.log('FIELDS', fields);
          this.fields.next(fields.filter((x) => x.type.kind === 'SCALAR'));
        }
      });

    this.selectedFields$ = this.selectedFields.asObservable();
    this.metaFields$ = this.metaFields.asObservable();
    this.aggregationForm
      .get('sourceFields')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((fields) => {
        const formattedFields = fields.map((field: any) => {
          const formattedForm = this.queryBuilder.addNewField(field, true);
          formattedForm.enable();
          return formattedForm.value;
        });
        this.selectedFields.next(fields);
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
      });
  }

  get pipelineForm(): FormArray {
    return this.aggregationForm.get('pipeline') as FormArray;
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
