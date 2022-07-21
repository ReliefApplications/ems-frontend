import { gql } from 'apollo-angular';
import { ReferenceData } from '@safe/builder';

// === GET REFERENCE DATAS ===
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID) {
    referenceDatas(first: $first, afterCursor: $afterCursor) {
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

export interface GetReferenceDatasQueryResponse {
  loading: boolean;
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
