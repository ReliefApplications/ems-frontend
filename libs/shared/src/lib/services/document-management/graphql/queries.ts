import { gql } from 'apollo-angular';

/** Get Drive ID query definition */
export const GET_DRIVE_ID = gql`
  query {
    storagedrive(drivetype: 2) {
      driveid
    }
  }
`;

/** Interface of drive query response */
export interface DriveQueryResponse {
  storagedrive: {
    driveid: string;
  };
}

/** Get Occurrence by id query definition */
export const GET_OCCURRENCE_BY_ID = gql`
  query DocumentManagement_GetOccurrenceById($id: String!) {
    occurrence(id: $id) {
      id
      occurrencename
      occurrencetype
      driveid
    }
  }
`;

/** Occurrence Query Response */
export interface OccurrenceQueryResponse {
  occurrence: {
    id: string;
    occurrencename: string;
    occurrencetype: number;
    driveid: string;
  };
}
