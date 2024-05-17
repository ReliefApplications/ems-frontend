import { Injectable } from '@angular/core';
import {
  ADD_AGGREGATION,
  DELETE_AGGREGATION,
  EDIT_AGGREGATION,
} from './graphql/mutations';
import {
  GET_REFERENCE_DATA_AGGREGATIONS,
  GET_REFERENCE_DATA_AGGREGATION_DATA,
  GET_RESOURCE_AGGREGATIONS,
  GET_RESOURCE_AGGREGATION_DATA,
} from './graphql/queries';
import {
  AddAggregationMutationResponse,
  Aggregation,
  AggregationDataQueryResponse,
  DeleteAggregationMutationResponse,
  EditAggregationMutationResponse,
  ReferenceDataAggregationQueryResponse,
} from '../../models/aggregation.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { firstValueFrom, Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { Connection } from '../../utils/graphql/connection.type';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ResourceQueryResponse } from '../../models/resource.model';
import { DashboardService } from '../dashboard/dashboard.service';
import { ReferenceDataQueryResponse } from '../../models/reference-data.model';
import { ContextService } from '../context/context.service';

/** Fallback AggregationConnection */
const FALLBACK_AGGREGATIONS: Connection<Aggregation> = {
  edges: [],
  totalCount: 0,
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
  },
};
/**
 * Shared service to manage aggregations.
 */
@Injectable({
  providedIn: 'root',
})
export class AggregationService {
  /**
   * Service for aggregations
   *
   * @param apollo Apollo service
   * @param dashboardService Shared dashboard service
   * @param contextService Shared context service
   */
  constructor(
    private apollo: Apollo,
    private dashboardService: DashboardService,
    private contextService: ContextService
  ) {}

  /**
   * Gets list of aggregation from resourceId
   *
   * @param options query options
   * @param options.resource resource
   * @param options.referenceData reference data
   * @param options.ids list of aggregation id
   * @param options.first number of items to get
   * @returns Aggregations as Promise
   */
  async getAggregations(options: {
    resource?: string;
    referenceData?: string;
    ids?: string[];
    first?: number;
  }): Promise<Connection<Aggregation>> {
    if (options.resource) {
      return await firstValueFrom(
        this.apollo.query<ResourceQueryResponse>({
          query: GET_RESOURCE_AGGREGATIONS,
          variables: {
            resource: options.resource,
            ids: options.ids,
            first: options.first,
          },
        })
      ).then(async ({ errors, data }) => {
        if (errors) {
          return FALLBACK_AGGREGATIONS;
        } else {
          return data.resource.aggregations || FALLBACK_AGGREGATIONS;
        }
      });
    } else {
      return await firstValueFrom(
        this.apollo.query<ReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA_AGGREGATIONS,
          variables: {
            referenceData: options.referenceData,
            ids: options.ids,
            first: options.first,
          },
        })
      ).then(async ({ errors, data }) => {
        if (errors) {
          return FALLBACK_AGGREGATIONS;
        } else {
          return data.referenceData.aggregations || FALLBACK_AGGREGATIONS;
        }
      });
    }
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param options aggregation options
   * @param options.referenceData reference data Id
   * @param options.resource Resource Id
   * @param options.aggregation Aggregation definition
   * @param options.sourceFields aggregation source fields to fetch
   * @param options.pipeline aggregation pipeline used to build data
   * @param options.mapping aggregation mapping ( category, field, series )
   * @param options.contextFilters context filters, if any
   * @param options.at 'at' argument value, if any
   * @param options.first number of records to fetch, -1 if all of them
   * @param options.referenceDataVariables reference data variables (optional)
   * @returns Aggregation query
   */
  aggregationDataQuery(options: {
    referenceData?: string;
    resource?: string;
    aggregation: string;
    sourceFields?: any;
    pipeline?: any;
    mapping?: any;
    contextFilters?: CompositeFilterDescriptor;
    at?: Date;
    first?: number;
    referenceDataVariables?: any;
  }): Observable<
    ApolloQueryResult<
      AggregationDataQueryResponse | ReferenceDataAggregationQueryResponse
    >
  > {
    if (options.resource) {
      return this.apollo.query<AggregationDataQueryResponse>({
        query: GET_RESOURCE_AGGREGATION_DATA,
        variables: {
          resource: options.resource,
          aggregation: options.aggregation,
          sourceFields: options.sourceFields,
          pipeline: options.pipeline,
          mapping: options.mapping,
          contextFilters: options.contextFilters
            ? this.contextService.injectContext(options.contextFilters)
            : {},
          at: options.at,
          first: options.first,
        },
      });
    } else {
      return this.apollo.query<ReferenceDataAggregationQueryResponse>({
        query: GET_REFERENCE_DATA_AGGREGATION_DATA,
        variables: {
          referenceData: options.referenceData,
          aggregation: options.aggregation,
          sourceFields: options.sourceFields,
          pipeline: options.pipeline,
          mapping: options.mapping,
          contextFilters: options.contextFilters
            ? this.contextService.injectContext(options.contextFilters)
            : {},
          referenceDataVariables: options.referenceDataVariables,
          at: options.at,
          first: options.first,
        },
      });
    }
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param resource Resource Id
   * @param aggregation Aggregation definition
   * @param first size of the page
   * @param skip index of the page
   * @param contextFilters context filters, if any
   * @param at 'at' argument value, if any
   * @returns Aggregation query
   */
  aggregationDataWatchQuery(
    resource: string,
    aggregation: string,
    first: number,
    skip: number,
    contextFilters?: CompositeFilterDescriptor,
    at?: Date
  ): QueryRef<AggregationDataQueryResponse> {
    return this.apollo.watchQuery<AggregationDataQueryResponse>({
      query: GET_RESOURCE_AGGREGATION_DATA,
      variables: {
        resource,
        aggregation,
        first,
        skip,
        contextFilters,
        at,
      },
    });
  }

  /**
   * Edits a aggregation.
   *
   * @param aggregation aggregation to edit
   * @param value new value of the aggregation
   * @param options operation options
   * @param options.resource resource the aggregation is attached to ( optional )
   * @param options.referenceData reference data the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public editAggregation(
    aggregation: Aggregation,
    value: Aggregation,
    options: {
      resource?: string;
      referenceData?: string;
    }
  ) {
    return this.apollo.mutate<EditAggregationMutationResponse>({
      mutation: EDIT_AGGREGATION,
      variables: {
        id: aggregation.id,
        resource: options.resource,
        referenceData: options.referenceData,
        aggregation: value,
      },
    });
  }

  /**
   * Create a new aggregation
   *
   * @param value the value of the aggregation
   * @param options operation options
   * @param options.resource resource the aggregation is attached to ( optional )
   * @param options.referenceData reference data the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public addAggregation(
    value: Aggregation,
    options: {
      resource?: string;
      referenceData?: string;
    }
  ) {
    return this.apollo.mutate<AddAggregationMutationResponse>({
      mutation: ADD_AGGREGATION,
      variables: {
        resource: options.resource,
        referenceData: options.referenceData,
        aggregation: value,
      },
    });
  }

  /**
   * Delete an aggregation
   *
   * @param aggregation aggregation to edit
   * @param options operation options
   * @param options.resource resource the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public deleteAggregation(
    aggregation: Aggregation,
    options: {
      resource?: string;
    }
  ) {
    return this.apollo.mutate<DeleteAggregationMutationResponse>({
      mutation: DELETE_AGGREGATION,
      variables: {
        resource: options.resource,
        id: aggregation.id,
      },
    });
  }
}
