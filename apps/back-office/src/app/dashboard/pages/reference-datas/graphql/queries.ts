import { gql } from 'apollo-angular';
import { ReferenceData } from '@oort-front/safe';

// === GET REFERENCE DATAS ===
/** Get list of ref data gql query definition */
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID, $filter: JSON) {
    referenceDatas(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: "name"
      sortOrder: "asc"
    ) {
      edges {
        node {
          id
          name
          modifiedAt
          apiConfiguration {
            id
            name
          }
          type
          permissions {
            canSee {
              id
              title
            }
            canUpdate {
              id
              title
            }
            canDelete {
              id
              title
            }
          }
          canSee
          canUpdate
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

/** Get list of ref data gql query response interface */
export interface GetReferenceDatasQueryResponse {
  referenceDatas: {
    edges: {
      node: ReferenceData;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
