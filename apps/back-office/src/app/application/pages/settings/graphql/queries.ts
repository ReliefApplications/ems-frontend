import { gql } from 'apollo-angular';

/** Graphql request for getting any existing application with the given shortcut */
export const GET_APPLICATION_WITH_SHORTCUT = gql`
  query getApplicationShortcut($filter: JSON) {
    applications(filter: $filter) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
