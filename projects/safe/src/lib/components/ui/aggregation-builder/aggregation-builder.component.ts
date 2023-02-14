import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { SafeGridService } from '../../../services/grid/grid.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { Resource } from '../../../models/resource.model';
import { MAT_LEGACY_AUTOCOMPLETE_SCROLL_STRATEGY as MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/legacy-autocomplete';
import { scrollFactory } from '../../config-display-grid-fields-modal/config-display-grid-fields-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Main component of Aggregation builder.
 * Aggregation are used to generate charts.
 */
@Component({
  selector: 'safe-aggregation-builder',
  templateUrl: './aggregation-builder.component.html',
  styleUrls: ['./aggregation-builder.component.scss'],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeAggregationBuilderComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === REACTIVE FORM ===
  @Input() aggregationForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() resource!: Resource;

  @Input() reload$!: Observable<boolean>;

  // === DATA ===
  // private forms = new BehaviorSubject<Form[]>([]);
  // public forms$!: Observable<Form[]>;
  // private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public loading = true;
  // public loadingForm = false;
  // public loadingMore = false;
  // private pageInfo = {
  //   endCursor: '',
  //   hasNextPage: true,
  // };
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
  /**
   * Getter for the pipeline of the aggregation form
   *
   * @returns the pipelines in a FormArray
   */
  get pipelineForm(): UntypedFormArray {
    return this.aggregationForm.get('pipeline') as UntypedFormArray;
  }

  /**
   * Constructor for the aggregation builder
   *
   * @param apollo This is the Apollo client that will be used to make the GraphQL query.
   * @param queryBuilder This is a service that is used to build queries.
   * @param aggregationBuilder This is the service that will be used to build the aggregation query.
   * @param gridService This is a service used to communicate with the grids
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService,
    private gridService: SafeGridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.queryName = this.resource.queryName ?? '';
    // Data source query
    // const variables: any = {
    //   first: ITEMS_PER_PAGE,
    // };
    // if (this.aggregationForm.value.dataSource) {
    //   variables.filter = {
    //     logic: 'and',
    //     filters: [
    //       {
    //         field: 'ids',
    //         operator: 'in',
    //         value: [this.aggregationForm.value.dataSource],
    //       },
    //     ],
    //   };
    // }
    // this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
    //   query: GET_FORMS,
    //   variables,
    // });
    // this.forms$ = this.forms.asObservable();
    // this.formsQuery.valueChanges.subscribe(({ data, loading }) => {
    //   this.forms.next(data.forms.edges.map((x) => x.node));
    //   this.pageInfo = data.forms.pageInfo;
    //   this.loadingMore = loading;
    //   if (this.loading) {
    //     this.loading = loading;
    //     this.initFields();
    //   }
    // });
    this.initFields();

    // Fields query
    this.fields$ = this.fields.asObservable();

    // Meta selected fields query
    this.selectedFields$ = this.selectedFields.asObservable();
    this.metaFields$ = this.metaFields.asObservable();
    this.aggregationForm
      .get('sourceFields')
      ?.valueChanges.pipe(debounceTime(1000))
      .pipe(takeUntil(this.destroy$))
      .subscribe((fieldsNames: string[]) => {
        this.updateSelectedAndMetaFields(fieldsNames);
      });

    // Preview grid and mapping fields
    this.mappingFields$ = this.mappingFields.asObservable();
    this.aggregationForm
      .get('pipeline')
      ?.valueChanges.pipe(debounceTime(1000))
      .pipe(takeUntil(this.destroy$))
      .subscribe((pipeline) => {
        this.mappingFields.next(
          this.aggregationBuilder.fieldsAfter(
            this.selectedFields.value,
            pipeline
          )
        );
      });

    // this.reload$.subscribe(() => {
    //   this.loading = true;
    //   setTimeout(() => {
    //     this.loading = false;
    //   }, 1000);
    // });
    this.loading = false;
  }

  /**
   * Initializes all data necessary for the reactive form to work.
   */
  private initFields(): void {
    this.updateFields();
    this.updateSelectedAndMetaFields(this.aggregationForm.value.sourceFields);
  }

  /**
   * Updates fields depending on selected form.
   */
  private updateFields(): void {
    const fields = this.queryBuilder
      .getFields(this.resource.queryName as string)
      .filter(
        (field: any) =>
          !(
            field.name.includes('_id') &&
            (field.type.name === 'ID' ||
              (field.type.kind === 'LIST' && field.type.ofType.name === 'ID'))
          )
      );
    this.fields.next(fields);
  }

  /**
   * Updates selected, meta and mapping fields depending on tagbox value.
   *
   * @param fieldsNames Tagbox value.
   */
  private updateSelectedAndMetaFields(fieldsNames: string[]): void {
    if (fieldsNames && fieldsNames.length) {
      const currentFields = this.fields.value;
      const selectedFields = fieldsNames.map((x: string) => {
        const field = { ...currentFields.find((y) => x === y.name) };
        if (field.type.kind !== 'SCALAR') {
          field.fields = this.queryBuilder
            .getFieldsFromType(
              field.type.kind === 'OBJECT'
                ? field.type.name
                : field.type.ofType.name
            )
            .filter((y) => y.type.name !== 'ID' && y.type.kind === 'SCALAR');
        }
        return field;
      });
      // const formattedFields =
      //   this.aggregationBuilder.formatFields(selectedFields);
      this.selectedFields.next(selectedFields);
      // this.queryBuilder
      //   .buildMetaQuery({ name: this.queryName, fields: formattedFields })
      //   ?.subscribe(({ data, loading }) => {
      //     for (const field in data) {
      //       if (Object.prototype.hasOwnProperty.call(data, field)) {
      //         this.metaFields.next(data[field]);
      //       }
      //     }
      //   });
      this.mappingFields.next(
        this.aggregationBuilder.fieldsAfter(
          selectedFields,
          this.aggregationForm.get('pipeline')?.value
        )
      );
    } else {
      this.selectedFields.next([]);
      this.metaFields.next([]);
      this.mappingFields.next([]);
    }
  }

  /**
   * Filters data sources by names.
   *
   * @param value string used to filter.
   */
  // public onFilterDataSource(value: string): void {
  //   if (!this.loadingMore) {
  //     this.loadingMore = true;
  //     this.fetchMoreDataSources(false, value);
  //   }
  // }

  /**
   * Fetches next page of data source to add to list.
   *
   * @param value string used to filter.
   */
  // public onScrollDataSource(value: boolean): void {
  //   if (!this.loadingMore && this.pageInfo.hasNextPage) {
  //     this.loadingMore = true;
  //     this.fetchMoreDataSources(value);
  //   }
  // }

  /**
   * Fetches more data sources using filtering and pagination.
   *
   * @param nextPage boolean to indicate if we must fetch the next page.
   * @param filter the data sources fetched must respect this filter
   */
  // public fetchMoreDataSources(nextPage: boolean = false, filter: string = '') {
  //   const variables: any = {
  //     first: ITEMS_PER_PAGE,
  //   };
  //   variables.filter = {
  //     logic: 'and',
  //     filters: [
  //       {
  //         field: 'name',
  //         operator: 'contains',
  //         value: filter,
  //       },
  //     ],
  //   };
  //   if (nextPage) {
  //     variables.afterCursor = this.pageInfo.endCursor;
  //   }
  //   this.formsQuery.fetchMore({
  //     variables,
  //     updateQuery: (prev, { fetchMoreResult }) => {
  //       if (!fetchMoreResult) {
  //         return prev;
  //       }
  //       return Object.assign({}, prev, {
  //         forms: {
  //           edges: prev.forms.edges.concat(
  //             fetchMoreResult.forms.edges.filter(
  //               (x) => !prev.forms.edges.some((y) => y.node.id === x.node.id)
  //             )
  //           ),
  //           pageInfo: fetchMoreResult.forms.pageInfo,
  //           totalCount: fetchMoreResult.forms.totalCount,
  //         },
  //       });
  //     },
  //   });
  // }
}
