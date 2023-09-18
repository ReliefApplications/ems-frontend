import { gql } from 'apollo-angular';
import { Form } from '@oort-front/shared';

/** Graphql query for getting forms with minimum details */
export const GET_SHORT_FORMS = gql`
  query GetShortForms(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
  ) {
    forms(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          name
          createdAt
          status
          fields
          versionsCount
          recordsCount
          core
          canSee
          canCreateRecords
          canUpdate
          canDelete
          resource {
            id
            coreForm {
              id
              name
            }
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
