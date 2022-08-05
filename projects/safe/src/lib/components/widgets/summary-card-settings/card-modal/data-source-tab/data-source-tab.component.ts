import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { createAggregationForm } from '../../../../ui/aggregation-builder/aggregation-builder-forms';
import { GET_RESOURCES, GetResourcesQueryResponse } from '../graphql/queries';
import { Resource } from '../../../../../models/resource.model';

/**
 * How many resources.forms will be shown on the selector.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Component used in the card-modal-settings for selecting the resource and layout.
 */
@Component({
  selector: 'safe-data-source-tab',
  templateUrl: './data-source-tab.component.html',
  styleUrls: ['./data-source-tab.component.scss'],
})
export class SafeDataSourceTabComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() selectedResource: Resource | null = null;

  // === RADIO ===
  public radioValue = false;

  // === DATA ===
  public resources: any[] = [];
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public loading = true;
  public loadingResource = false;
  public loadingMore = false;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  public loadingGrid = true;
  public gridData: any = {
    data: [],
    total: 0,
  };

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return createAggregationForm(null, '');
  }

  /**
   * SafeDataSourceTabComponent constructor
   *
   * @param apollo Used for getting the resources and layouts query
   */
  constructor(private apollo: Apollo) {}

  /**
   * Gets the selected resource data
   */
  ngOnInit(): void {
    // Initialize radioValue
    this.radioValue = this.form.value.isAggregation;

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
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables,
    });
    this.resourcesQuery.valueChanges.subscribe((res) => {
      this.resources = res.data.resources.edges.map((x) => x.node);
      this.pageInfo = res.data.resources.pageInfo;
      this.loadingMore = res.loading;
      if (this.loading) {
        this.loading = res.loading;
      }
    });
  }

  /**
   * Filters data sources by names.
   *
   * @param value string used to filter.
   */
  public onFilterDataSource(value: string): void {
    if (!this.loadingMore) {
      this.loadingMore = true;
      this.fetchMoreDataSources(false, value);
    }
  }

  /**
   * Fetches next page of data source to add to list.
   *
   * @param value string used to filter.
   */
  public onScrollDataSource(value: boolean): void {
    if (!this.loadingMore && this.pageInfo.hasNextPage) {
      this.loadingMore = true;
      this.fetchMoreDataSources(value);
    }
  }

  /**
   * Fetches more data sources using filtering and pagination.
   *
   * @param nextPage boolean to indicate if we must fetch the next page.
   * @param filter the data sources fetched must respect this filter
   */
  public fetchMoreDataSources(nextPage: boolean = false, filter: string = '') {
    const variables: any = {
      first: ITEMS_PER_PAGE,
    };
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
    if (nextPage) {
      variables.afterCursor = this.pageInfo.endCursor;
    }
    this.resourcesQuery.fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          resources: {
            edges: prev.resources.edges.concat(
              fetchMoreResult.resources.edges.filter(
                (x: any) =>
                  !prev.resources.edges.some(
                    (y: any) => y.node.id === x.node.id
                  )
              )
            ),
            pageInfo: fetchMoreResult.resources.pageInfo,
            totalCount: fetchMoreResult.resources.totalCount,
          },
        });
      },
    });
  }

  /**
   * Changes the form value assigned to the radio component.
   *
   * @param event Event with the change values.
   */
  radioChange(event: any) {
    this.radioValue = event.value;
    this.form.patchValue({ isAggregation: event.value });
  }
}
