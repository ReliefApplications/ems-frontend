import { gql } from 'apollo-angular';

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

export interface GetAppInformationsByIdQueryResponse {
  loading: boolean;
  application: {
    pages: string[];
    description: string;
  };
}