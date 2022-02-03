import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
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
  public loadingGrid = true;
  public gridData: any = {
    data: [],
    total: 0,
  };

  // Fields
  private queryName = '';
  private fields = new BehaviorSubject<any[]>([]);
  public fields$!: Observable<any[]>;
  private selectedFields = new BehaviorSubject<any[]>([]);
  public selectedFields$!: Observable<any[]>;
  private metaFields = new BehaviorSubject<any[]>([]);
  public metaFields$!: Observable<any[]>;
  public mappingFields$!: Observable<any[]>;
  public gridFields: any[] = [];

  // === REACTIVE FORM ===
  @Input() rawPipelineForm!: AbstractControl;
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
      mapping: this.formBuilder.group({
        xAxis: [
          this.settings && this.settings.mapping && this.settings.mapping.xAxis
            ? this.settings.mapping.xAxis
            : '',
          Validators.required,
        ],
        yAxis: [
          this.settings && this.settings.mapping && this.settings.mapping.yAxis
            ? this.settings.mapping.yAxis
            : '',
          Validators.required,
        ],
      }),
    });

    // Update output raw aggregation
    this.aggregationForm.valueChanges.subscribe((value) => {
      if (this.aggregationForm.valid) {
        const pipeline = this.aggregationBuilder.buildPipeline(value);
        this.rawPipelineForm.setValue(pipeline);
        this.loadingGrid = true;
        this.gridFields = this.formatFields(
          this.aggregationBuilder.fieldsAfter(
            this.selectedFields.value,
            value.pipeline
          )
        );
        this.aggregationBuilder
          .buildAggregation(pipeline)
          .valueChanges.subscribe((res: any) => {
            this.gridData = {
              data: res.data.recordsAggregation,
              total: res.data.recordsAggregation.length,
            };
            this.loadingGrid = res.loading;
          });
      }
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
      .subscribe((form: string) => {
        if (form.match(/^[0-9a-fA-F]{24}$/)) {
          this.aggregationForm.get('sourceFields')?.setValue([]);
          const formName = this.forms.value.find((x) => x.id === form)?.name;
          this.queryName = formName
            ? this.queryBuilder.getQueryNameFromResourceName(formName)
            : '';
          const fields = this.queryBuilder.getFields(this.queryName);
          console.log('FIELDS', fields);
          this.fields.next(fields.filter((x) => x.type.kind === 'SCALAR'));
        }
      });

    // Meta selected fields query
    this.selectedFields$ = this.selectedFields.asObservable();
    this.metaFields$ = this.metaFields.asObservable();
    this.aggregationForm
      .get('sourceFields')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((fieldsNames: string[]) => {
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
      });

    // Mapping fields
    this.mappingFields$ =
      this.aggregationForm.get('pipeline')?.valueChanges.pipe(
        debounceTime(1000),
        map((pipeline) =>
          this.aggregationBuilder.fieldsAfter(
            this.selectedFields.value,
            pipeline
          )
        )
      ) || this.selectedFields$;

    // Preview grid
    this.aggregationForm
      .get('pipeline')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((pipeline) => {
        if (this.aggregationForm.get('pipeline')?.valid) {
          this.loadingGrid = true;
          this.gridFields = this.formatFields(
            this.aggregationBuilder.fieldsAfter(
              this.selectedFields.value,
              pipeline
            )
          );
          this.aggregationBuilder
            .buildAggregation(
              this.aggregationBuilder.buildPipeline(
                this.aggregationForm.value,
                false
              )
            )
            .valueChanges.subscribe((res: any) => {
              this.gridData = {
                data: res.data.recordsAggregation,
                total: res.data.recordsAggregation.length,
              };
              this.loadingGrid = res.loading;
            });
        }
      });
  }

  get pipelineForm(): FormArray {
    return this.aggregationForm.get('pipeline') as FormArray;
  }

  /**
   * Format fields so they are aligned with the queryBuilder format.
   *
   * @param fields Raw fields to format.
   * @return formatted fields.
   */
  private formatFields(fields: any[]): any[] {
    return fields.map((field: any) => {
      const formattedForm = this.queryBuilder.addNewField(field, true);
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
