import { gql } from 'apollo-angular';
import { ReferenceData } from '../../../models/reference-data.model';

// === GET REFERENCE DATAS ===
/** Get reference data by id query */
export const GET_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
      modifiedAt
      type
      apiConfiguration {
        name
        graphQLEndpoint
      }
      query
      fields
      valueField
      path
      data
      graphQLFilter
    }
  }
`;

/** Get reference data query response interface */
export interface GetReferenceDataByIdQueryResponse {
  referenceData: ReferenceData;
}
