import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { GET_FORMS, GetFormsQueryResponse } from '../../../graphql/queries';
import { Form } from '../../../models/form.model';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'safe-aggregation-builder',
  templateUrl: './aggregation-builder.component.html',
  styleUrls: ['./aggregation-builder.component.scss'],
})
export class SafeAggregationBuilderComponent implements OnInit {
  // === DATA ===
  @Input() settings: any;
  private forms = new BehaviorSubject<Form[]>([]);
  public forms$!: Observable<Form[]>;
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public loading = true;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private formFilter = '';

  // === REACTIVE FORM ===
  aggregationForm: FormGroup = new FormGroup({});

  constructor(private apollo: Apollo, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.aggregationForm = this.formBuilder.group({
      dataSource: [
        this.settings && this.settings.dataSource
          ? this.settings.dataSource
          : [],
        Validators.required,
      ],
    });
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
  }

  /**
   * Filter data sources by names.
   *
   * @param value string used to filter.
   */
  public onFilterDataSource(value: string): void {
    this.formFilter = value;
    this.fetchMoreDataSources();
  }

  /**
   * Fetch more data sources using filtering and pagination.
   *
   * @param nextPage boolean to indicate if we must fetch the next page.
   */
  public fetchMoreDataSources(nextPage: boolean = false) {
    const variables: any = {
      first: ITEMS_PER_PAGE,
    };
    if (this.formFilter) {
      variables.filter = {
        logic: 'and',
        filters: {
          field: 'name',
          operator: 'contains',
          value: this.formFilter,
        },
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
            edges: fetchMoreResult.forms.edges,
            pageInfo: fetchMoreResult.forms.pageInfo,
            totalCount: fetchMoreResult.forms.totalCount,
          },
        });
      },
    });
  }
}
