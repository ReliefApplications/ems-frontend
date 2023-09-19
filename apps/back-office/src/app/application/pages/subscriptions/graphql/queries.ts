import { gql } from 'apollo-angular';
import { Form, Application } from '@oort-front/shared';

// === GET FORMS ===

/** Graphql query for getting form names */
export const GET_FORM_NAMES = gql`
  query GetFormNames(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    forms(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
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

/** Model for GetFormsQueryResposne object */
export interface GetFormsQueryResponse {
  forms: {
    edges: {
      node: Form;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET ROUTING KEYS ===

/** Graphql query for getting routing keys with a cursor */
export const GET_ROUTING_KEYS = gql`
  query GetRoutingKeys($first: Int, $afterCursor: ID) {
    applications(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          channels {
            id
            title
            routingKey
          }
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

/** Model for GetRoutingKeysQueryResponse object */
export interface GetRoutingKeysQueryResponse {
  applications: {
    edges: {
      node: Application;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
