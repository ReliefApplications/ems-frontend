import { gql } from 'apollo-angular';

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
        authType
      }
      query
      fields
      valueField
      path
      data
      graphQLFilter
      pageInfo {
        strategy
        totalCountField
        pageSizeVar
        offsetVar
        cursorField
        cursorVar
        pageVar
      }
    }
  }
`;
