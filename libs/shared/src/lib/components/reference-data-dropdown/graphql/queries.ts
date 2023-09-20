import { gql } from 'apollo-angular';
import { ReferenceData } from '../../../models/reference-data.model';

// === GET REFERENCE DATAS ===
/** GraphQL query to get list of reference data */
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID) {
    referenceDatas(
      first: $first
      afterCursor: $afterCursor
      sortField: "name"
      sortOrder: "asc"
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

/** List of reference data query response interface */
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

/** Graphql query to get reference data */
export const GET_SHORT_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
    }
  }
`;

/** Interface of get reference data query response */
export interface GetReferenceDataByIdQueryResponse {
  referenceData: ReferenceData;
}
