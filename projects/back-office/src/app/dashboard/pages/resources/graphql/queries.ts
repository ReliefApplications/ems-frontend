import { gql } from 'apollo-angular';
import { Resource } from '@safe/builder';

/** Graphql query for getting resources with a filter and more data */
export const GET_RESOURCES_EXTENDED = gql`
  query GetResourcesExtended($first: Int, $afterCursor: ID, $filter: JSON) {
    resources(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
          createdAt
          recordsCount
          canDelete
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Model for GetResourcesQueryResponse object */
export interface GetResourcesQueryResponse {
  loading: boolean;
  resources: {
    edges: {
      node: Resource;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
