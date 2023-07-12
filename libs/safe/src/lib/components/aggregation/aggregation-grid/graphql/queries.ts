import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { ReferenceData } from '../../../../models/reference-data.model';

/** Get resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
    }
  }
`;

/** Interface of get resource query */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}

/** Get reference data */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
    }
  }
`;

/** Interface of get reference data query */
export interface GetReferenceDataByIdQueryResponse {
  referenceData: ReferenceData;
}
