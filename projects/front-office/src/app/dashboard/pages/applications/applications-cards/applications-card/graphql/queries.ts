import { gql } from 'apollo-angular';

/** Graphql request for getting application informations by its id */
export const GET_APP_INFORMATIONS = gql`
  query GetAppInformations($id: ID!) {
    application(id: $id) {
      pages {
        id
      }
      description
    }
  }
`;

/** Model for GetAppInformationsByIdQueryResponse object */
export interface GetAppInformationsByIdQueryResponse {
  loading: boolean;
  application: {
    pages: string[];
    description: string;
  };
}
