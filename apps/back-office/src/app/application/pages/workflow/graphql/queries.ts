import { gql } from 'apollo-angular';
import { Form } from '@oort-front/safe';

// === GET FORMS ===

/** Graphql request for getting forms */
export const GET_FORMS = gql`
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
          core
          resource {
            id
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
