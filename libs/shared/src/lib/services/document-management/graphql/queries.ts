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
