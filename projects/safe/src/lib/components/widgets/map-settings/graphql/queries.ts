import { gql } from 'apollo-angular';
import { Form } from '../../../../models/form.model';

// === GET FORMS ===

/** Graphql request for getting forms */
export const GET_FORMS = gql`
  query GetFormNames($first: Int, $afterCursor: ID, $filter: JSON) {
    forms(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
          core
          status
          resource {
            id
            name
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
  loading: boolean;
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
