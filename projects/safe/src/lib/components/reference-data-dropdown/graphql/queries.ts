import { gql } from 'apollo-angular';
import { ReferenceData } from '../../../models/reference-data.model';

// === GET REFERENCE DATAS ===
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID) {
    referenceDatas(first: $first, afterCursor: $afterCursor) {
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

export const GET_SHORT_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
    }
  }
`;

export interface GetReferenceDataByIdQueryResponse {
  loading: boolean;
  referenceData: ReferenceData;
}
